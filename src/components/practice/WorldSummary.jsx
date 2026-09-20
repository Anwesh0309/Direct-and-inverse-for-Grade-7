import React from 'react';
import Mascot from '../ui/Mascot';
import Button from '../ui/Button';

export default function WorldSummary({
  worldId,
  worldName,
  stars = 0,
  accuracy = 0,
  streak = 0,
  xpEarned = 0,
  correctCount = 0,
  unlockedBadges = [],
  onReplay,
  onNextWorld,
}) {
  const canUnlockNext = correctCount >= 4;

  return (
    <div className="glass-card w-full max-w-xl mx-auto my-auto p-5 sm:p-6 text-center flex flex-col items-center select-none animate-fadeInUp">
      <Mascot state={canUnlockNext ? 'celebrating' : 'thinking'} size={68} />

      <h2 className="text-2xl sm:text-3xl font-black text-white font-display my-1">
        {canUnlockNext ? '🎉 World Complete!' : 'World Finished!'}
      </h2>
      <p className="text-sm sm:text-base font-black text-amber-300 mb-2">
        {worldName} Summary ({correctCount}/10 Correct)
      </p>

      {/* Stars Display */}
      <div className="text-3xl sm:text-4xl text-amber-400 my-2 drop-shadow-[0_0_16px_rgba(250,204,21,0.6)] font-display tracking-widest">
        {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2.5 w-full my-3">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-xs font-black text-slate-300 uppercase font-display block">Accuracy</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 font-display">{accuracy}%</span>
        </div>
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-xs font-black text-slate-300 uppercase font-display block">Best Streak</span>
          <span className="text-xl sm:text-2xl font-black text-amber-400 font-display">{streak}🔥</span>
        </div>
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-xs font-black text-slate-300 uppercase font-display block">XP Earned</span>
          <span className="text-xl sm:text-2xl font-black text-purple-300 font-display">+{xpEarned} ✨</span>
        </div>
      </div>

      {/* Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <div className="w-full my-2 p-2.5 rounded-2xl bg-amber-500/15 border border-amber-400/40">
          <span className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider font-display block mb-1">
            New Badge Unlocked!
          </span>
          <div className="flex items-center justify-center gap-2">
            {unlockedBadges.map((b) => (
              <span key={b.id} className="text-3xl" title={b.name}>
                {b.icon}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notice if not unlocked next world */}
      {!canUnlockNext && (
        <div className="w-full my-2 p-2.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-xs sm:text-sm font-bold text-rose-200">
          Get 4 or more correct answers out of 10 to unlock the next world! (You got {correctCount}/10)
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 w-full mt-3">
        <Button variant="secondary" size="md" onClick={onReplay} className="flex-1 text-base sm:text-lg font-black py-2.5">
          {canUnlockNext ? 'Replay ↺' : 'Try Again 🔄'}
        </Button>
        {canUnlockNext && (
          <Button variant="gold" size="md" onClick={onNextWorld} className="flex-1 shadow-lg text-base sm:text-lg font-black py-2.5">
            Next World ➔
          </Button>
        )}
      </div>
    </div>
  );
}
