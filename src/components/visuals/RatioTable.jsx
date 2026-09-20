import React from 'react';

export default function RatioTable({ headers = ['x', 'y'], rows = [], highlightIndex = null, showTests = false }) {
  return (
    <div className="flex flex-col items-center justify-center my-1 w-full max-w-md mx-auto">
      <div className="overflow-hidden rounded-2xl border-2 border-white/20 bg-slate-900/80 shadow-2xl backdrop-blur-md w-full">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-purple-900/60 border-b border-white/15">
              {headers.map((h, i) => (
                <th key={i} className="py-2 px-4 text-sm sm:text-base font-black text-gold uppercase tracking-wider font-display">
                  {h}
                </th>
              ))}
              {showTests && (
                <th className="py-2 px-4 text-sm sm:text-base font-black text-cyan-300 uppercase tracking-wider font-display">
                  Test (y ÷ x)
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => {
              const [xVal, yVal] = row;
              const isHighlighted = highlightIndex === rIdx;
              const ratio = (typeof yVal === 'number' && typeof xVal === 'number' && xVal !== 0) 
                ? (yVal / xVal).toFixed(1) 
                : null;

              return (
                <tr
                  key={rIdx}
                  className={`border-b border-white/10 transition-colors ${
                    isHighlighted ? 'bg-amber-500/20' : rIdx % 2 === 0 ? 'bg-white/5' : 'bg-transparent'
                  }`}
                >
                  <td className="py-2 px-4 text-lg sm:text-xl font-black text-white font-display">
                    {xVal}
                  </td>
                  <td className="py-2 px-4 text-lg sm:text-xl font-black text-gold font-display">
                    {yVal === '?' ? (
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-pink-500/30 text-pink-300 border-2 border-pink-400 font-black text-base animate-pulse">
                        ?
                      </span>
                    ) : (
                      yVal
                    )}
                  </td>
                  {showTests && (
                    <td className="py-2 px-4 text-sm sm:text-base font-black text-emerald-300 font-display">
                      {ratio ? `k = ${ratio}` : '—'}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
