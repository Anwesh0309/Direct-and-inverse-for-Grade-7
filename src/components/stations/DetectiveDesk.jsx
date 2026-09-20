import React, { useState, useEffect, useRef } from 'react';
import Button from '../ui/Button';

export default function DetectiveDesk({ problemIndex = 0, onAttempt, onProblemDone }) {
  const [divideTested, setDivideTested] = useState(false);
  const [multiplyTested, setMultiplyTested] = useState(false);
  const [selectedBin, setSelectedBin] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [tested, setTested] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setDivideTested(false);
    setMultiplyTested(false);
    setSelectedBin(null);
    setErrorMsg('');
    setTested(false);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [problemIndex]);

  // 3 rounds of cards
  const cards = [
    {
      title: 'Story Card: Festival Lanterns',
      desc: '3 lanterns cost S$21, 6 lanterns cost S$42, and 10 lanterns cost S$70.',
      pairs: [[3, 21], [6, 42], [10, 70]],
      xLabel: 'Lanterns',
      yLabel: 'Cost (S$)',
      divides: ['21 ÷ 3 = 7', '42 ÷ 6 = 7', '70 ÷ 10 = 7'],
      multiplies: ['3 × 21 = 63', '6 × 42 = 252', '10 × 70 = 700'],
      correctCategory: 'direct',
    },
    {
      title: 'Story Card: Packing Volunteers',
      desc: '2 volunteers take 18 hours, 4 volunteers take 9 hours, and 6 volunteers take 6 hours.',
      pairs: [[2, 18], [4, 9], [6, 6]],
      xLabel: 'Helpers',
      yLabel: 'Hours',
      divides: ['18 ÷ 2 = 9', '9 ÷ 4 = 2.25', '6 ÷ 6 = 1'],
      multiplies: ['2 × 18 = 36', '4 × 9 = 36', '6 × 6 = 36'],
      correctCategory: 'inverse',
    },
    {
      title: 'Story Card: Taxi Ride Fare',
      desc: 'A ride with a S$4 flag-down fare: 2 km costs S$7, 4 km costs S$10, and 6 km costs S$13.',
      pairs: [[2, 7], [4, 10], [6, 13]],
      xLabel: 'Distance (km)',
      yLabel: 'Fare (S$)',
      divides: ['7 ÷ 2 = 3.5', '10 ÷ 4 = 2.5', '13 ÷ 6 = 2.17'],
      multiplies: ['2 × 7 = 14', '4 × 10 = 40', '6 × 13 = 78'],
      correctCategory: 'neither',
    },
  ];

  const currentCard = cards[problemIndex] || cards[0];

  const handleSort = (bin) => {
    if (tested) return;

    setSelectedBin(bin);
    if (bin === currentCard.correctCategory) {
      setTested(true);
      setErrorMsg('');
      onAttempt(true);
      timerRef.current = setTimeout(onProblemDone, 1000);
    } else {
      if (currentCard.correctCategory === 'direct') {
        setErrorMsg('The divide test gives 7 every time! So this card is Direct Proportion.');
      } else if (currentCard.correctCategory === 'inverse') {
        setErrorMsg('The multiply test gives 36 every time! So this card is Inverse Proportion.');
      } else {
        setErrorMsg('Neither the ratio nor the product is constant. It is Neither!');
      }
      onAttempt(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-h-full my-auto text-center px-2 py-1 select-none font-display overflow-y-auto custom-scrollbar">
      {/* Title / Instruction */}
      <div className="mb-1 flex-shrink-0">
        <span className="text-sm sm:text-base md:text-lg font-black text-amber-300 uppercase tracking-wide font-display">
          Problem {problemIndex + 1} of 3: Test with the Two Detective Tests, then sort the card!
        </span>
      </div>

      {/* Detective Card */}
      <div className="w-full max-w-xl p-5 rounded-3xl bg-indigo-950/70 border-2 border-indigo-400/50 backdrop-blur-md shadow-2xl my-1 text-left font-display">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg sm:text-xl font-black text-white font-display">
            🕵️ {currentCard.title}
          </span>
          <span className="text-sm sm:text-base font-black text-slate-300">
            x = {currentCard.xLabel}, y = {currentCard.yLabel}
          </span>
        </div>
        <p className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed mb-4 font-body">
          {currentCard.desc}
        </p>

        {/* Detective Action Buttons */}
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => setDivideTested(true)}
            className={`flex-1 py-3 px-4 rounded-2xl font-display font-black text-base sm:text-lg transition-all cursor-pointer border-2 ${
              divideTested
                ? 'bg-emerald-500/40 border-emerald-400 text-emerald-100 shadow-lg scale-102'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
          >
            🔍 Run ÷ Test (y ÷ x)
          </button>
          <button
            onClick={() => setMultiplyTested(true)}
            className={`flex-1 py-3 px-4 rounded-2xl font-display font-black text-base sm:text-lg transition-all cursor-pointer border-2 ${
              multiplyTested
                ? 'bg-cyan-500/40 border-cyan-400 text-cyan-100 shadow-lg scale-102'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
          >
            🔍 Run × Test (x × y)
          </button>
        </div>

        {/* Live Test Results & Diagnostic Clue Badges */}
        <div className="grid grid-cols-2 gap-3 text-sm sm:text-base font-bold">
          {divideTested ? (
            <div className="p-3 rounded-2xl bg-black/60 border-2 border-emerald-500/60 text-emerald-300 shadow-inner">
              <span className="block font-black text-xs sm:text-sm text-emerald-400 uppercase font-display mb-1 flex items-center justify-between">
                <span>÷ Division Test:</span>
                <span className="text-xs bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                  {currentCard.correctCategory === 'direct' ? '✓ CONSTANT!' : '✗ Varies'}
                </span>
              </span>
              {currentCard.divides.map((d, i) => (
                <div key={i} className="text-xs sm:text-sm">{d}</div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-white/5 border border-dashed border-white/20 text-slate-400 text-xs sm:text-sm flex items-center justify-center italic">
              Tap "Run ÷ Test" to divide y ÷ x
            </div>
          )}

          {multiplyTested ? (
            <div className="p-3 rounded-2xl bg-black/60 border-2 border-cyan-500/60 text-cyan-300 shadow-inner">
              <span className="block font-black text-xs sm:text-sm text-cyan-400 uppercase font-display mb-1 flex items-center justify-between">
                <span>× Multiplication Test:</span>
                <span className="text-xs bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
                  {currentCard.correctCategory === 'inverse' ? '✓ CONSTANT!' : '✗ Varies'}
                </span>
              </span>
              {currentCard.multiplies.map((m, i) => (
                <div key={i} className="text-xs sm:text-sm">{m}</div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-white/5 border border-dashed border-white/20 text-slate-400 text-xs sm:text-sm flex items-center justify-center italic">
              Tap "Run × Test" to multiply x × y
            </div>
          )}
        </div>

        {/* Dynamic Clue Pill */}
        {(divideTested || multiplyTested) && (
          <div className="mt-3 p-2 px-3 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs sm:text-sm font-bold flex items-center gap-2">
            <span>💡 Detective Clue:</span>
            <span>
              {divideTested && currentCard.correctCategory === 'direct' && 'Quotients are identical (7)! This is Direct Proportion.'}
              {multiplyTested && currentCard.correctCategory === 'inverse' && 'Products are identical (36)! This is Inverse Proportion.'}
              {(divideTested || multiplyTested) && currentCard.correctCategory === 'neither' && 'Neither ÷ nor × gives a constant number! This is Neither.'}
            </span>
          </div>
        )}
      </div>

      {/* 3 Sorting Bins */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xl my-2">
        <button
          onClick={() => handleSort('direct')}
          className={`p-4 rounded-3xl border-2 font-display font-black text-base sm:text-lg transition-all cursor-pointer shadow-xl flex flex-col items-center ${
            selectedBin === 'direct'
              ? 'bg-emerald-500/40 border-emerald-400 text-white scale-105 shadow-emerald-950/80'
              : 'bg-white/5 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20'
          }`}
        >
          <span className="text-3xl sm:text-4xl mb-1">📈</span>
          <span>Direct</span>
          <span className="text-xs sm:text-sm opacity-90 font-semibold">y ÷ x = k</span>
        </button>

        <button
          onClick={() => handleSort('inverse')}
          className={`p-4 rounded-3xl border-2 font-display font-black text-base sm:text-lg transition-all cursor-pointer shadow-xl flex flex-col items-center ${
            selectedBin === 'inverse'
              ? 'bg-cyan-500/40 border-cyan-400 text-white scale-105 shadow-cyan-950/80'
              : 'bg-white/5 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20'
          }`}
        >
          <span className="text-3xl sm:text-4xl mb-1">🔁</span>
          <span>Inverse</span>
          <span className="text-xs sm:text-sm opacity-90 font-semibold">x × y = k</span>
        </button>

        <button
          onClick={() => handleSort('neither')}
          className={`p-4 rounded-3xl border-2 font-display font-black text-base sm:text-lg transition-all cursor-pointer shadow-xl flex flex-col items-center ${
            selectedBin === 'neither'
              ? 'bg-purple-500/40 border-purple-400 text-white scale-105 shadow-purple-950/80'
              : 'bg-white/5 border-purple-500/40 text-purple-300 hover:bg-purple-500/20'
          }`}
        >
          <span className="text-3xl sm:text-4xl mb-1">🚫</span>
          <span>Neither</span>
          <span className="text-xs sm:text-sm opacity-90 font-semibold">Tests fail</span>
        </button>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="text-sm sm:text-base text-rose-300 font-bold my-1 bg-rose-950/70 px-4 py-1.5 rounded-full border border-rose-500/40 animate-bounce">
          {errorMsg}
        </div>
      )}

      {tested && (
        <div className="text-base sm:text-lg font-black text-emerald-400 font-display animate-pulse">
          ✓ Correct Sorting! Loading next...
        </div>
      )}
    </div>
  );
}
