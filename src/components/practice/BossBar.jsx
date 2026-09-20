import React from 'react';

export default function BossBar({ hp = 10, maxHp = 10 }) {
  const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));

  return (
    <div className="w-full max-w-lg mx-auto my-1 p-2.5 rounded-2xl bg-slate-950/80 border-2 border-rose-500/50 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between text-sm sm:text-base font-black font-display text-rose-300 uppercase tracking-wider mb-1 px-1">
        <span className="flex items-center gap-1.5">
          <span className="text-lg animate-pulse">👑</span>
          <span>Proportion Titan Boss</span>
        </span>
        <span className="text-amber-300 font-black">{hp} / {maxHp} HP</span>
      </div>

      <div className="w-full h-4 rounded-full bg-slate-800 overflow-hidden border border-white/20 p-0.5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-400 transition-all duration-500 shadow-md"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
