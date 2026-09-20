import React from 'react';

export default function FeedbackOverlay({
  kind = 'correct', // 'correct' | 'incorrect'
  solution = [],
  correctAnswer = '',
  userChoice = '',
  onNext,
}) {
  const isCorrect = kind === 'correct';

  // Build clean, single explanation line matching the target screenshots
  let explanationText = '';
  if (solution && solution.length > 0) {
    explanationText = solution.join(' ');
  } else if (correctAnswer) {
    explanationText = `The answer is: ${correctAnswer}`;
  } else {
    explanationText = isCorrect ? 'Great job!' : 'Review the concept and try again.';
  }

  return (
    <div
      onClick={onNext}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none animate-fadeIn cursor-pointer"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className={`max-w-md w-full sm:w-[420px] p-7 sm:p-8 rounded-[32px] text-center text-white shadow-2xl flex flex-col items-center justify-center border-2 border-white/20 font-display transition-transform transform scale-100 hover:scale-102 cursor-pointer ${
          isCorrect ? 'bg-[#38a169]' : 'bg-[#e53e3e]'
        }`}
      >
        {/* Top Emoji Icon */}
        <div className="text-5xl sm:text-6xl mb-3 leading-none drop-shadow-md">
          {isCorrect ? '🎉' : '🥺'}
        </div>

        {/* Title Heading */}
        <h2 className="text-2xl sm:text-3xl font-black text-white font-display mb-2 tracking-wide drop-shadow-sm">
          {isCorrect ? 'Correct! 🎉' : 'Not quite!'}
        </h2>

        {/* Subtitle Explanation Text matching screenshot styling */}
        <p className="text-base sm:text-lg font-bold text-white/95 leading-relaxed my-2 px-2 max-w-xs sm:max-w-sm">
          {explanationText}
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={onNext}
          className="mt-4 px-8 py-2.5 rounded-full bg-white/25 hover:bg-white/35 font-black text-base sm:text-lg text-white font-display border border-white/35 shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          Continue ➔
        </button>
      </div>
    </div>
  );
}
