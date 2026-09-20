import React from 'react';

export default function WorkerRow({ count = 4, icon = '👷', label = 'workers' }) {
  const displayCount = Math.min(count, 12);
  const icons = Array.from({ length: displayCount });

  return (
    <div className="flex flex-col items-center justify-center my-1.5 p-3 rounded-2xl bg-white/5 border border-white/10 max-w-sm mx-auto">
      <div className="flex flex-wrap gap-2 justify-center items-center">
        {icons.map((_, i) => (
          <span key={i} className="text-3xl filter drop-shadow-md transform transition-transform hover:scale-125" title={label}>
            {icon}
          </span>
        ))}
      </div>
      <span className="text-sm sm:text-base font-black text-gold mt-1.5 uppercase tracking-wider font-display">
        {count} {label}
      </span>
    </div>
  );
}
