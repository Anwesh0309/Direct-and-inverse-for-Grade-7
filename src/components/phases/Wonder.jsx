import React, { useState, useEffect } from 'react';
import Mascot from '../ui/Mascot';
import { narrate, stopNarration } from '../../utils/audio';
import { wonderNarration } from '../../utils/narration';

export default function Wonder({ onComplete, audioEnabled }) {
  const [scene, setScene] = useState(0); // 0: 3 pens, 1: 6 pens, 2: 4 painters, 3: 8 painters
  const [tapsCount, setTapsCount] = useState(0);
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    if (audioEnabled) {
      narrate(wonderNarration(), true);
    }
    const timer = setTimeout(() => setCanProceed(true), 4000);
    return () => {
      clearTimeout(timer);
      stopNarration();
    };
  }, [audioEnabled]);

  const handleDoubleIt = () => {
    const nextScene = (scene + 1) % 4;
    setScene(nextScene);
    const newCount = tapsCount + 1;
    setTapsCount(newCount);
    if (newCount >= 1) {
      setCanProceed(true);
    }
  };

  const scenes = [
    {
      icon: '🖊️',
      title: '3 pens ➔ S$6',
      sublabel: '✓ BOTH GREW TOGETHER!',
      subColor: 'text-purple-300',
    },
    {
      icon: '🖊️',
      title: '6 pens ➔ S$12',
      sublabel: '✓ DOUBLE THE PENS = DOUBLE THE PRICE!',
      subColor: 'text-purple-300',
    },
    {
      icon: '🎨',
      title: '4 painters ➔ 6 hours',
      sublabel: '↔ ONE GREW, ONE SHRANK!',
      subColor: 'text-cyan-300',
    },
    {
      icon: '🎨',
      title: '8 painters ➔ 3 hours',
      sublabel: '↔ DOUBLE THE WORKERS = HALF THE TIME!',
      subColor: 'text-cyan-300',
    },
  ];

  const currentScene = scenes[scene];

  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col justify-center items-center py-2 px-4 select-none overflow-hidden text-center font-display">
      {/* Centered Main Card */}
      <div className="w-full bg-[#1c1242]/95 border-2 border-white/15 rounded-[36px] p-6 sm:p-8 flex flex-col items-center justify-between text-center shadow-2xl backdrop-blur-xl max-h-[85vh] overflow-hidden my-auto">
        {/* Top purple glowing pill bar */}
        <div className="w-24 h-2 rounded-full bg-[#a855f7] shadow-[0_0_18px_#a855f7] mb-2" />

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display mb-2 flex items-center justify-center gap-3">
          <span className="text-3xl sm:text-4xl">🔮</span>
          <span>Wonder Hook</span>
        </h2>

        {/* Robot Mascot Head */}
        <div className="my-1">
          <Mascot state={tapsCount >= 2 ? 'celebrating' : 'curious'} size={88} />
        </div>

        {/* Dashed Hero Box */}
        <div className="w-full p-4 sm:p-6 rounded-3xl bg-[#140b2f]/95 border-2 border-dashed border-[#6366f1]/50 flex flex-col items-center justify-center my-2 shadow-xl">
          {/* Top icon */}
          <span className="text-4xl sm:text-5xl mb-1">{currentScene.icon}</span>

          {/* Large gold numbers */}
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#facc15] font-display drop-shadow-[0_0_24px_rgba(250,204,21,0.7)] my-1">
            {currentScene.title}
          </div>

          {/* Sublabel */}
          <div className={`text-base sm:text-lg md:text-xl lg:text-2xl font-black font-display uppercase tracking-wider my-1 ${currentScene.subColor}`}>
            {currentScene.sublabel}
          </div>

          {/* Interactive Double It button */}
          <button
            onClick={handleDoubleIt}
            className="mt-2 px-10 sm:px-12 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-display font-black text-lg sm:text-xl md:text-2xl shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2.5"
          >
            <span className="text-xl sm:text-2xl">✨</span>
            <span>Double It! ×2</span>
          </button>
        </div>

        {/* Narrated Paragraph with highlighted bold gold numbers */}
        <p className="max-w-2xl mx-auto my-2 text-base sm:text-lg md:text-xl lg:text-2xl text-slate-100 font-extrabold leading-relaxed font-body">
          <span className="text-[#facc15] font-black text-lg sm:text-xl md:text-2xl">3</span> pens cost{' '}
          <span className="text-[#facc15] font-black text-lg sm:text-xl md:text-2xl">S$6</span>.{' '}
          <br className="hidden sm:inline" />
          <span className="text-[#facc15] font-black text-lg sm:text-xl md:text-2xl">6</span> pens cost{' '}
          <span className="text-[#facc15] font-black text-lg sm:text-xl md:text-2xl">S$12</span>. But{' '}
          <span className="text-[#facc15] font-black text-lg sm:text-xl md:text-2xl">4</span> painters finish a wall in{' '}
          <span className="text-[#facc15] font-black text-lg sm:text-xl md:text-2xl">6</span> hours, and{' '}
          <span className="text-[#facc15] font-black text-lg sm:text-xl md:text-2xl">8</span> painters finish it in only{' '}
          <span className="text-[#facc15] font-black text-lg sm:text-xl md:text-2xl">3</span>.
          <br />
          <span className="text-amber-300 font-black mt-1.5 block text-base sm:text-lg md:text-xl lg:text-2xl font-display">
            Why does doubling one thing sometimes double the other, and sometimes halve it?
          </span>
        </p>

        {/* Action CTA Button */}
        <div className="mt-2 flex flex-col items-center">
          <button
            disabled={!canProceed}
            onClick={onComplete}
            className={`px-12 sm:px-16 py-3 sm:py-4 rounded-full font-display font-black text-lg sm:text-xl md:text-2xl shadow-[0_0_32px_rgba(245,158,11,0.6)] transition-all flex items-center gap-3 ${
              canProceed
                ? 'bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] text-[#1e1b4b] hover:scale-105 active:scale-95 cursor-pointer'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Discover the Story ➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
