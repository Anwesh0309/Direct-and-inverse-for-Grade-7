import React, { useState, useEffect, useRef } from 'react';
import AreaModel from '../visuals/AreaModel';
import WorkerRow from '../visuals/WorkerRow';
import Button from '../ui/Button';

export default function WorkerWorkshop({ problemIndex = 0, onAttempt, onProblemDone }) {
  const [workersSlider, setWorkersSlider] = useState(3);
  const [inputVal, setInputVal] = useState('');
  const [tested, setTested] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    setWorkersSlider(3);
    setInputVal('');
    setTested(false);
    setErrorMsg('');

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [problemIndex]);

  const k = problemIndex === 0 ? 36 : problemIndex === 1 ? 60 : 180;
  const currentDays = Math.round(k / workersSlider);

  const handleTest = () => {
    if (tested) return;

    if (problemIndex === 0) {
      if (workersSlider === 6) {
        setTested(true);
        setErrorMsg('');
        onAttempt(true);
        timerRef.current = setTimeout(onProblemDone, 1000);
      } else {
        setErrorMsg('Adjust the slider so that the time becomes 6 days! (Hint: 36 ÷ 6 = ?)');
        onAttempt(false);
      }
    } else if (problemIndex === 1) {
      if (parseInt(inputVal, 10) === 12) {
        setTested(true);
        setErrorMsg('');
        onAttempt(true);
        timerRef.current = setTimeout(onProblemDone, 1000);
      } else {
        setErrorMsg('Total tap-minutes is constant: 3 × 20 = 60. With 5 taps: 60 ÷ 5 = ?');
        onAttempt(false);
      }
    } else if (problemIndex === 2) {
      if (parseInt(inputVal, 10) === 2) {
        setTested(true);
        setErrorMsg('');
        onAttempt(true);
        timerRef.current = setTimeout(onProblemDone, 1000);
      } else {
        setErrorMsg('Distance = speed × time = 60 × 3 = 180 km. At 90 km/h: 180 ÷ 90 = ?');
        onAttempt(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-h-full my-auto text-center px-2 py-1 select-none font-display overflow-y-auto custom-scrollbar">
      {/* Title / Instruction */}
      <div className="mb-1 flex-shrink-0">
        <span className="text-sm sm:text-base md:text-lg font-black text-amber-300 uppercase tracking-wide font-display">
          {problemIndex === 0 && 'Problem 1 of 3: Set workers so the 36-day job finishes in exactly 6 days'}
          {problemIndex === 1 && 'Problem 2 of 3: 3 taps take 20 min. How many minutes will 5 taps take?'}
          {problemIndex === 2 && 'Problem 3 of 3: At 60 km/h a trip takes 3h. How long at 90 km/h?'}
        </span>
      </div>

      {/* Main Area Model & Slider */}
      <div className="flex flex-col items-center justify-center gap-3 my-1 w-full max-w-xl font-display">
        {problemIndex === 0 && (
          <>
            <AreaModel
              w={workersSlider}
              h={currentDays}
              k={36}
              wLabel="Workers"
              hLabel="Days"
              width={310}
              height={155}
            />

            <WorkerRow count={workersSlider} icon="👷" label="painters" />

            <div className="w-full max-w-md mt-1 p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
              <label className="block text-base sm:text-lg font-black text-amber-300 mb-1.5 font-display">
                {workersSlider} Workers ➔ Takes {currentDays} Days
              </label>

              {/* Stepper Buttons for Grade 3 Ease */}
              <div className="flex items-center gap-3 w-full justify-center mb-2">
                <button
                  type="button"
                  onClick={() => setWorkersSlider((prev) => Math.max(2, prev - 1))}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-white font-black text-sm sm:text-base border border-indigo-400/40 cursor-pointer shadow-md active:scale-95"
                >
                  ➖ Less
                </button>
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="1"
                  value={workersSlider}
                  onChange={(e) => setWorkersSlider(parseInt(e.target.value, 10))}
                  className="w-32 sm:w-36 cursor-pointer accent-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setWorkersSlider((prev) => Math.min(12, prev + 1))}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-white font-black text-sm sm:text-base border border-indigo-400/40 cursor-pointer shadow-md active:scale-95"
                >
                  ➕ More
                </button>
              </div>

              {/* Quick Worker Preset Pills */}
              <div className="flex flex-wrap gap-1.5 justify-center">
                {[2, 3, 4, 6, 9, 12].map((wCount) => (
                  <button
                    key={wCount}
                    type="button"
                    onClick={() => setWorkersSlider(wCount)}
                    className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-black border-2 transition-all cursor-pointer ${
                      workersSlider === wCount
                        ? 'bg-amber-400 text-slate-950 border-amber-300 scale-105 shadow-md'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {wCount} Workers
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {problemIndex === 1 && (
          <div className="w-full max-w-lg p-5 rounded-3xl bg-slate-900/90 border-2 border-white/20 backdrop-blur-md shadow-2xl flex flex-col items-center">
            <AreaModel w={5} h={12} k={60} wLabel="Taps" hLabel="Minutes" width={300} height={145} />
            <div className="mt-4 flex flex-col items-center gap-3 w-full">
              <span className="text-lg sm:text-xl font-black text-white">5 taps will take:</span>
              <div className="flex gap-3">
                {[10, 12, 15].map((num) => (
                  <button
                    key={num}
                    onClick={() => setInputVal(num.toString())}
                    className={`px-5 py-2.5 rounded-2xl font-black text-lg sm:text-xl border-2 transition-all cursor-pointer ${
                      inputVal === num.toString()
                        ? 'bg-amber-400 text-slate-950 border-amber-300 scale-105 shadow-lg'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {num} minutes
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {problemIndex === 2 && (
          <div className="w-full max-w-lg p-5 rounded-3xl bg-slate-900/90 border-2 border-white/20 backdrop-blur-md shadow-2xl flex flex-col items-center">
            <AreaModel w={90} h={2} k={180} wLabel="Speed (km/h)" hLabel="Hours" width={300} height={145} />
            <div className="mt-4 flex flex-col items-center gap-3 w-full">
              <span className="text-lg sm:text-xl font-black text-white">At 90 km/h, trip time =</span>
              <div className="flex gap-3">
                {[2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setInputVal(num.toString())}
                    className={`px-5 py-2.5 rounded-2xl font-black text-lg sm:text-xl border-2 transition-all cursor-pointer ${
                      inputVal === num.toString()
                        ? 'bg-amber-400 text-slate-950 border-amber-300 scale-105 shadow-lg'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {num} hours
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
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
          {tested ? '✓ Correct! Next ➔' : 'Split the Work 👷'}
        </Button>
      </div>
    </div>
  );
}
