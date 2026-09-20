import React from 'react';
import { WORLDS } from '../../content/worlds';
import { worldUnlocked } from '../../core/gamification/unlock';

export default function WorldSelect({ worldsProgress, onSelectWorld }) {
  return (
    <div className="w-full max-w-6xl mx-auto h-full flex flex-col justify-between items-center py-2 px-4 select-none overflow-hidden text-center font-display">
      {/* Top Heading */}
      <div className="text-center my-1">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white font-display flex items-center justify-center gap-3">
          <span className="text-3xl sm:text-4xl lg:text-5xl">🎮</span>
          <span>Practice — Choose Your World!</span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-100 font-extrabold mt-1 font-body">
          Answer questions in each world. Earn stars and XP!
        </p>
      </div>

      {/* 5x2 Grid of 10 Worlds */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 sm:gap-4 w-full my-auto p-1 max-h-[82vh] overflow-y-auto custom-scrollbar">
        {WORLDS.map((w, idx) => {
          const wNum = idx + 1;
          const isUnlocked = worldUnlocked(wNum, worldsProgress);
          const progress = worldsProgress[w.id] || {};
          const stars = progress.bestStars || 0;
          const isCompleted = stars >= 1;

          if (!isUnlocked) {
            return (
              <div
                key={w.id}
                className="relative bg-[#150a31]/75 border-2 border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col items-center justify-between text-center min-h-[165px] sm:min-h-[185px] opacity-45 select-none"
              >
                {/* Lock icon */}
                <div className="absolute top-2.5 right-2.5 text-lg sm:text-xl text-slate-300">
                  🔒
                </div>

                {/* World Icon Badge */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0f0724] border border-white/10 flex items-center justify-center my-0.5 shadow-inner">
                  <span className="text-4xl sm:text-5xl filter grayscale opacity-60">
                    {w.icon}
                  </span>
                </div>

                {/* World Name */}
                <h4 className="font-display font-black text-base sm:text-lg md:text-xl text-slate-300 leading-tight my-0.5">
                  {w.name}
                </h4>

                {/* Questions Range */}
                <span className="text-xs sm:text-sm md:text-base text-slate-400 font-bold">
                  Questions {w.range[0]}–{w.range[1]}
                </span>

                <div className="h-8" />
              </div>
            );
          }

          return (
            <div
              key={w.id}
              onClick={() => onSelectWorld(w.id)}
              className="relative bg-[#25154f]/95 border-2 border-purple-400/70 hover:border-purple-300 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 flex flex-col items-center justify-between text-center min-h-[165px] sm:min-h-[185px] shadow-2xl shadow-purple-950/70 hover:scale-104 transition-all cursor-pointer select-none group"
            >
              {/* World Icon Badge */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-[#341b6d] to-[#1c0c3f] border-2 border-purple-300/40 flex items-center justify-center my-0.5 shadow-lg group-hover:scale-108 group-hover:border-purple-300 transition-all">
                <span className="text-4xl sm:text-5xl md:text-6xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
                  {w.icon}
                </span>
              </div>

              {/* World Name */}
              <h4 className="font-display font-black text-base sm:text-lg md:text-xl lg:text-2xl text-white leading-tight my-0.5">
                {w.name}
              </h4>

              {/* Questions Range */}
              <span className="text-xs sm:text-sm md:text-base text-amber-200 font-black mb-1">
                Questions {w.range[0]}–{w.range[1]}
              </span>

              {/* Pink Practice Button */}
              <div className="w-full mt-auto">
                {isCompleted ? (
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-base sm:text-lg font-black text-amber-300 font-display leading-none">
                      {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
                    </span>
                    <span className="w-full py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#ec4899] to-[#f43f5e] text-white font-display font-black text-xs sm:text-sm md:text-base shadow-lg flex items-center justify-center gap-1.5 uppercase tracking-wider group-hover:brightness-110 transition-all">
                      ▶ REPLAY
                    </span>
                  </div>
                ) : (
                  <span className="w-full py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#ec4899] to-[#f43f5e] text-white font-display font-black text-xs sm:text-sm md:text-base shadow-[0_0_18px_rgba(236,72,153,0.6)] flex items-center justify-center gap-1.5 uppercase tracking-wider group-hover:brightness-110 transition-all">
                    ▶ PRACTICE
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
