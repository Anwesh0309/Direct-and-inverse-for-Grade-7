import React, { useState, useEffect, useRef } from 'react';
import RatioTable from '../visuals/RatioTable';
import Button from '../ui/Button';

export default function RatioTableLab({ problemIndex = 0, seed = 1, onAttempt, onProblemDone }) {
  const [inputs, setInputs] = useState({ b1: '', b2: '' });
  const [tested, setTested] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedOddRow, setSelectedOddRow] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    setInputs({ b1: '', b2: '' });
    setTested(false);
    setErrorMsg('');
    setSelectedOddRow(null);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [problemIndex]);

  const k = problemIndex === 0 ? 4 : problemIndex === 1 ? 6 : 5;

  const handleTest = () => {
    if (tested) return;

    if (problemIndex === 0) {
      const val1 = parseInt(inputs.b1, 10);
      const val2 = parseInt(inputs.b2, 10);
      if (val1 === 12 && val2 === 20) {
        setTested(true);
        setErrorMsg('');
        onAttempt(true);
        timerRef.current = setTimeout(onProblemDone, 1000);
      } else {
        setErrorMsg('Not quite! In direct proportion, each row must give y ÷ x = 4.');
        onAttempt(false);
      }
    } else if (problemIndex === 1) {
      const val1 = parseInt(inputs.b1, 10);
      const val2 = parseInt(inputs.b2, 10);
      if (val1 === 24 && val2 === 42) {
        setTested(true);
        setErrorMsg('');
        onAttempt(true);
        timerRef.current = setTimeout(onProblemDone, 1000);
      } else {
        setErrorMsg('Check row 1: 12 ÷ 2 = 6. So k = 6! Multiply each x by 6.');
        onAttempt(false);
      }
    } else if (problemIndex === 2) {
      if (selectedOddRow === 2) {
        setTested(true);
        setErrorMsg('');
        onAttempt(true);
        timerRef.current = setTimeout(onProblemDone, 1000);
      } else {
        setErrorMsg('Test each row by dividing y ÷ x. One row does NOT equal 5!');
        onAttempt(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-h-full my-auto text-center px-2 py-1 select-none font-display overflow-y-auto custom-scrollbar">
      {/* Instruction */}
      <div className="mb-1 flex-shrink-0">
        <span className="text-sm sm:text-base md:text-lg font-black text-amber-300 uppercase tracking-wide font-display">
          {problemIndex === 0 && 'Problem 1 of 3: Fill in missing numbers for constant ratio k = 4'}
          {problemIndex === 1 && 'Problem 2 of 3: Find k from row 1 (12 ÷ 2 = 6), then complete table'}
          {problemIndex === 2 && 'Problem 3 of 3: Odd-One-Out! Tap the row that breaks the pattern'}
        </span>
      </div>

      {/* Interactive Table Area */}
      <div className="w-full max-w-xl mx-auto my-1">
        {problemIndex === 0 && (
          <div className="rounded-3xl border-2 border-white/20 bg-slate-900/90 p-4 sm:p-5 shadow-2xl backdrop-blur-md">
            <table className="w-full text-center border-collapse mb-4">
              <thead>
                <tr className="bg-purple-900/70 border-b border-white/20">
                  <th className="py-3 text-lg sm:text-xl font-black text-gold font-display">Lanterns (x)</th>
                  <th className="py-3 text-lg sm:text-xl font-black text-gold font-display">Lights (y)</th>
                  {tested && <th className="py-3 text-lg sm:text-xl font-black text-emerald-300 font-display">y ÷ x</th>}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-3 text-xl sm:text-2xl font-black text-white">2</td>
                  <td className="py-3 text-xl sm:text-2xl font-black text-gold">8</td>
                  {tested && <td className="py-3 text-xl text-emerald-300 font-bold">✓ 4</td>}
                </tr>
                <tr className="border-b border-white/10 bg-amber-500/10">
                  <td className="py-3 text-xl sm:text-2xl font-black text-white">3</td>
                  <td className="py-3">
                    <span className="text-xl sm:text-2xl font-black text-[#facc15] bg-black/70 px-5 py-1.5 rounded-xl border-2 border-amber-400 inline-block min-w-[80px] shadow-inner">
                      {inputs.b1 || '?'}
                    </span>
                  </td>
                  {tested && <td className="py-3 text-xl text-emerald-300 font-bold">✓ 4</td>}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 text-xl sm:text-2xl font-black text-white">4</td>
                  <td className="py-3 text-xl sm:text-2xl font-black text-gold">16</td>
                  {tested && <td className="py-3 text-xl text-emerald-300 font-bold">✓ 4</td>}
                </tr>
                <tr className="bg-amber-500/10">
                  <td className="py-3 text-xl sm:text-2xl font-black text-white">5</td>
                  <td className="py-3">
                    <span className="text-xl sm:text-2xl font-black text-[#facc15] bg-black/70 px-5 py-1.5 rounded-xl border-2 border-amber-400 inline-block min-w-[80px] shadow-inner">
                      {inputs.b2 || '?'}
                    </span>
                  </td>
                  {tested && <td className="py-3 text-xl text-emerald-300 font-bold">✓ 4</td>}
                </tr>
              </tbody>
            </table>

            {/* Quick Choice & Stepper Controls */}
            <div className="flex flex-col gap-3 pt-2 border-t border-white/15">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-base font-black text-amber-200">3 lanterns (3 × 4):</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInputs((prev) => ({ ...prev, b1: Math.max(0, (parseInt(prev.b1, 10) || 12) - 1).toString() }))}
                    className="w-8 h-8 rounded-lg bg-indigo-900 border border-indigo-400 text-white font-black text-base cursor-pointer hover:bg-indigo-800"
                  >
                    -
                  </button>
                  {[10, 12, 14].map((num) => (
                    <button
                      key={num}
                      onClick={() => setInputs((prev) => ({ ...prev, b1: num.toString() }))}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-base border-2 transition-all cursor-pointer ${
                        inputs.b1 === num.toString()
                          ? 'bg-amber-400 text-slate-950 border-amber-300 scale-105 shadow-md'
                          : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={() => setInputs((prev) => ({ ...prev, b1: ((parseInt(prev.b1, 10) || 12) + 1).toString() }))}
                    className="w-8 h-8 rounded-lg bg-indigo-900 border border-indigo-400 text-white font-black text-base cursor-pointer hover:bg-indigo-800"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-base font-black text-amber-200">5 lanterns (5 × 4):</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInputs((prev) => ({ ...prev, b2: Math.max(0, (parseInt(prev.b2, 10) || 20) - 1).toString() }))}
                    className="w-8 h-8 rounded-lg bg-indigo-900 border border-indigo-400 text-white font-black text-base cursor-pointer hover:bg-indigo-800"
                  >
                    -
                  </button>
                  {[18, 20, 24].map((num) => (
                    <button
                      key={num}
                      onClick={() => setInputs((prev) => ({ ...prev, b2: num.toString() }))}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-base border-2 transition-all cursor-pointer ${
                        inputs.b2 === num.toString()
                          ? 'bg-amber-400 text-slate-950 border-amber-300 scale-105 shadow-md'
                          : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={() => setInputs((prev) => ({ ...prev, b2: ((parseInt(prev.b2, 10) || 20) + 1).toString() }))}
                    className="w-8 h-8 rounded-lg bg-indigo-900 border border-indigo-400 text-white font-black text-base cursor-pointer hover:bg-indigo-800"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {problemIndex === 1 && (
          <div className="rounded-3xl border-2 border-white/20 bg-slate-900/90 p-4 sm:p-5 shadow-2xl backdrop-blur-md">
            <table className="w-full text-center border-collapse mb-4">
              <thead>
                <tr className="bg-purple-900/70 border-b border-white/20">
                  <th className="py-3 text-lg sm:text-xl font-black text-gold font-display">Pens (x)</th>
                  <th className="py-3 text-lg sm:text-xl font-black text-gold font-display">Cost S$ (y)</th>
                  {tested && <th className="py-3 text-lg sm:text-xl font-black text-emerald-300 font-display">y ÷ x</th>}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10 bg-amber-500/15">
                  <td className="py-3 text-xl sm:text-2xl font-black text-white">2</td>
                  <td className="py-3 text-xl sm:text-2xl font-black text-gold">12 (k = 6)</td>
                  {tested && <td className="py-3 text-xl text-emerald-300 font-bold">✓ 6</td>}
                </tr>
                <tr className="border-b border-white/10 bg-white/5">
                  <td className="py-3 text-xl sm:text-2xl font-black text-white">4</td>
                  <td className="py-3">
                    <span className="text-xl sm:text-2xl font-black text-[#facc15] bg-black/70 px-5 py-1.5 rounded-xl border-2 border-amber-400 inline-block min-w-[80px] shadow-inner">
                      {inputs.b1 || '?'}
                    </span>
                  </td>
                  {tested && <td className="py-3 text-xl text-emerald-300 font-bold">✓ 6</td>}
                </tr>
                <tr className="bg-white/5">
                  <td className="py-3 text-xl sm:text-2xl font-black text-white">7</td>
                  <td className="py-3">
                    <span className="text-xl sm:text-2xl font-black text-[#facc15] bg-black/70 px-5 py-1.5 rounded-xl border-2 border-amber-400 inline-block min-w-[80px] shadow-inner">
                      {inputs.b2 || '?'}
                    </span>
                  </td>
                  {tested && <td className="py-3 text-xl text-emerald-300 font-bold">✓ 6</td>}
                </tr>
              </tbody>
            </table>

            {/* Quick Choice & Stepper Controls */}
            <div className="flex flex-col gap-3 pt-2 border-t border-white/15">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-base font-black text-amber-200">4 pens (4 × 6):</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInputs((prev) => ({ ...prev, b1: Math.max(0, (parseInt(prev.b1, 10) || 24) - 1).toString() }))}
                    className="w-8 h-8 rounded-lg bg-indigo-900 border border-indigo-400 text-white font-black text-base cursor-pointer hover:bg-indigo-800"
                  >
                    -
                  </button>
                  {[20, 24, 28].map((num) => (
                    <button
                      key={num}
                      onClick={() => setInputs((prev) => ({ ...prev, b1: num.toString() }))}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-base border-2 transition-all cursor-pointer ${
                        inputs.b1 === num.toString()
                          ? 'bg-amber-400 text-slate-950 border-amber-300 scale-105 shadow-md'
                          : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={() => setInputs((prev) => ({ ...prev, b1: ((parseInt(prev.b1, 10) || 24) + 1).toString() }))}
                    className="w-8 h-8 rounded-lg bg-indigo-900 border border-indigo-400 text-white font-black text-base cursor-pointer hover:bg-indigo-800"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-base font-black text-amber-200">7 pens (7 × 6):</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInputs((prev) => ({ ...prev, b2: Math.max(0, (parseInt(prev.b2, 10) || 42) - 1).toString() }))}
                    className="w-8 h-8 rounded-lg bg-indigo-900 border border-indigo-400 text-white font-black text-base cursor-pointer hover:bg-indigo-800"
                  >
                    -
                  </button>
                  {[36, 42, 48].map((num) => (
                    <button
                      key={num}
                      onClick={() => setInputs((prev) => ({ ...prev, b2: num.toString() }))}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-base border-2 transition-all cursor-pointer ${
                        inputs.b2 === num.toString()
                          ? 'bg-amber-400 text-slate-950 border-amber-300 scale-105 shadow-md'
                          : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={() => setInputs((prev) => ({ ...prev, b2: ((parseInt(prev.b2, 10) || 42) + 1).toString() }))}
                    className="w-8 h-8 rounded-lg bg-indigo-900 border border-indigo-400 text-white font-black text-base cursor-pointer hover:bg-indigo-800"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {problemIndex === 2 && (
          <div className="rounded-3xl border-2 border-white/20 bg-slate-900/90 p-4 sm:p-5 shadow-2xl backdrop-blur-md">
            <p className="text-base sm:text-lg text-slate-200 mb-3 font-black font-display">
              Target constant ratio k = 5. Tap the row where y ÷ x ≠ 5:
            </p>
            <div className="space-y-2.5">
              {[
                { x: 2, y: 10, calc: '10 ÷ 2 = 5', broken: false },
                { x: 3, y: 15, calc: '15 ÷ 3 = 5', broken: false },
                { x: 4, y: 22, calc: '22 ÷ 4 = 5.5', broken: true },
                { x: 6, y: 30, calc: '30 ÷ 6 = 5', broken: false },
              ].map((row, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOddRow(idx)}
                  className={`w-full py-3 px-5 rounded-2xl flex items-center justify-between transition-all cursor-pointer border-2 font-display ${
                    selectedOddRow === idx
                      ? row.broken
                        ? 'bg-rose-500/40 border-rose-400 text-white shadow-xl scale-102'
                        : 'bg-amber-500/30 border-amber-400 text-white shadow-lg scale-101'
                      : 'bg-white/5 border-white/15 hover:bg-white/10 text-white'
                  }`}
                >
                  <span className="font-black text-lg sm:text-xl">x = {row.x}, y = {row.y}</span>
                  <span className="text-base sm:text-lg font-black text-amber-300 bg-black/50 px-3 py-1 rounded-xl border border-amber-400/30">
                    {row.calc} {row.broken && selectedOddRow === idx ? ' ✗ (Breaks pattern!)' : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="text-sm sm:text-base text-rose-300 font-black my-1.5 bg-rose-950/70 px-4 py-1.5 rounded-full border border-rose-500/40 animate-bounce">
          {errorMsg}
        </div>
      )}

      {/* Action Button */}
      <div className="my-2">
        <Button variant="gold" size="md" onClick={handleTest} className="text-lg sm:text-xl font-black py-3 px-10">
          {tested ? '✓ Correct! Next ➔' : 'Test the Ratios 🔬'}
        </Button>
      </div>
    </div>
  );
}
