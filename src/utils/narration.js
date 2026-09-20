import { say, ask, cheer, instruct, celebrate, emphasize, think } from './audio';
import { STORY } from '../content/story';

export function landingNarration() {
  return [
    ask("Ready to crack the proportion code? 🎉", "Ready to crack the proportion code?")
  ];
}

export function wonderNarration() {
  return [
    say(
      "3 pens cost S$6. 6 pens cost S$12. But 4 painters finish a wall in 6 hours, and 8 painters finish it in only 3. Why does doubling one thing sometimes double the other, and sometimes halve it?",
      "Three pens cost six Singapore dollars. Six pens cost twelve Singapore dollars. But four painters finish a wall in six hours, and eight painters finish it in only three. Why does doubling one thing sometimes double the other, and sometimes halve it?"
    )
  ];
}

export function getStoryNarration(slideIndex) {
  const slide = STORY[slideIndex];
  if (!slide) return [];
  return [
    say(slide.text, slide.speak || slide.text),
    ask(slide.quote),
    cheer(slide.leo, slide.leoSpeak || slide.leo)
  ];
}

export function simRailIntroNarration() {
  return [
    instruct("Pick a station and let's explore how numbers change together!")
  ];
}

export function stationIntroNarration(stationId) {
  switch (stationId) {
    case 'S1':
      return [instruct("Fill the table, then press the test button. If every ratio matches, it is direct proportion!")];
    case 'S2':
      return [instruct("Move the slider to make the line pass through the dot. What is k?")];
    case 'S3':
      return [instruct("Add or remove workers. Watch the time change while the area stays the same!")];
    case 'S4':
      return [instruct("Use the divide test and the multiply test, then sort each card.")];
    case 'S5':
      return [instruct("Choose a method, put the steps in order, and solve the mission!")];
    default:
      return [];
  }
}

export function worldSelectNarration() {
  return [
    say("Answer questions in each world. Earn stars and XP!")
  ];
}

export function questionNarration(q) {
  if (!q) return [];
  return [
    ask(q.stem, q.speech || q.stem)
  ];
}

export function hintNarration(hintText) {
  if (!hintText) return [];
  return [
    think(hintText)
  ];
}

export function feedbackNarration(isCorrect) {
  if (isCorrect) {
    const praises = [
      "Brilliant! You spotted the constant!",
      "Yes! That is the pattern!",
      "Fantastic, you are a proportion detective!"
    ];
    const pick = praises[Math.floor(Math.random() * praises.length)];
    return [celebrate(pick)];
  } else {
    const encouragements = [
      "Good try! Check the constant again.",
      "Almost! Try the other test.",
      "Every mistake teaches us something!"
    ];
    const pick = encouragements[Math.floor(Math.random() * encouragements.length)];
    return [cheer(pick)];
  }
}

export function reflectPromptNarration() {
  return [
    ask("What did you learn about direct and inverse proportion? Explain it to Leo with an example!")
  ];
}

export function ruleReminderNarration(ruleType) {
  switch (ruleType) {
    case 'divide':
      return [emphasize("Divide test: the same answer every time means direct.")];
    case 'multiply':
      return [emphasize("Multiply test: the same product every time means inverse.")];
    case 'origin':
      return [emphasize("The line for direct proportion starts at the origin.")];
    case 'neither':
      return [emphasize("If neither test works, it is neither!")];
    default:
      return [];
  }
}
