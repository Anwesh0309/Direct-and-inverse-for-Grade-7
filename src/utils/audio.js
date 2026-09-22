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

/**
 * Unlock AudioContext on first user gesture for browser autoplay policy
 */
export function unlockAudioContext() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  } catch (e) {
    // Ignore context errors
  }
}

export function setAudioMuted(muted) {
  isAudioMuted = muted;
  if (muted) {
    stopNarration();
  }
}

/**
 * Immediately stop all playing audio and cancel current narration queue
 */
export function stopNarration() {
  // Invalidate current queue symbol so pending promises abort
  currentQueueSymbol = Symbol('cancelled');
  
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {
      // Ignore pause errors
    }
    currentAudio = null;
  }
}

/**
 * Single audio segment playback using ONLY ElevenLabs Voice ID Xb7hH8MSUJpSbSDYk0k2
 * @param {{text: string, style?: string, speak?: string}} segment 
 * @param {Symbol} queueSymbol 
 */
function playSegment(segment, queueSymbol) {
  return new Promise((resolve) => {
    // Check if cancelled or muted before starting
    if (currentQueueSymbol !== queueSymbol || isAudioMuted) {
      resolve();
      return;
    }

    // Halt any leftover audio immediately
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      } catch (e) {}
      currentAudio = null;
    }

    const audioUrl = audioMap[segment.text];

    if (!audioUrl) {
      console.warn(`[Audio] Missing mp3 mapping for ElevenLabs voice Xb7hH8MSUJpSbSDYk0k2: "${segment.text}"`);
      resolve();
      return;
    }

    const audio = new Audio(audioUrl);
    currentAudio = audio;

    let cleanupDone = false;
    const finish = () => {
      if (cleanupDone) return;
      cleanupDone = true;
      if (currentAudio === audio) {
        currentAudio = null;
      }
      resolve();
    };

    audio.onended = finish;
    audio.onerror = finish;
    audio.onpause = () => {
      // If paused due to stopNarration, resolve immediately
      if (currentQueueSymbol !== queueSymbol) {
        finish();
      }
    };

    audio.play().catch(() => {
      finish();
    });
  });
}

/**
 * Sequential narration queue using exclusively ElevenLabs Voice ID Xb7hH8MSUJpSbSDYk0k2
 * @param {Array<{text: string, style?: string, speak?: string}>} segments 
 * @param {boolean} autoplay
 */
export async function narrate(segments, autoplay = true) {
  if (!segments || segments.length === 0 || isAudioMuted || !autoplay) return;

  // Halt any previously playing narration queue immediately
  stopNarration();

  const queueSymbol = Symbol('queue');
  currentQueueSymbol = queueSymbol;

  for (let i = 0; i < segments.length; i++) {
    // Stop loop if user navigated or new narration was triggered
    if (currentQueueSymbol !== queueSymbol) break;

    // Preload next segment audio for smooth playback
    if (i + 1 < segments.length && audioMap[segments[i + 1].text]) {
      const nextUrl = audioMap[segments[i + 1].text];
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'audio';
      preloadLink.href = nextUrl;
      document.head.appendChild(preloadLink);
    }

    await playSegment(segments[i], queueSymbol);

    // Subtle natural pause between sentences (250ms)
    if (i + 1 < segments.length && currentQueueSymbol === queueSymbol) {
      await new Promise(r => setTimeout(r, 250));
    }
  }
}
