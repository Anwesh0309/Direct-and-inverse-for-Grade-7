import { mulberry32, hash, shuffle } from '../random/rng.js';
import { WORLD_SLOTS, BOSS_NUMERIC_INDICES } from '../../content/worlds.js';
import { TEMPLATES } from './templates.js';
import { validateQuestion } from './validate.js';
import { normalizeForSpeech } from './speech.js';

export function generateQuestion(worldId, slotIndex, templateId, seed, attempt = 0) {
  const template = TEMPLATES[templateId] || TEMPLATES.QT01;
  const qRng = mulberry32(hash(seed, slotIndex, attempt));

  const raw = template.generate(qRng);

  // Is this a numeric entry question?
  const isBossWorld = worldId === 'W10';
  const isNumeric = isBossWorld && BOSS_NUMERIC_INDICES.has(slotIndex);

  // Construct options: correct answer + 3 distinct distractors
  const correctLabel = raw.answerLabel || String(raw.answer);

  // Filter distractors so none match the correct answer
  const seenLabels = new Set([correctLabel.toLowerCase().trim()]);
  const chosenDistractors = [];

  for (const d of raw.distractors || []) {
    const clean = d.label.toLowerCase().trim();
    if (!seenLabels.has(clean)) {
      seenLabels.add(clean);
      chosenDistractors.push(d.label);
    }
    if (chosenDistractors.length === 3) break;
  }

  // If fewer than 3, fallback distinct variants
  let fallbackDelta = 1;
  while (chosenDistractors.length < 3) {
    const numAns = parseFloat(raw.answer);
    let fallbackLabel;
    if (!isNaN(numAns)) {
      fallbackLabel = String(numAns + fallbackDelta);
    } else {
      fallbackLabel = `Option ${chosenDistractors.length + 2}`;
    }
    if (!seenLabels.has(fallbackLabel.toLowerCase().trim())) {
      seenLabels.add(fallbackLabel.toLowerCase().trim());
      chosenDistractors.push(fallbackLabel);
    }
    fallbackDelta += 2;
  }

  // Shuffle 4 options
  const allOptions = [correctLabel, ...chosenDistractors];
  const shuffled = shuffle(qRng, allOptions);
  const correctIndex = shuffled.indexOf(correctLabel);

  const questionObj = {
    id: `${worldId}-Q${slotIndex + 1}-${attempt}`,
    worldId,
    slotIndex,
    templateId,
    ruleTag: template.ruleTag,
    tier: template.tier,
    numeric: isNumeric,
    visual: template.visual,
    visualData: raw.visualData || null,
    stem: raw.stem,
    speech: raw.speech || normalizeForSpeech(raw.stem),
    options: shuffled,
    correctIndex,
    answer: raw.answer,
    answerLabel: correctLabel,
    solve: raw.solve,
    hints: raw.hints,
    solution: raw.solution,
  };

  return questionObj;
}

export function generateRun(worldId, seed = Date.now(), seenHashes = new Set()) {
  const slotTemplates = WORLD_SLOTS[worldId] || WORLD_SLOTS.W1;
  const questions = [];

  for (let i = 0; i < slotTemplates.length; i++) {
    const templateId = slotTemplates[i];
    let accepted = null;

    for (let attempt = 0; attempt < 50; attempt++) {
      const candidate = generateQuestion(worldId, i, templateId, seed, attempt);
      const qHash = candidate.stem + JSON.stringify(candidate.visualData || '');

      if (validateQuestion(candidate) && !seenHashes.has(qHash)) {
        accepted = candidate;
        seenHashes.add(qHash);
        break;
      }
    }

    // Fallback if 50 attempts didn't yield an unseen question
    if (!accepted) {
      accepted = generateQuestion(worldId, i, templateId, seed, 0);
    }

    questions.push(accepted);
  }

  return questions;
}
