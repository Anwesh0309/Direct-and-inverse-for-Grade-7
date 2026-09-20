import React from 'react';

export default function NumberPad({ value = '', onChange, onSubmit, disabled = false }) {
  const handleDigit = (digit) => {
    if (disabled || value.length >= 10) return;
    if (digit === '.' && value.includes('.')) return;
    onChange(value + digit);
  };

  const handleBackspace = () => {
    if (disabled || value.length === 0) return;
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    if (disabled) return;
    onChange('');
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-xs mx-auto my-2 p-3.5 rounded-3xl bg-slate-900/90 border-2 border-white/20 shadow-2xl backdrop-blur-xl">
      {/* Input Display */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-black/60 border border-amber-400/50">
        <span className="text-sm font-bold text-slate-300 font-display">Enter answer:</span>
        <span className="text-3xl font-black text-gold font-display tracking-wider">
          {value || <span className="opacity-30">0</span>}
        </span>
      </div>

      {/* 3x4 Grid */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {keys.map((k) => (
          <button
            key={k}
            type="button"
            disabled={disabled}
            onClick={() => (k === '⌫' ? handleBackspace() : handleDigit(k))}
            className="py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-2xl font-black text-white font-display border border-white/10 shadow transition-all cursor-pointer disabled:opacity-40"
          >
            {k}
          </button>
        ))}
      </div>

      {/* Submit Button */}
      <button
        type="button"
        disabled={disabled || !value}
        onClick={onSubmit}
        className="w-full py-3.5 rounded-2xl btn-gold text-slate-950 font-display font-black text-lg shadow-lg transition-all cursor-pointer disabled:opacity-40"
      >
        Submit Answer 🚀
      </button>
    </div>
  );
}
