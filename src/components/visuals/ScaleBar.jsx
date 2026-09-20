import React from 'react';

export default function ScaleBar({ cm = 1, km = 3 }) {
  return (
    <div className="flex flex-col items-center justify-center my-1.5 p-3 rounded-2xl bg-slate-900/80 border-2 border-white/15 max-w-sm mx-auto shadow-xl">
      <div className="text-xs sm:text-sm font-black text-cyan-300 uppercase tracking-wider font-display mb-1">
        Map Scale Ratio
      </div>
      <div className="relative w-52 h-7 border-b-4 border-l-4 border-r-4 border-white flex justify-between items-end px-1 pb-1">
        <span className="text-xs sm:text-sm font-black text-white">0</span>
        <span className="text-xs sm:text-sm font-black text-gold">{cm} cm</span>
      </div>
      <div className="mt-1.5 text-sm sm:text-base font-black text-amber-300 font-display">
        1 cm on map = {km} km actual distance
      </div>
    </div>
  );
}
