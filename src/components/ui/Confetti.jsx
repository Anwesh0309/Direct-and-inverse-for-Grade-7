import confetti from 'canvas-confetti';

export function fireConfetti(options = {}) {
  try {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#facc15', '#8b5cf6', '#38bdf8', '#4ade80', '#fb923c'],
      ...options,
    });
  } catch (e) {
    // Ignore if canvas confetti fails or reduced motion
  }
}

export function fireSuperConfetti() {
  fireConfetti({ particleCount: 120, spread: 100 });
  setTimeout(() => fireConfetti({ particleCount: 80, spread: 120 }), 250);
}
