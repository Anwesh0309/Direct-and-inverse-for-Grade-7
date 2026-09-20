import React, { useState, useEffect, useRef } from 'react';
import CoordinateGraph from '../visuals/CoordinateGraph';
import Button from '../ui/Button';

export default function GraphPlotter({ problemIndex = 0, onAttempt, onProblemDone }) {
  const [sliderK, setSliderK] = useState(1);
  const [matchedEq, setMatchedEq] = useState(null);
  const [tested, setTested] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    setSliderK(1);
    setMatchedEq(null);
    setTested(false);
    setErrorMsg('');

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [problemIndex]);

  // Target point for Problem 0: (2, 6) -> k = 3
  const targetPoint = { x: 2, y: 6, label: '(2, 6)' };

  const handleTest = () => {
    if (tested) return;

    if (problemIndex === 0) {
      if (Math.abs(sliderK - 3) < 0.1) {
        setTested(true);
        setErrorMsg('');
        onAttempt(true);
        timerRef.current = setTimeout(onProblemDone, 1000);
      } else {
        setErrorMsg('Adjust the slider so the gold line passes right through the point (2, 6). (Hint: 6 ÷ 2 = ?)');
        onAttempt(false);
      }
    } else if (problemIndex === 1) {
      if (matchedEq === 'y = 2.5x') {
        setTested(true);
        setErrorMsg('');
        onAttempt(true);
        timerRef.current = setTimeout(onProblemDone, 1000);
      } else {
        setErrorMsg('Notice the line starts at (0, 0), so there is no +c intercept. Formula must be y = kx!');
        onAttempt(false);
      }
    } else if (problemIndex === 2) {
      setTested(true);
      setErrorMsg('');
      onAttempt(true);
      timerRef.current = setTimeout(onProblemDone, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-h-full my-auto text-center px-2 py-1 select-none font-display overflow-y-auto custom-scrollbar">
      {/* Title / Instruction */}
      <div className="mb-1 flex-shrink-0">
        <span className="text-sm sm:text-base md:text-lg font-black text-amber-300 uppercase tracking-wide font-display">
          {problemIndex === 0 && 'Problem 1 of 3: Drag slider or tap buttons until line passes through (2, 6)'}
          {problemIndex === 1 && 'Problem 2 of 3: Match the correct direct proportion equation'}
          {problemIndex === 2 && 'Problem 3 of 3: Inverse Mode: Explore the hyperbola curve y = 24 / x'}
        </span>
      </div>

      {/* Main Graph & Sync Panel */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 my-1 w-full max-w-xl">
        {/* Graph */}
        <CoordinateGraph
          kind={problemIndex === 2 ? 'inverse' : 'direct'}
          k={problemIndex === 0 ? sliderK : problemIndex === 1 ? 2.5 : 24}
          highlightPoints={problemIndex === 0 ? [targetPoint] : problemIndex === 1 ? [{ x: 2, y: 5, label: '(2, 5)' }] : [{ x: 3, y: 8, label: '(3, 8)' }, { x: 6, y: 4, label: '(6, 4)' }]}
          width={290}
          height={190}
          maxX={8}
          maxY={16}
        />

        {/* Live Sync Panel: Table ↔ Graph ↔ Equation */}
        <div className="flex flex-col p-4 rounded-3xl bg-white/5 border border-white/15 backdrop-blur-md text-left w-full md:w-64 text-sm sm:text-base space-y-3 shadow-xl font-display">
          <div className="font-black text-cyan-300 uppercase font-display border-b border-white/15 pb-1.5 text-sm sm:text-base">
            Live Relation Sync
          </div>
          <div>
            <span className="text-slate-300 font-bold">Equation:</span>
            <span className="font-black text-gold ml-1.5 font-display text-lg sm:text-xl">
              {problemIndex === 2 ? `y = 24 / x` : `y = ${(problemIndex === 0 ? sliderK : 2.5).toFixed(1)}x`}
            </span>
          </div>
          <div>
            <span className="text-slate-300 font-bold">Origin Check:</span>
            <span className="font-black text-emerald-300 ml-1.5 text-sm sm:text-base">
              {problemIndex === 2 ? 'Never touches (0,0)' : 'Passes through (0, 0)'}
            </span>
          </div>

          {problemIndex === 0 && (
            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-black text-amber-300 font-display">
                  Slope k = {sliderK}
                </label>
                <div className="flex gap-1">
                  <button
                    onClick={() => setSliderK((prev) => Math.max(0.5, prev - 0.5))}
                    className="px-2 py-0.5 rounded bg-indigo-900 border border-indigo-400 text-white font-black text-xs cursor-pointer hover:bg-indigo-800"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setSliderK((prev) => Math.min(5, prev + 0.5))}
                    className="px-2 py-0.5 rounded bg-indigo-900 border border-indigo-400 text-white font-black text-xs cursor-pointer hover:bg-indigo-800"
                  >
                    +
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={sliderK}
                onChange={(e) => setSliderK(parseFloat(e.target.value))}
                className="w-full cursor-pointer accent-amber-400"
              />
              {/* Quick Preset Slope Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => setSliderK(val)}
                    className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-black border-2 transition-all cursor-pointer ${
                      sliderK === val
                        ? 'bg-amber-400 text-slate-950 border-amber-300 scale-105 shadow-md'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  >
                    k = {val}
                  </button>
                ))}
              </div>
            </div>
          )}

          {problemIndex === 1 && (
            <div className="pt-1 space-y-2">
              <span className="block text-xs sm:text-sm font-black text-slate-200">Select matching formula:</span>
              {[
                { eq: 'y = 2.5x', note: '✓ Direct (passes 0,0)' },
                { eq: 'y = 2.5x + 3', note: '✗ Offsets by +3' },
                { eq: 'y = 2.5 / x', note: '✗ Inverse curve' },
              ].map((item) => (
                <button
                  key={item.eq}
                  onClick={() => setMatchedEq(item.eq)}
                  className={`w-full py-2 px-3 rounded-xl text-left text-xs sm:text-sm font-black transition-all cursor-pointer border-2 flex items-center justify-between ${
                    matchedEq === item.eq
                      ? 'bg-amber-500/40 border-amber-400 text-amber-200 shadow-md scale-102'
                      : 'bg-white/5 border-white/15 text-white hover:bg-white/10'
                  }`}
                >
                  <span>{item.eq}</span>
                  <span className="text-xs opacity-80">{item.note}</span>
                </button>
              ))}
            </div>
          )}

          {problemIndex === 2 && (
            <div className="space-y-2 text-xs sm:text-sm font-bold leading-relaxed pt-1">
              <span className="block text-amber-300 font-black">Interactive Points (x × y = 24):</span>
              <div className="p-2 rounded-xl bg-cyan-950/50 border border-cyan-400/30 text-cyan-200 space-y-1">
                <div>📍 Point 1: (3, 8) ➔ 3 × 8 = 24</div>
                <div>📍 Point 2: (6, 4) ➔ 6 × 4 = 24</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="text-xs sm:text-sm text-rose-300 font-black my-1 bg-rose-950/60 px-3.5 py-1 rounded-full border border-rose-500/30 animate-bounce">
          {errorMsg}
        </div>
      )}

      {/* Action Button */}
      <div className="my-2">
        <Button variant="gold" size="md" onClick={handleTest} className="text-base sm:text-lg font-black py-2.5 px-8">
          {tested ? '✓ Correct! Next ➔' : 'Plot the Points 📈'}
        </Button>
      </div>
    </div>
  );
}
