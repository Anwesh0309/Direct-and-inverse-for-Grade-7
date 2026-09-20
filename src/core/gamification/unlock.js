export const PRACTICE_UNLOCK_STATIONS = 0;

export function canOpenPhase(phaseKey, phases) {
  // All phases are unlocked
  return true;
}

export function canEnterPractice(stations) {
  // Practice phase is unlocked
  return true;
}

export function worldUnlocked(worldIndex, worlds) {
  // worldIndex is 1-based (1..10)
  // Only World 1 is unlocked initially; each subsequent world requires >= 4 correct answers on previous world
  if (worldIndex === 1) return true;
  const prevWorldId = `W${worldIndex - 1}`;
  const prevWorld = worlds[prevWorldId];
  return Boolean(prevWorld?.unlocked && ((prevWorld?.bestCorrect >= 4) || (prevWorld?.bestPct >= 40) || (prevWorld?.bestStars >= 1)));
}

export function canEnterReflect(worlds) {
  // Reflect phase is unlocked
  return true;
}
