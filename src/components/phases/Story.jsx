import React, { useState, useEffect } from 'react';
import { STORY } from '../../content/story';
import { narrate, stopNarration } from '../../utils/audio';
import { getStoryNarration } from '../../utils/narration';

export default function Story({ onComplete, audioEnabled, initialSlide = 0, onResetProgress }) {
  const [slideIndex, setSlideIndex] = useState(initialSlide);

  const slide = STORY[slideIndex];
  const isLast = slideIndex === STORY.length - 1;

  useEffect(() => {
    if (audioEnabled) {
      narrate(getStoryNarration(slideIndex), true);
    }

    // Preload next slide image
    if (slideIndex + 1 < STORY.length) {
      const img = new Image();
      img.src = STORY[slideIndex + 1].image;
    }

    return () => stopNarration();
  }, [slideIndex, audioEnabled]);

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setSlideIndex(slideIndex + 1);
    }
  };

  const handleBack = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    }
  };

  const progressPercent = ((slideIndex + 1) / STORY.length) * 100;

  return (
    <div className="w-full max-w-6xl mx-auto h-full flex flex-col justify-between items-center py-2 px-4 select-none overflow-hidden font-display">
      {/* Top Progress Bar & Counter */}
      <div className="w-full flex items-center justify-between gap-6 px-2 my-1">
        <div className="flex-1 h-3 rounded-full bg-[#1c143d] overflow-hidden">
          <div
            className="h-full bg-[#facc15] shadow-[0_0_14px_#facc15] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-base sm:text-lg md:text-xl font-black text-white flex-shrink-0 font-display">
          {slideIndex + 1} / {STORY.length}
        </span>
      </div>

      {/* Main 2-Column Story Card */}
      <div className="w-full bg-[#130b2c]/95 border border-white/15 rounded-[36px] p-6 sm:p-8 flex flex-col md:flex-row items-stretch justify-between gap-6 sm:gap-8 shadow-2xl backdrop-blur-xl my-auto flex-1 max-h-[75vh] overflow-hidden">
        {/* Left: 1:1 Rounded Illustration Container */}
        <div className="w-full md:w-1/2 flex items-center justify-center flex-shrink-0">
          <div className="w-full h-full max-h-[48vh] sm:max-h-[52vh] aspect-square rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black/40 flex items-center justify-center">
            <img
              src={slide.image}
              alt={slide.alt || slide.heading}
              className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
              loading="eager"
            />
          </div>
        </div>

        {/* Right: Narrative Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-between text-left h-full overflow-hidden py-1 font-display">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Heading in Golden Yellow */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#facc15] font-display tracking-wide leading-tight">
              {slide.heading}
            </h2>

            {/* Paragraph Text */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-bold leading-relaxed font-body">
              {slide.text}
            </p>

            {/* Sparkle Quote Pill */}
            <div className="w-full border-2 border-amber-400/60 bg-[#0d0622]/90 py-3 px-6 sm:px-8 rounded-full text-[#facc15] font-black text-sm sm:text-base md:text-lg lg:text-xl font-display flex items-center justify-center gap-2.5 shadow-inner text-center mt-1">
              <span className="text-lg sm:text-xl">✨</span>
              <span>"{slide.quote}"</span>
              <span className="text-lg sm:text-xl">✨</span>
            </div>
          </div>

          {/* Mascot Speech Bubble with tail */}
          <div className="flex items-center gap-3.5 mt-auto pt-3">
            <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-gradient-to-b from-[#fde047] to-[#facc15] border-2 border-white/40 flex items-center justify-center text-3xl sm:text-4xl shadow-lg flex-shrink-0">
              🦁
            </div>
            <div className="relative bg-white text-slate-950 font-black text-sm sm:text-base md:text-lg lg:text-xl px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-display">
              <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[10px] border-r-white" />
              <span>{slide.leo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation & Reset Button */}
      <div className="w-full flex flex-col items-center gap-3 my-1">
        <div className="w-full flex items-center justify-between px-2">
          {/* Back Button */}
          <button
            disabled={slideIndex === 0}
            onClick={handleBack}
            className={`px-7 sm:px-8 py-2.5 sm:py-3 rounded-full font-black text-base sm:text-lg md:text-xl font-display transition-all ${
              slideIndex === 0
                ? 'bg-[#231a47]/50 text-slate-500 border border-white/5 cursor-not-allowed opacity-40'
                : 'bg-[#231a47] hover:bg-[#2d225a] text-white border border-white/20 cursor-pointer shadow-lg hover:scale-103 active:scale-97'
            }`}
          >
            ← Back
          </button>

          {/* Dot Slide Indicators */}
          <div className="flex items-center gap-3">
            {STORY.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                className={`transition-all cursor-pointer rounded-full ${
                  i === slideIndex
                    ? 'w-4 h-4 bg-[#facc15] shadow-[0_0_12px_#facc15]'
                    : 'w-3 h-3 bg-slate-600/70 hover:bg-slate-400'
                }`}
                title={`Slide ${i + 1}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="px-8 sm:px-10 py-2.5 sm:py-3 rounded-full bg-[#facc15] hover:bg-[#fde047] text-slate-950 font-black text-base sm:text-lg md:text-xl font-display shadow-[0_0_24px_rgba(250,204,21,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {isLast ? 'Next Phase →' : 'Next →'}
          </button>
        </div>

        {/* Reset Lesson Progress Button */}
        <button
          onClick={onResetProgress}
          className="px-6 py-1.5 rounded-full bg-[#1a113a] hover:bg-[#251852] text-slate-300 border border-white/10 font-bold text-xs sm:text-sm font-display shadow-sm transition-all cursor-pointer hover:text-white"
        >
          Reset Lesson Progress
        </button>
      </div>
    </div>
  );
}
