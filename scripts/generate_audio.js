import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { generateRun } from '../src/core/questions/questionBank.js';
import { normalizeForSpeech } from '../src/core/questions/speech.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_1477a0b0a31e89b834b1e17ca4468c02a6e8bf554f621c5a';
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL_ID = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  celebration:   { stability: 0.15, similarity_boost: 0.50, style: 0.70, use_speaker_boost: true },
  encouragement: { stability: 0.18, similarity_boost: 0.55, style: 0.60, use_speaker_boost: true },
  question:      { stability: 0.22, similarity_boost: 0.60, style: 0.50, use_speaker_boost: true },
  emphasis:      { stability: 0.18, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  thinking:      { stability: 0.25, similarity_boost: 0.65, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.22, similarity_boost: 0.55, style: 0.45, use_speaker_boost: true },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.45, use_speaker_boost: true },
};

// Clean emojis & formatting for ElevenLabs TTS
function cleanTextForSpeech(text) {
  if (!text) return '';
  return text
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // remove emojis
    .replace(/\s+/g, ' ')
    .trim();
}

export const BASE_PHRASES = [
  // Guided Simulation Guidance & Story
  { id: 'A-01', text: "Ready to crack the proportion code? 🎉", style: 'question', speak: "Ready to crack the proportion code?" },
  { id: 'A-02', text: "3 pens cost S$6. 6 pens cost S$12. But 4 painters finish a wall in 6 hours, and 8 painters finish it in only 3. Why does doubling one thing sometimes double the other, and sometimes halve it?", style: 'statement', speak: "Three pens cost six Singapore dollars. Six pens cost twelve Singapore dollars. But four painters finish a wall in six hours, and eight painters finish it in only three. Why does doubling one thing sometimes double the other, and sometimes halve it?" },
  { id: 'A-03', text: "Emma's class is making paper lanterns for the Community Light Festival. Every 3 lanterns need 12 LED lights. Emma wonders how many lights 9 lanterns will need.", style: 'statement' },
  { id: 'A-11', text: "If the lanterns triple, what happens to the lights?", style: 'question' },
  { id: 'A-19', text: "Watch how both numbers grow together! 🏮", style: 'encouragement', speak: "Watch how both numbers grow together!" },
  { id: 'A-04', text: "Lucas writes a table: 3 lanterns need 12 lights, 6 need 24, and 9 need 36. He divides lights by lanterns each time and always gets 4. Emma calls 4 the magic number, k.", style: 'statement', speak: "Lucas writes a table: three lanterns need twelve lights, six need twenty-four, and nine need thirty-six. He divides lights by lanterns each time and always gets four. Emma calls four the magic number, k." },
  { id: 'A-12', text: "What stays the same every time?", style: 'question' },
  { id: 'A-20', text: "When the ratio never changes, it is direct proportion! ✨", style: 'encouragement', speak: "When the ratio never changes, it is direct proportion!" },
  { id: 'A-05', text: "Emma turns the rule into an equation: lights equal 4 times lanterns. When she plots the points, they line up in a straight line that starts where both numbers are zero.", style: 'statement', speak: "Emma turns the rule into an equation: lights equal four times lanterns. When she plots the points, they line up in a straight line that starts where both numbers are zero." },
  { id: 'A-13', text: "Why must the line start at zero?", style: 'question' },
  { id: 'A-21', text: "No lanterns means no lights, so the line starts at the origin! 📈", style: 'encouragement', speak: "No lanterns means no lights, so the line starts at the origin!" },
  { id: 'A-06', text: "Twelve volunteers can fold all the lanterns in 6 hours. Lucas says that 24 volunteers will finish in only 3 hours. When helpers double, the time is cut in half.", style: 'statement', speak: "Twelve volunteers can fold all the lanterns in six hours. Lucas says that twenty-four volunteers will finish in only three hours. When helpers double, the time is cut in half." },
  { id: 'A-14', text: "More helpers… how much less time?", style: 'question', speak: "More helpers... how much less time?" },
  { id: 'A-22', text: "One goes up, the other comes down! 👷", style: 'encouragement', speak: "One goes up, the other comes down!" },
  { id: 'A-07', text: "Emma multiplies helpers by hours: 12 times 6 is 72, 24 times 3 is 72, and 8 times 9 is 72. The product never changes! She writes time equals 72 divided by helpers.", style: 'statement', speak: "Emma multiplies helpers by hours: twelve times six is seventy-two, twenty-four times three is seventy-two, and eight times nine is seventy-two. The product never changes! She writes time equals seventy-two divided by helpers." },
  { id: 'A-15', text: "What stays the same this time?", style: 'question' },
  { id: 'A-23', text: "When the product is constant, it is inverse proportion! 🔁", style: 'encouragement', speak: "When the product is constant, it is inverse proportion!" },
  { id: 'A-08', text: "The lanterns must travel to the fairground by van. At 60 kilometres per hour, the trip takes 45 minutes. At 90 kilometres per hour, Emma checks that it takes only 30 minutes, because speed times time is the same distance.", style: 'statement', speak: "The lanterns must travel to the fairground by van. At sixty kilometres per hour, the trip takes forty-five minutes. At ninety kilometres per hour, Emma checks that it takes only thirty minutes, because speed times time is the same distance." },
  { id: 'A-16', text: "Does double the speed give double the time?", style: 'question' },
  { id: 'A-24', text: "A faster van means less time. That is a flip, not a match! 🚐", style: 'encouragement', speak: "A faster van means less time. That is a flip, not a match!" },
  { id: 'A-09', text: "Noah says, 'Jack is 8 years old and 1.2 metres tall, so at 16 he must be 2.4 metres!' Emma shakes her head. Doubling the age does not double the height, so this is not proportion.", style: 'statement', speak: "Noah says, 'Jack is eight years old and one point two metres tall, so at sixteen he must be two point four metres!' Emma shakes her head. Doubling the age does not double the height, so this is not proportion." },
  { id: 'A-17', text: "How can we test if it is proportion?", style: 'question' },
  { id: 'A-25', text: "Try the divide test and the multiply test. If neither stays fixed, it is neither! 🕵️", style: 'encouragement', speak: "Try the divide test and the multiply test. If neither stays fixed, it is neither!" },
  { id: 'A-10', text: "At the fair, 5 lanterns cost S$35, so one lantern costs S$7, and 12 lanterns cost S$84. Then 6 friends wrap gifts in 10 minutes, so one friend alone would need 60 minutes. The festival lights up!", style: 'statement', speak: "At the fair, five lanterns cost thirty-five Singapore dollars, so one lantern costs seven Singapore dollars, and twelve lanterns cost eighty-four Singapore dollars. Then six friends wrap gifts in ten minutes, so one friend alone would need sixty minutes. The festival lights up!" },
  { id: 'A-18', text: "Direct or inverse — which detective test will you use?", style: 'question', speak: "Direct or inverse, which detective test will you use?" },
  { id: 'A-26', text: "You are ready to be a Proportion Detective. Let's go to the lab! 🔬", style: 'encouragement', speak: "You are ready to be a Proportion Detective. Let's go to the lab!" },
  { id: 'A-27', text: "Pick a station and let's explore how numbers change together!", style: 'instruction' },
  { id: 'A-28', text: "Fill the table, then press the test button. If every ratio matches, it is direct proportion!", style: 'instruction' },
  { id: 'A-29', text: "Move the slider to make the line pass through the dot. What is k?", style: 'instruction' },
  { id: 'A-30', text: "Add or remove workers. Watch the time change while the area stays the same!", style: 'instruction' },
  { id: 'A-31', text: "Use the divide test and the multiply test, then sort each card.", style: 'instruction' },
  { id: 'A-32', text: "Choose a method, put the steps in order, and solve the mission!", style: 'instruction' },
  { id: 'A-33', text: "Answer questions in each world. Earn stars and XP!", style: 'statement' },
  { id: 'A-34', text: "What did you learn about direct and inverse proportion? Explain it to Leo with an example!", style: 'question' },
  { id: 'A-35', text: "Brilliant! You spotted the constant!", style: 'celebration' },
  { id: 'A-36', text: "Yes! That is the pattern!", style: 'celebration' },
  { id: 'A-37', text: "Fantastic, you are a proportion detective!", style: 'celebration' },
  { id: 'A-41', text: "Good try! Check the constant again.", style: 'encouragement' },
  { id: 'A-42', text: "Almost! Try the other test.", style: 'encouragement' },
  { id: 'A-43', text: "Every mistake teaches us something!", style: 'encouragement' },
  { id: 'A-47', text: "Divide test: the same answer every time means direct.", style: 'emphasis' },
  { id: 'A-48', text: "Multiply test: the same product every time means inverse.", style: 'emphasis' },
  { id: 'A-49', text: "If neither test works, it is neither!", style: 'emphasis' },
  { id: 'A-50', text: "The line for direct proportion starts at the origin.", style: 'emphasis' }
];

function textToFilename(text) {
  const hash = crypto.createHash('md5').update(text).digest('hex').slice(0, 10);
  const clean = text
    .slice(0, 24)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return `${clean}_${hash}.mp3`;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Collect all practice questions & hints across all 10 worlds
function collectAllPhrases() {
  const map = new Map();

  // Add base guided simulation phrases
  for (const item of BASE_PHRASES) {
    const speakText = cleanTextForSpeech(normalizeForSpeech(item.speak || item.text));
    map.set(item.text, {
      text: item.text,
      speak: speakText,
      style: item.style || 'statement'
    });
  }

  // Add Practice Questions & Hints across all 10 Worlds (for deterministic seeds)
  const worlds = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'];
  const seedsToGenerate = [42, 101, 202, 303]; // seeds for standard runs

  for (const seed of seedsToGenerate) {
    for (const wId of worlds) {
      const questions = generateRun(wId, seed);
      for (const q of questions) {
        // Question Stem / Speech
        if (q.stem && !map.has(q.stem)) {
          const rawSpeak = q.speech || normalizeForSpeech(q.stem);
          const speakText = cleanTextForSpeech(rawSpeak);
          map.set(q.stem, {
            text: q.stem,
            speak: speakText,
            style: 'question'
          });
        }

        // Hints
        for (const hint of q.hints || []) {
          if (hint && !map.has(hint)) {
            const rawSpeak = normalizeForSpeech(hint);
            const speakText = cleanTextForSpeech(rawSpeak);
            map.set(hint, {
              text: hint,
              speak: speakText,
              style: 'thinking'
            });
          }
        }
      }
    }
  }

  return Array.from(map.values());
}

async function generateSingleAudio(item, audioDir, apiKey, voiceId) {
  const filename = textToFilename(item.text);
  const filepath = path.join(audioDir, filename);
  const publicUrl = `/assets/audio/${filename}`;

  if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
    return { text: item.text, url: publicUrl, status: 'cached' };
  }

  const textToSpeak = item.speak || item.text;
  const settings = VOICE_SETTINGS[item.style] || VOICE_SETTINGS.statement;

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_64`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: textToSpeak,
        model_id: MODEL_ID,
        voice_settings: settings,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Error generating [${item.style}]: "${item.text.slice(0, 30)}..."`, response.status, errText);
      return { text: item.text, url: null, status: 'error' };
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filepath, buffer);
    console.log(`✓ Saved ${filename} (${buffer.length} bytes) for: "${textToSpeak.slice(0, 35)}..."`);
    return { text: item.text, url: publicUrl, status: 'generated' };
  } catch (err) {
    console.error(`Failed to generate: "${item.text.slice(0, 30)}..."`, err);
    return { text: item.text, url: null, status: 'error' };
  }
}

async function generate() {
  const audioDir = path.join(__dirname, '../public/assets/audio');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  const phrases = collectAllPhrases();
  console.log(`Starting audio generation for ${phrases.length} phrases using ElevenLabs API...`);
  console.log(`Voice ID: ${VOICE_ID}`);

  const audioMap = {};
  const concurrency = 3;
  let index = 0;
  let cachedCount = 0;
  let generatedCount = 0;
  let errorCount = 0;

  async function worker() {
    while (index < phrases.length) {
      const i = index++;
      const item = phrases[i];
      const result = await generateSingleAudio(item, audioDir, API_KEY, VOICE_ID);

      if (result.url) {
        audioMap[result.text] = result.url;
        if (result.status === 'cached') cachedCount++;
        else if (result.status === 'generated') generatedCount++;
      } else {
        errorCount++;
      }

      // Small delay between requests per worker
      await sleep(150);
    }
  }

  const workers = [];
  for (let w = 0; w < concurrency; w++) {
    workers.push(worker());
  }

  await Promise.all(workers);

  console.log(`\n=== Audio Generation Complete ===`);
  console.log(`Total phrases: ${phrases.length}`);
  console.log(`Cached: ${cachedCount}`);
  console.log(`Newly Generated: ${generatedCount}`);
  console.log(`Errors: ${errorCount}`);

  // Save updated src/utils/audioMap.js
  const mapPath = path.join(__dirname, '../src/utils/audioMap.js');
  const fileContent = `// Auto-generated by scripts/generate_audio.js\n// Exact text match lookup for zero-latency ElevenLabs audio\n\nexport const audioMap = ${JSON.stringify(audioMap, null, 2)};\n`;
  fs.writeFileSync(mapPath, fileContent, 'utf-8');
  console.log(`✓ Saved ${mapPath} with ${Object.keys(audioMap).length} entries.`);
}

generate();
