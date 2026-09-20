const STORAGE_KEY = 'intellia.proportion.g7.v1';

export function getDefaultProgress() {
  const stations = {};
  for (let i = 1; i <= 5; i++) {
    stations[`S${i}`] = {
      unlocked: true,
      stars: 0,
      problemIndex: 0,
      done: false,
    };
  }

  const worlds = {};
  for (let i = 1; i <= 10; i++) {
    worlds[`W${i}`] = {
      unlocked: i === 1,
      bestStars: 0,
      bestPct: 0,
      bestStreak: 0,
      runs: 0,
    };
  }

  return {
    version: 1,
    phases: {
      wonder: 'active',
      story: 'active',
      simulate: 'active',
      play: 'active',
      reflect: 'active',
    },
    storyIndex: 0,
    stations,
    worlds,
    totals: {
      xp: 0,
      stars: 0,
      bestStreak: 0,
    },
    badges: [],
    reflection: {
      text: '',
      completedAt: null,
    },
    settings: {
      audioEnabled: true,
      reducedMotion: 'auto',
    },
    seen: [], // FIFO anti-repeat up to 200
  };
}

export function loadProgress() {
  // Always reset progress whenever entering the module
  const freshProgress = getDefaultProgress();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(freshProgress));
  } catch (e) {
    console.warn('Could not reset progress in localStorage:', e);
  }
  return freshProgress;
}

let saveTimer = null;
export function saveProgress(progress) {
  if (!progress) return;
  if (saveTimer) clearTimeout(saveTimer);

  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Could not save progress to localStorage:', e);
    }
  }, 300);
}

export function resetProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear localStorage:', e);
  }
  return getDefaultProgress();
}
