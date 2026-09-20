import React from 'react';
import Mascot from './Mascot';

export default function HintBubble({ tier = 1, text, onNextTier, maxTiers = 3 }) {
  const tierTitles = {
    1: '💡 Concept Nudge',
    2: '🔍 Helpful Structure',
    3: '📝 Worked Step'
  };

  return (
    <div className="relative flex items-start gap-3.5 p-3 sm:p-4 rounded-2xl bg-purple-950/90 border-2 border-purple-400/50 shadow-xl backdrop-blur-md max-w-lg w-full mx-auto my-1 animate-fadeInUp select-none">
      {/* Mascot Icon */}
      <div className="flex-shrink-0">
        <Mascot state="thinking" size={52} />
      </div>

      {/* Content */}
      <div className="flex-1 text-left">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm sm:text-base font-black text-amber-300 uppercase tracking-wider font-display">
            {tierTitles[tier] || `Hint ${tier}`}
          </span>
          {tier < maxTiers && (
            <button
              onClick={onNextTier}
              className="text-sm text-purple-300 hover:text-white underline font-black cursor-pointer"
            >
              Need more help? (Tier {tier + 1})
            </button>
          )}
        </div>
        <p className="text-base sm:text-lg font-bold text-purple-100 leading-relaxed font-body">
          {text}
        </p>
      </div>
    </div>
  );
}
