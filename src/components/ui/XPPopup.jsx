import React, { useEffect } from 'react';

export default function XPPopup({ amount = 15, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-bounce">
      <div className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-display font-black text-lg shadow-[0_0_24px_rgba(250,204,21,0.8)] border-2 border-white flex items-center gap-2">
        <span>✨</span>
        <span>+{amount} XP</span>
      </div>
    </div>
  );
}
