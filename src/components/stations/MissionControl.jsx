import React, { useState, useEffect, useRef } from 'react';
import Button from '../ui/Button';

export default function MissionControl({ problemIndex = 0, onAttempt, onProblemDone }) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [placedStepIds, setPlacedStepIds] = useState([]);
  const [inputAnswer, setInputAnswer] = useState('');
  const [tested, setTested] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    setSelectedMethod(null);
    setPlacedStepIds([]);
    setInputAnswer('');
    setTested(false);
    setErrorMsg('');

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [problemIndex]);

  const missions = [
    {
      title: 'Mission 1: Direct Unitary Method',
      stem: '4 handmade lanterns cost S$28. How much will 7 lanterns cost?',
      expectedMethod: 'Unitary Method',
      correctSteps: [
        { id: 's1', text: 'Find unit price for 1 lantern: S$28 ÷ 4 = S$7' },
        { id: 's2', text: 'Multiply unit price by 7: 7 × S$7 = S$49' },
      ],
      canonicalAnswer: 49,
      answerChoices: [35, 42, 49, 56],
      unit: 'S$',
    },
    {
      title: 'Mission 2: Inverse Constant Product',
      stem: '5 assembly robots take 12 minutes to package gift boxes. How many minutes will 6 robots take?',
      expectedMethod: 'Constant Product (xy = k)',
      correctSteps: [
        { id: 's1', text: 'Calculate constant total work: 5 × 12 = 60 robot-minutes' },
        { id: 's2', text: 'Divide total work by 6 robots: 60 ÷ 6 = 10 minutes' },
      ],
      canonicalAnswer: 10,
      answerChoices: [8, 10, 12, 15],
      unit: 'minutes',
    },
    {
      title: 'Mission 3: Combined Proportion Stretch',
      stem: '6 machines make 360 toys in 5 hours. How many toys can 8 machines make in 3 hours?',
      expectedMethod: 'Combined Proportion',
      correctSteps: [
        { id: 's1', text: 'Find output per machine per hour: 360 ÷ (6 × 5) = 12 toys/hour' },
        { id: 's2', text: 'Calculate for 8 machines in 3 hours: 8 × 3 × 12 = 288 toys' },
      ],
      canonicalAnswer: 288,
      answerChoices: [240, 260, 288, 320],
      unit: 'toys',
    },
  ];

  const currentMission = missions[problemIndex] || missions[0];

  const handleToggleStep = (stepId) => {
    if (placedStepIds.includes(stepId)) {
      setPlacedStepIds(placedStepIds.filter((id) => id !== stepId));
    } else {
      setPlacedStepIds([...placedStepIds, stepId]);
    }
  };

  const handleLaunch = () => {
    if (tested) return;

    if (selectedMethod !== currentMission.expectedMethod) {
      setErrorMsg(`Pick the correct method: ${currentMission.expectedMethod}!`);
      onAttempt(false);
      return;
    }

    if (placedStepIds.length !== currentMission.correctSteps.length) {
      setErrorMsg('Tap all solution steps to put them in order!');
      onAttempt(false);
      return;
    }

    if (parseInt(inputAnswer, 10) === currentMission.canonicalAnswer) {
      setTested(true);
      setErrorMsg('');
      onAttempt(true);
      timerRef.current = setTimeout(onProblemDone, 1000);
    } else {
      setErrorMsg(`Check your math: the answer is ${currentMission.canonicalAnswer} ${currentMission.unit}.`);
      onAttempt(false);
    }
  };

  // Step readiness checks for visual indicators
  const step1Done = selectedMethod === currentMission.expectedMethod;
  const step2Done = placedStepIds.length === currentMission.correctSteps.length;
  const step3Done = parseInt(inputAnswer, 10) === currentMission.canonicalAnswer;

  return (
    <div className="flex flex-col items-center justify-between w-full max-h-full my-auto text-center px-2 py-1 select-none font-display overflow-y-auto custom-scrollbar">
      {/* Title & Step Tracker */}
      <div className="mb-1 w-full max-w-xl flex-shrink-0">
        <div className="text-sm sm:text-base md:text-lg font-black text-amber-300 uppercase tracking-wide font-display mb-1">
          Problem {problemIndex + 1} of 3: {currentMission.title}
        </div>

        {/* Visual 3-Step Progress Badges */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-black">
          <span className={`px-2.5 py-0.5 rounded-full border transition-all ${
            selectedMethod ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200' : 'bg-white/5 border-white/10 text-slate-400'
          }`}>
            {selectedMethod ? '✓ Step 1' : '1. Method'}
          </span>
          <span className="text-slate-500">➔</span>
          <span className={`px-2.5 py-0.5 rounded-full border transition-all ${
            step2Done ? 'bg-purple-500/30 border-purple-400 text-purple-200' : 'bg-white/5 border-white/10 text-slate-400'
          }`}>
            {step2Done ? '✓ Step 2' : '2. Steps'}
          </span>
          <span className="text-slate-500">➔</span>
          <span className={`px-2.5 py-0.5 rounded-full border transition-all ${
            inputAnswer ? 'bg-amber-500/30 border-amber-400 text-amber-200' : 'bg-white/5 border-white/10 text-slate-400'
          }`}>
            {inputAnswer ? '✓ Step 3' : '3. Answer'}
          </span>
        </div>
      </div>

      {/* Main Mission Card */}
      <div className="w-full max-w-xl p-3.5 sm:p-4 rounded-2xl bg-indigo-950/70 border-2 border-indigo-400/40 backdrop-blur-md shadow-2xl my-1 text-left font-display">
        <p className="text-base sm:text-lg md:text-xl font-bold text-white mb-2.5 leading-snug">
          {currentMission.stem}
        </p>

        {/* Step 1: Method Picker */}
        <div className="mb-2.5">
          <span className="text-xs sm:text-sm font-black text-cyan-300 uppercase tracking-wider block mb-1">
            Step 1: Choose Solution Method
          </span>
          <div className="flex flex-wrap gap-2">
            {['Unitary Method', 'Constant Product (xy = k)', 'Combined Proportion'].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMethod(m)}
                className={`py-1.5 px-3.5 rounded-xl text-xs sm:text-sm md:text-base font-black transition-all cursor-pointer border ${
                  selectedMethod === m
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-102'
                    : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Order Solution Steps */}
        <div className="mb-2.5">
          <span className="text-xs sm:text-sm font-black text-purple-300 uppercase tracking-wider block mb-1">
            Step 2: Tap Solution Steps into Order
          </span>
          <div className="space-y-1.5">
            {currentMission.correctSteps.map((s, idx) => {
              const isSelected = placedStepIds.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => handleToggleStep(s.id)}
                  className={`w-full py-2 px-3.5 rounded-xl text-left text-xs sm:text-sm md:text-base font-bold transition-all cursor-pointer border flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-600/40 border-purple-400 text-purple-100 shadow-md'
                      : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="leading-snug">{s.text}</span>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ml-2 border ${
                    isSelected ? 'bg-purple-400 text-slate-950 border-purple-300' : 'bg-white/15 text-white border-white/20'
                  }`}>
                    {isSelected ? '✓' : idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Numeric Input & Quick Tap Choice Pills */}
        <div className="pt-2 border-t border-white/15">
          <span className="text-xs sm:text-sm font-black text-amber-300 uppercase block mb-1.5">
            Step 3: Select or Type Final Answer ({currentMission.unit})
          </span>
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Quick Tap Choices */}
            <div className="flex flex-wrap gap-2">
              {currentMission.answerChoices.map((choice) => (
                <button
                  key={choice}
                  onClick={() => setInputAnswer(choice.toString())}
                  className={`px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm md:text-base border transition-all cursor-pointer ${
                    inputAnswer === choice.toString()
                      ? 'bg-amber-400 text-slate-950 border-amber-300 scale-105 shadow-md'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                >
                  {choice} {currentMission.unit}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <input
              type="number"
              placeholder="?"
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              className="w-24 px-3 py-1 text-center font-black text-gold bg-black/60 border border-amber-400 rounded-xl focus:outline-none text-base sm:text-lg shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="text-xs sm:text-sm text-rose-300 font-black my-1 bg-rose-950/70 px-4 py-1 rounded-full border border-rose-500/40 animate-bounce flex-shrink-0">
          {errorMsg}
        </div>
      )}

      {/* Action Button */}
      <div className="my-1.5 flex-shrink-0">
        <Button variant="gold" size="md" onClick={handleLaunch} className="text-base sm:text-lg font-black py-2.5 px-8">
          {tested ? '✓ Mission Solved! Next ➔' : 'Launch Solution 🚀'}
        </Button>
      </div>
    </div>
  );
}

