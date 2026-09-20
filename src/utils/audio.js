import { audioMap } from './audioMap';

// Segment creators per TRD §9.1
export const say = (text, speak) => ({ text, style: 'statement', speak });
export const ask = (text, speak) => ({ text, style: 'question', speak });
export const cheer = (text, speak) => ({ text, style: 'encouragement', speak });
export const emphasize = (text, speak) => ({ text, style: 'emphasis', speak });
export const think = (text, speak) => ({ text, style: 'thinking', speak });
export const celebrate = (text, speak) => ({ text, style: 'celebration', speak });
export const instruct = (text, speak) => ({ text, style: 'instruction', speak });

let currentAudio = null;
let currentQueueSymbol = null;
let isAudioMuted = false;
let audioUnlocked = false;

// Audio unlock helper for Safari/Chrome autoplay policy
export function unlockAudioContext() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    // Also init SpeechSynthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  } catch (e) {
    // Ignore audio context errors on restricted environments
  }
}

export function setAudioMuted(muted) {
  isAudioMuted = muted;
  if (muted) {
    stopNarration();
  }
}

export function stopNarration() {
  currentQueueSymbol = Symbol('cancelled');
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Fallback SpeechSynthesis player with British/English female profile
function speakWithWebSpeech(text, style) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window) || isAudioMuted) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();

    // Clean emojis & symbols for natural speech
    const cleanText = text
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/S\$/g, 'Singapore dollars ')
      .replace(/×/g, ' times ')
      .replace(/÷/g, ' divided by ')
      .replace(/k/g, ' kay ');

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Pick an expressive female English voice if available
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => 
      (v.lang.includes('en-GB') || v.lang.includes('en-SG') || v.lang.includes('en-US')) &&
      (v.name.includes('Female') || v.name.includes('Alice') || v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Google UK English Female') || v.name.includes('Natural'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    // Adjust rate and pitch by style
    if (style === 'celebration') {
      utterance.rate = 1.05;
      utterance.pitch = 1.15;
    } else if (style === 'encouragement') {
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
    } else if (style === 'question') {
      utterance.rate = 0.98;
      utterance.pitch = 1.08;
    } else if (style === 'thinking') {
      utterance.rate = 0.92;
      utterance.pitch = 0.98;
    } else {
      utterance.rate = 0.98;
      utterance.pitch = 1.02;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

// Single audio segment playback
function playSegment(segment, queueSymbol) {
  return new Promise((resolve) => {
    if (currentQueueSymbol !== queueSymbol || isAudioMuted) {
      resolve();
      return;
    }

    const audioUrl = audioMap[segment.text];

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      currentAudio = audio;

      audio.onended = () => {
        if (currentAudio === audio) currentAudio = null;
        resolve();
      };

      audio.onerror = () => {
        // Fallback to speech synthesis if mp3 fails or is not found
        speakWithWebSpeech(segment.speak || segment.text, segment.style).then(resolve);
      };

      audio.play().catch(() => {
        // Autoplay blocked -> fallback
        speakWithWebSpeech(segment.speak || segment.text, segment.style).then(resolve);
      });
    } else {
      // Live / fallback speech synthesis
      speakWithWebSpeech(segment.speak || segment.text, segment.style).then(resolve);
    }
  });
}

/**
 * Sequential narration queue with eager preloading
 * @param {Array<{text: string, style?: string, speak?: string}>} segments 
 * @param {boolean} autoplay
 */
export async function narrate(segments, autoplay = true) {
  if (!segments || segments.length === 0 || isAudioMuted || !autoplay) return;

  stopNarration();
  const queueSymbol = Symbol('queue');
  currentQueueSymbol = queueSymbol;

  for (let i = 0; i < segments.length; i++) {
    if (currentQueueSymbol !== queueSymbol) break;

    // Eager preload next segment audio
    if (i + 1 < segments.length && audioMap[segments[i + 1].text]) {
      const nextUrl = audioMap[segments[i + 1].text];
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'audio';
      preloadLink.href = nextUrl;
      document.head.appendChild(preloadLink);
    }

    await playSegment(segments[i], queueSymbol);

    // Subtle natural pause between sentences (280ms)
    if (i + 1 < segments.length && currentQueueSymbol === queueSymbol) {
      await new Promise(r => setTimeout(r, 280));
    }
  }
}
