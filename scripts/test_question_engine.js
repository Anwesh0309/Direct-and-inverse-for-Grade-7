import { TEMPLATES } from '../src/core/questions/templates.js';
import { generateRun, generateQuestion } from '../src/core/questions/questionBank.js';
import { validateQuestion } from '../src/core/questions/validate.js';
import { WORLDS } from '../src/content/worlds.js';

console.log('Testing Question Engine across all templates and worlds...');

let totalGenerated = 0;
let errors = 0;

// Test individual templates
for (const [tId, template] of Object.entries(TEMPLATES)) {
  for (let seed = 1; seed <= 100; seed++) {
    totalGenerated++;
    const q = generateQuestion('W1', 0, tId, seed, 0);
    if (!validateQuestion(q)) {
      console.error(`Validation failed for template ${tId} with seed ${seed}:`, q);
      errors++;
      if (errors > 5) break;
    }
  }
}

// Test generateRun across all 10 worlds
for (const w of WORLDS) {
  for (let run = 1; run <= 20; run++) {
    const questions = generateRun(w.id, run * 1000 + 42, new Set());
    if (questions.length !== 10) {
      console.error(`World ${w.id} run ${run} did not generate 10 questions! Got: ${questions.length}`);
      errors++;
    }
    for (const q of questions) {
      totalGenerated++;
      if (!validateQuestion(q)) {
        console.error(`Question validation failed in ${w.id}:`, q);
        errors++;
      }
    }
  }
}

if (errors === 0) {
  console.log(`✅ PASSED! Tested ${totalGenerated} generated questions. 0 errors detected!`);
} else {
  console.error(`❌ FAILED with ${errors} errors.`);
  process.exit(1);
}
