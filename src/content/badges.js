export const BADGES = [
  { id: 'b_lantern',   icon: '🏮', name: 'Lantern Learner',   desc: 'Complete the Wonder and Story phases' },
  { id: 'b_constant',  icon: '🔬', name: 'Constant Catcher',  desc: 'Earn 3 stars in Station 1: Ratio Table' },
  { id: 'b_graph',     icon: '📈', name: 'Graph Guru',        desc: 'Earn 3 stars in Station 2: Graph Plotter' },
  { id: 'b_product',   icon: '👷', name: 'Product Pro',       desc: 'Earn 3 stars in Station 3: Worker Workshop' },
  { id: 'b_detective', icon: '🕵️', name: 'Master Detective',  desc: 'Earn 3 stars in Station 4: Detective Desk' },
  { id: 'b_mission',   icon: '🚀', name: 'Mission Commander', desc: 'Earn 3 stars in Station 5: Mission Control' },
  { id: 'b_streak',    icon: '🔥', name: 'Streak Star',       desc: 'Answer 10 practice questions correctly in a row' },
  { id: 'b_flawless',  icon: '💎', name: 'Flawless World',    desc: 'Finish a world 10/10 with full hearts & zero hints' },
  { id: 'b_speedster', icon: '⚡', name: 'Speedster',         desc: 'Conquer a timed world with swift precision' },
  { id: 'b_boss',      icon: '🏆', name: 'Peak Conqueror',    desc: 'Defeat the Boss World on Proportion Peak' },
  { id: 'b_reflector', icon: '🪞', name: 'Reflector',         desc: 'Submit your reflections and graduate the module' },
];

export function evaluateBadges(progress, lastRunSummary = null) {
  const earned = new Set(progress.badges || []);
  const newUnlocks = [];

  const check = (id, condition) => {
    if (!earned.has(id) && condition) {
      earned.add(id);
      newUnlocks.push(BADGES.find(b => b.id === id));
    }
  };

  // 1. Lantern Learner
  check('b_lantern', progress.phases.wonder === 'done' && progress.phases.story === 'done');

  // 2-6. Station badges
  if (progress.stations) {
    check('b_constant',  progress.stations['S1']?.stars === 3);
    check('b_graph',     progress.stations['S2']?.stars === 3);
    check('b_product',   progress.stations['S3']?.stars === 3);
    check('b_detective', progress.stations['S4']?.stars === 3);
    check('b_mission',   progress.stations['S5']?.stars === 3);
  }

  // 7. Streak Star
  check('b_streak', (progress.totals?.bestStreak || 0) >= 10);

  // 8. Flawless World
  if (lastRunSummary?.correct === 10 && lastRunSummary?.hearts === 3 && lastRunSummary?.hintsUsed === 0) {
    check('b_flawless', true);
  }

  // 9. Speedster
  if (lastRunSummary?.worldId && ['W8', 'W9'].includes(lastRunSummary.worldId) && lastRunSummary?.stars >= 2) {
    check('b_speedster', true);
  }

  // 10. Peak Conqueror
  check('b_boss', (progress.worlds?.['W10']?.bestStars || 0) >= 1);

  // 11. Reflector
  check('b_reflector', progress.phases.reflect === 'done');

  return { updatedBadges: Array.from(earned), newUnlocks };
}
