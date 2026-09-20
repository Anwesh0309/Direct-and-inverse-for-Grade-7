import React, { useState } from 'react';

const PHASES_CONFIG = [
  { key: 'wonder', num: '01', icon: '🧙‍♂️', label: 'Wonder' },
  { key: 'story', num: '02', icon: '📖', label: 'Story' },
  { key: 'simulate', num: '03', icon: '✏️', label: 'Simulate' },
  { key: 'play', num: '04', icon: '🎮', label: 'Practice' },
  { key: 'reflect', num: '05', icon: '📑', label: 'Reflect' },
];

export default function PhaseNav({
  phases,
  currentPhase,
  onNavigate,
  audioEnabled,
  onToggleAudio,
}) {
  const [shakingKey, setShakingKey] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const handleClick = (phase) => {
    const status = phases[phase.key];
    if (status === 'locked') {
      setShakingKey(phase.key);
      setTooltip('Finish previous step first!');
      setTimeout(() => {
        setShakingKey(null);
        setTooltip(null);
      }, 1500);
      return;
    }
    onNavigate(phase.key);
  };

  return (
    <nav
      className="relative flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 rounded-full bg-[#180e38]/95 border-2 border-white/20 backdrop-blur-md shadow-2xl"
      aria-label="Lesson steps"
    >
      {PHASES_CONFIG.map((phase, idx) => {
        const status = phases[phase.key] || 'locked';
        const isActive = currentPhase === phase.key;
        const isDone = status === 'done';
        const isShaking = shakingKey === phase.key;

        return (
          <React.Fragment key={phase.key}>
            {/* Connector line between phase pills */}
            {idx > 0 && (
              <div
                className={`w-2 sm:w-2.5 h-0.5 rounded-full transition-colors ${
                  isDone || phases[PHASES_CONFIG[idx - 1].key] === 'done'
                    ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                    : 'bg-white/20'
                }`}
              />
            )}

            {/* Phase Pill */}
            <button
              onClick={() => handleClick(phase)}
              className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer select-none font-display ${
                isActive
                  ? 'bg-purple-900/60 text-white ring-2 ring-amber-400 shadow-[0_0_14px_rgba(250,204,21,0.6)] scale-103'
                  : isDone
                  ? 'bg-emerald-500/25 text-emerald-300 hover:bg-emerald-500/35 border border-emerald-500/40'
                  : 'bg-white/10 text-slate-200 hover:bg-white/15 hover:text-white border border-white/10 shadow-sm'
              } ${isShaking ? 'shake-element border-rose-500 text-rose-300' : ''}`}
              title={phase.label}
              aria-current={isActive ? 'step' : undefined}
            >
              <span
                className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black ${
                  isActive
                    ? 'bg-[#facc15] text-[#1e1b4b]'
                    : isDone
                    ? 'bg-emerald-400 text-slate-950'
                    : 'bg-white/25 text-white'
                }`}
              >
                {isDone ? '✓' : phase.num}
              </span>
              <span className="text-sm sm:text-base">{phase.icon}</span>
              <span className="hidden sm:inline text-xs sm:text-sm font-black">{phase.label}</span>
            </button>
          </React.Fragment>
        );
      })}

      {/* Sound Toggle Pill inside nav bar */}
      {onToggleAudio && (
        <button
          onClick={onToggleAudio}
          className={`ml-1 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-black font-display transition-all cursor-pointer shadow-lg select-none ${
            audioEnabled
              ? 'bg-[#1e3a5f] hover:bg-[#254a78] text-sky-200 border border-sky-400/50'
              : 'bg-[#4c1d35] hover:bg-[#5c2340] text-rose-200 border border-[#f43f5e]/50'
          }`}
          title={audioEnabled ? 'Mute Audio' : 'Unmute Audio'}
          aria-label="Toggle Sound"
        >
          <span className="text-sm sm:text-base">{audioEnabled ? '🔊' : '🔇'}</span>
          <span className="hidden sm:inline text-xs sm:text-sm">{audioEnabled ? 'Sound' : 'Muted'}</span>
        </button>
      )}

      {tooltip && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-lg bg-rose-600 text-white text-xs sm:text-sm font-black shadow-2xl z-50 animate-bounce">
          {tooltip}
        </div>
      )}
    </nav>
  );
}
