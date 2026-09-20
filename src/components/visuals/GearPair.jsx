import React from 'react';

export default function GearPair({ teethA = 20, teethB = 40, turnsA = 6 }) {
  return (
    <div className="flex items-center justify-center gap-4 my-1.5 p-3 rounded-2xl bg-slate-900/80 border-2 border-white/15 max-w-sm mx-auto shadow-xl">
      {/* Gear A */}
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 rounded-full border-4 border-dashed border-amber-400 bg-amber-500/20 flex items-center justify-center animate-spin" style={{ animationDuration: '6s' }}>
          <span className="text-sm font-black text-white font-display">A</span>
        </div>
        <span className="text-sm sm:text-base font-black text-amber-300 font-display mt-1">{teethA} teeth</span>
        <span className="text-xs font-bold text-slate-200">({turnsA} turns)</span>
      </div>

      <span className="text-cyan-400 font-black text-2xl">⚙️⚙️</span>

      {/* Gear B */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full border-4 border-dashed border-cyan-400 bg-cyan-500/20 flex items-center justify-center animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
          <span className="text-base font-black text-white font-display">B</span>
        </div>
        <span className="text-sm sm:text-base font-black text-cyan-300 font-display mt-1">{teethB} teeth</span>
        <span className="text-xs font-bold text-slate-200">(?)</span>
      </div>
    </div>
  );
}
