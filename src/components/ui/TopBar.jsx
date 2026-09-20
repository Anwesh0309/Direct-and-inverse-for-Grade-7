import React from 'react';
import PhaseNav from './PhaseNav';
import { unlockAudioContext } from '../../utils/audio';

export default function TopBar({
  phases,
  currentPhase,
  onNavigate,
  onHome,
  onClose,
  audioEnabled,
  onToggleAudio,
  xp = 0,
}) {
  const handleToggleSound = () => {
    unlockAudioContext();
    onToggleAudio();
  };

  return (
    <header className="w-full grid grid-cols-[1fr_auto_1fr] items-center px-3 sm:px-6 py-2 z-50 select-none">
      {/* Left: Home Button */}
      <div className="flex items-center justify-start">
        <button
          onClick={onHome}
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 border-2 border-white/20 text-xs sm:text-sm font-black font-display text-white shadow-lg transition-all cursor-pointer hover:scale-103 active:scale-97"
          title="Return to Welcome Screen"
          aria-label="Home"
        >
          <span className="text-base sm:text-lg">🏠</span>
          <span>Home</span>
        </button>
      </div>

      {/* Center: Phase Navigation in exact middle */}
      <div className="flex items-center justify-center">
        {phases && (
          <PhaseNav
            phases={phases}
            currentPhase={currentPhase}
            onNavigate={onNavigate}
            audioEnabled={audioEnabled}
            onToggleAudio={handleToggleSound}
          />
        )}
      </div>

      {/* Right: XP Section next to the Close (X) button */}
      <div className="flex items-center justify-end gap-2 sm:gap-2.5">
        {/* XP Badge Pill */}
        {xp > 0 && (
          <div className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#180e38]/95 border-2 border-amber-400/60 text-[#facc15] text-xs sm:text-sm font-black font-display shadow-lg shadow-amber-950/50">
            <span className="text-sm sm:text-base">✨</span>
            <span>{xp} XP</span>
          </div>
        )}

        {/* Blue square Close (X) button */}
        {onClose && (
          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-white flex items-center justify-center font-black text-base sm:text-lg shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Leave Lesson"
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>
    </header>
  );
}
