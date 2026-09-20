import React from 'react';
import { COPY } from '../../content/copy';
import { unlockAudioContext } from '../../utils/audio';

export default function Landing({ onStart, onSelectPhase, hasProgress }) {
  const handleStart = () => {
    unlockAudioContext();
    onStart();
  };

  const handlePhaseClick = (phaseKey) => {
    unlockAudioContext();
    if (onSelectPhase) onSelectPhase(phaseKey);
  };

  // Row 1: 3 steps; Row 2: 2 steps centered
  const row1Steps = COPY.journeySteps.slice(0, 3);
  const row2Steps = COPY.journeySteps.slice(3, 5);

  const stepColors = {
    wonder: { bg: 'rgba(192, 132, 252, 0.22)', border: '#c084fc', text: '#c084fc' },
    story: { bg: 'rgba(251, 146, 60, 0.22)', border: '#fb923c', text: '#fb923c' },
    simulate: { bg: 'rgba(56, 189, 248, 0.22)', border: '#38bdf8', text: '#38bdf8' },
    play: { bg: 'rgba(74, 222, 128, 0.22)', border: '#4ade80', text: '#4ade80' },
    reflect: { bg: 'rgba(129, 140, 248, 0.22)', border: '#818cf8', text: '#818cf8' },
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-full max-h-screen flex flex-col justify-between items-center py-2 px-4 select-none overflow-hidden text-center font-display">
      {/* Top Curriculum Badge */}
      <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#201548]/90 border-2 border-purple-400/40 text-base sm:text-lg font-black text-white shadow-lg my-1 animate-fadeInUp font-display">
        {COPY.curriculumBadge}
      </div>

      {/* Hero Title */}
      <div className="my-1">
        <h1 className="text-center font-black tracking-tight leading-none">
          <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-display block">
            {COPY.titleMain}
          </span>
          <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#facc15] font-display block drop-shadow-[0_0_28px_rgba(250,204,21,0.7)]">
            {COPY.titleHighlight}
          </span>
        </h1>
      </div>

      {/* Mascot & Speech Bubble */}
      <div className="flex items-center justify-center gap-4 my-1 max-w-3xl mx-auto">
        {/* Lion Avatar in golden circle */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#fbbf24] border-2 border-[#f59e0b] flex items-center justify-center text-4xl sm:text-5xl shadow-2xl flex-shrink-0">
          🦁
        </div>

        {/* White pill speech bubble with pointer tail */}
        <div className="relative bg-white text-slate-900 font-black text-lg sm:text-xl md:text-2xl px-7 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 font-display">
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[12px] border-r-white" />
          <span>{COPY.mascotGreeting}</span>
        </div>
      </div>

      {/* Subtitle Description */}
      <p className="text-center max-w-3xl mx-auto my-1 text-base sm:text-lg md:text-xl text-slate-100 font-extrabold leading-relaxed font-body">
        {COPY.description}
      </p>

      {/* Learning Journey Card */}
      <div className="w-full max-w-3xl mx-auto p-3 sm:p-4 rounded-3xl bg-[#1c1242]/95 border-2 border-white/15 shadow-2xl backdrop-blur-md my-1">
        <div className="text-xs sm:text-sm md:text-base font-black tracking-widest text-[#facc15] uppercase text-center mb-2 font-display">
          {COPY.journeyTitle}
        </div>

        {/* Row 1: Wonder -> Story -> Simulate */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-2">
          {row1Steps.map((step, idx) => {
            const c = stepColors[step.key];
            return (
              <React.Fragment key={step.key}>
                {idx > 0 && (
                  <span className="text-slate-400 font-black text-xl px-0.5">➔</span>
                )}
                <button
                  type="button"
                  onClick={() => handlePhaseClick(step.key)}
                  className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105"
                >
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl mb-1 shadow-md transition-all group-hover:shadow-[0_0_16px_rgba(255,255,255,0.6)]"
                    style={{
                      backgroundColor: c.bg,
                      border: `2px solid ${c.border}`,
                      color: c.text,
                    }}
                  >
                    {step.icon}
                  </div>
                  <span className="font-display font-black text-sm sm:text-base md:text-lg text-white group-hover:text-amber-300 transition-colors">
                    {step.label}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-200 hidden sm:block font-bold leading-none mt-0.5">
                    {step.desc}
                  </span>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Row 2: Practice -> Reflect (Centered) */}
        <div className="flex items-center justify-center gap-6 sm:gap-8">
          {row2Steps.map((step, idx) => {
            const c = stepColors[step.key];
            return (
              <React.Fragment key={step.key}>
                {idx > 0 && (
                  <span className="text-slate-400 font-black text-xl px-0.5">➔</span>
                )}
                <button
                  type="button"
                  onClick={() => handlePhaseClick(step.key)}
                  className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105"
                >
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl mb-1 shadow-md transition-all group-hover:shadow-[0_0_16px_rgba(255,255,255,0.6)]"
                    style={{
                      backgroundColor: c.bg,
                      border: `2px solid ${c.border}`,
                      color: c.text,
                    }}
                  >
                    {step.icon}
                  </div>
                  <span className="font-display font-black text-sm sm:text-base md:text-lg text-white group-hover:text-amber-300 transition-colors">
                    {step.label}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-200 hidden sm:block font-bold leading-none mt-0.5">
                    {step.desc}
                  </span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* CTA Button */}
      <div className="my-1 flex flex-col items-center">
        <button
          onClick={handleStart}
          className="px-14 sm:px-18 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] text-[#1e1b4b] font-black text-xl sm:text-2xl md:text-3xl shadow-[0_0_36px_rgba(245,158,11,0.65)] hover:scale-105 active:scale-95 transition-all cursor-pointer font-display"
        >
          {hasProgress ? COPY.ctaContinue : COPY.ctaBegin}
        </button>
      </div>

      {/* 3 Bottom Feature Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-3xl mx-auto my-1">
        {COPY.featureCards.map((card, i) => (
          <div
            key={i}
            className="p-2.5 sm:p-3 rounded-2xl bg-[#1c1242]/85 border border-white/10 text-center backdrop-blur-sm shadow-md flex flex-col items-center justify-center"
          >
            <div className="text-sm sm:text-base md:text-lg font-black text-white font-display">
              {card.title}
            </div>
            <div className="text-xs sm:text-sm text-slate-200 font-bold mt-0.5">
              {card.subtitle}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
