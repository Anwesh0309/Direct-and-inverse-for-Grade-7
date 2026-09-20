export const BASE_XP = { 1: 10, 2: 15, 3: 20, 4: 25 };

export const streakMult = (streak) => Math.min(2.0, 1.0 + Math.floor(streak / 3) * 0.25);

export function xpForCorrect({ tier = 1, streak = 0, hintTiersUsed = [], timeLeft = 0, timed = false }) {
  const base = BASE_XP[tier] || 10;
  const mult = streakMult(streak);
  const hintPenalty = 5 * hintTiersUsed.filter(t => t >= 2).length;
  const timeBonus = timed ? Math.min(8, Math.floor(timeLeft / 5)) : 0;
  return Math.max(2, Math.round(base * mult) - hintPenalty + timeBonus);
}
