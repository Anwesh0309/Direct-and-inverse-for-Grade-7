import React from 'react';

export default function MachineDiagram({ inLabel = '4 items', outLabel = '24 items', factor = 6 }) {
  return (
    <div className="flex items-center justify-center gap-3 my-1.5 p-3 rounded-2xl bg-slate-900/80 border-2 border-white/15 max-w-sm mx-auto shadow-xl">
      {/* Input */}
      <div className="flex flex-col items-center p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40">
        <span className="text-xs sm:text-sm font-black text-purple-300 uppercase font-display">Input</span>
        <span className="text-base sm:text-lg font-black text-white font-display mt-0.5">{inLabel}</span>
      </div>

      {/* Conveyor Arrow */}
      <div className="flex flex-col items-center">
        <span className="text-sm sm:text-base font-black text-gold px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 font-display">
          ⚙️ × {factor}
        </span>
        <span className="text-cyan-400 text-xl">➔</span>
      </div>

      {/* Output */}
      <div className="flex flex-col items-center p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40">
        <span className="text-xs sm:text-sm font-black text-emerald-300 uppercase font-display">Output</span>
        <span className="text-base sm:text-lg font-black text-gold font-display mt-0.5">{outLabel}</span>
      </div>
    </div>
  );
}
