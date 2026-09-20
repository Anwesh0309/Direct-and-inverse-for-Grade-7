import React, { useState, useEffect } from 'react';
import Mascot from '../ui/Mascot';
import { WORLDS } from '../../content/worlds';
import { fireSuperConfetti } from '../ui/Confetti';
import { narrate } from '../../utils/audio';
import { reflectPromptNarration } from '../../utils/narration';

export default function Reflect({
  totals,
  worldsProgress,
  reflectionData,
  onSaveReflection,
  onCompleteLesson,
  audioEnabled,
}) {
  const [reflectionText, setReflectionText] = useState(reflectionData?.text || '');
  const [completed, setCompleted] = useState(!!reflectionData?.completedAt);

  const minChars = 10;
  const isEligible = reflectionText.trim().length >= minChars;

  useEffect(() => {
    if (audioEnabled && !completed) {
      narrate(reflectPromptNarration(), true);
    }
  }, [audioEnabled, completed]);

  const handleComplete = () => {
    if (!isEligible) return;
    setCompleted(true);
    fireSuperConfetti();
    onSaveReflection(reflectionText);
    onCompleteLesson();
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-full flex flex-col justify-center items-center py-2 px-4 select-none overflow-hidden text-center font-display">
      {/* Main Card Container */}
      <div className="w-full bg-[#1c1242]/95 border-2 border-white/15 rounded-[32px] sm:rounded-[40px] p-4 sm:p-6 md:p-8 flex flex-col items-center justify-between text-center shadow-2xl backdrop-blur-xl my-auto max-h-[85vh] overflow-hidden">
        {/* Top glowing purple/indigo indicator line */}
        <div className="w-20 sm:w-24 h-1.5 sm:h-2 rounded-full bg-[#818cf8] shadow-[0_0_18px_#818cf8] mb-2 mx-auto" />

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white font-display mb-2 flex items-center justify-center gap-3">
          <span className="text-2xl sm:text-3xl lg:text-4xl">🏆</span>
          <span>Reflect & Scoreboard</span>
        </h2>

        {/* 3 Stat Cards in a row */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-2xl mx-auto my-2">
          {/* Card 1: Total XP */}
          <div className="bg-[#160b33]/90 border-2 border-white/15 rounded-2xl sm:rounded-3xl p-3 sm:p-4 text-center flex flex-col items-center justify-center shadow-md">
            <span className="text-xl sm:text-2xl">✨</span>
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#facc15] font-display my-1">
              {totals.xp}
            </div>
            <span className="text-xs sm:text-sm md:text-base font-black text-slate-200 font-display">
              Total XP
            </span>
          </div>

          {/* Card 2: Stars */}
          <div className="bg-[#160b33]/90 border-2 border-white/15 rounded-2xl sm:rounded-3xl p-3 sm:p-4 text-center flex flex-col items-center justify-center shadow-md">
            <span className="text-xl sm:text-2xl">⭐</span>
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#facc15] font-display my-1">
              {totals.stars} / 30
            </div>
            <span className="text-xs sm:text-sm md:text-base font-black text-slate-200 font-display">
              Stars
            </span>
          </div>

          {/* Card 3: Best Streak */}
          <div className="bg-[#160b33]/90 border-2 border-white/15 rounded-2xl sm:rounded-3xl p-3 sm:p-4 text-center flex flex-col items-center justify-center shadow-md">
            <span className="text-xl sm:text-2xl">🔥</span>
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#facc15] font-display my-1">
              {totals.bestStreak}
            </div>
            <span className="text-xs sm:text-sm md:text-base font-black text-slate-200 font-display">
              Best Streak
            </span>
          </div>
        </div>

        {/* WORLD RESULTS Header & 10 World Pills */}
        <div className="w-full max-w-2xl mx-auto my-2">
          <div className="text-xs sm:text-sm md:text-base font-black text-[#facc15] tracking-widest uppercase mb-1.5 font-display text-center">
            WORLD RESULTS
          </div>
          <div className="grid grid-cols-10 gap-1.5 sm:gap-2 w-full">
            {WORLDS.map((w) => {
              const progress = worldsProgress[w.id];
              const hasPlayed = progress && progress.runs > 0;
              return (
                <div
                  key={w.id}
                  className="rounded-xl sm:rounded-2xl bg-[#160b33]/90 border border-white/15 p-1.5 sm:p-2 text-center flex flex-col items-center justify-center min-h-[44px] sm:min-h-[50px]"
                >
                  <span className="font-display font-black text-xs sm:text-sm text-white">
                    {w.id}
                  </span>
                  <span className="text-sm sm:text-base text-amber-300 font-black mt-0.5">
                    {hasPlayed ? '★'.repeat(progress.bestStars) : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Thin Divider Line */}
        <div className="w-full max-w-2xl mx-auto h-px bg-white/15 my-2" />

        {/* Prompt & Reflection Textarea */}
        {completed ? (
          <div className="w-full max-w-xl mx-auto p-4 sm:p-6 rounded-3xl certificate-card my-2 text-center animate-fadeInUp">
            <Mascot state="celebrating" size={68} />
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gold font-display my-2">
              🎓 Official Master Proportion Detective!
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-slate-100 font-bold max-w-lg mx-auto leading-relaxed mb-3">
              Congratulations! You have mastered Direct &amp; Inverse Proportion!
            </p>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/15 text-left text-sm sm:text-base md:text-lg text-purple-200 italic font-body">
              "{reflectionText}"
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto my-2 flex flex-col items-center text-center">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white font-display mb-2 text-center">
              What did you learn about proportion? Explain it to Leo with an example!
            </p>

            <div className="w-full flex items-center gap-4">
              {/* Mascot Avatar on left */}
              <div className="flex-shrink-0">
                <Mascot state="thinking" size={64} />
              </div>

              {/* Textarea container with inner character counter */}
              <div className="flex-1 relative bg-[#140a2c]/95 border-2 border-white/20 rounded-2xl p-3 sm:p-4 text-left shadow-inner focus-within:border-amber-400 transition-colors">
                <textarea
                  rows={2}
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="Dear Leo, proportion is when..."
                  className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 text-sm sm:text-base md:text-lg font-bold focus:outline-none resize-none pr-2 leading-relaxed"
                />
                <div className="flex justify-end mt-1">
                  <span className={`text-xs sm:text-sm font-bold ${isEligible ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {reflectionText.trim().length} / {minChars} min chars
                  </span>
                </div>
              </div>
            </div>

            {/* Complete Lesson Button */}
            <button
              disabled={!isEligible}
              onClick={handleComplete}
              className={`mt-3 sm:mt-4 px-10 sm:px-14 py-3 sm:py-3.5 rounded-full font-display font-black text-base sm:text-lg md:text-xl shadow-[0_0_28px_rgba(245,158,11,0.6)] transition-all flex items-center gap-3 ${
                isEligible
                  ? 'bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] text-[#1e1b4b] hover:scale-105 active:scale-95 cursor-pointer'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <span>Complete Lesson! 🎉</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
