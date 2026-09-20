import React, { useState, useEffect, useRef } from 'react';
import { STATIONS } from '../../content/stations';
import { stationStars } from '../../core/gamification/stars';
import { canEnterPractice } from '../../core/gamification/unlock';
import RatioTableLab from '../stations/RatioTableLab';
import GraphPlotter from '../stations/GraphPlotter';
import WorkerWorkshop from '../stations/WorkerWorkshop';
import DetectiveDesk from '../stations/DetectiveDesk';
import MissionControl from '../stations/MissionControl';
import { narrate, stopNarration } from '../../utils/audio';
import { stationIntroNarration } from '../../utils/narration';

export default function Simulate({
  stationsProgress,
  onUpdateStation,
  onCompletePhase,
  audioEnabled,
}) {
  const [selectedStationId, setSelectedStationId] = useState('S1');
  const [problemIndex, setProblemIndex] = useState(0); // 0, 1, 2
  const [wrongCount, setWrongCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const isAdvancingRef = useRef(false);

  const currentStationMeta = STATIONS.find((s) => s.id === selectedStationId) || STATIONS[0];
  const isPracticeUnlocked = canEnterPractice(stationsProgress);

  useEffect(() => {
    if (audioEnabled) {
      narrate(stationIntroNarration(selectedStationId), true);
    }
    return () => stopNarration();
  }, [selectedStationId, audioEnabled]);

  const handleSelectStation = (sId) => {
    setSelectedStationId(sId);
    setProblemIndex(0);
    setWrongCount(0);
    setHintsUsed(0);
  };

  const handleAttempt = (correct) => {
    if (!correct) {
      setWrongCount((prev) => prev + 1);
    }
  };

  const handleProblemDone = () => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    setTimeout(() => {
      isAdvancingRef.current = false;
    }, 600);

    if (problemIndex < 2) {
      setProblemIndex((prev) => prev + 1);
    } else {
      // Station complete! Evaluate stars
      const starsEarned = stationStars({ wrong: wrongCount, hints: hintsUsed });
      onUpdateStation(selectedStationId, {
        done: true,
        stars: starsEarned,
      });

      // Auto-unlock next station
      const nextIndex = STATIONS.findIndex((s) => s.id === selectedStationId) + 1;
      if (nextIndex < STATIONS.length) {
        const nextId = STATIONS[nextIndex].id;
        setSelectedStationId(nextId);
        setProblemIndex(0);
        setWrongCount(0);
        setHintsUsed(0);
      }
    }
  };

  const renderStationComponent = () => {
    const props = {
      problemIndex,
      seed: 1,
      onAttempt: handleAttempt,
      onProblemDone: handleProblemDone,
    };

    switch (selectedStationId) {
      case 'S1':
        return <RatioTableLab key={`S1-${problemIndex}`} {...props} />;
      case 'S2':
        return <GraphPlotter key={`S2-${problemIndex}`} {...props} />;
      case 'S3':
        return <WorkerWorkshop key={`S3-${problemIndex}`} {...props} />;
      case 'S4':
        return <DetectiveDesk key={`S4-${problemIndex}`} {...props} />;
      case 'S5':
        return <MissionControl key={`S5-${problemIndex}`} {...props} />;
      default:
        return <RatioTableLab {...props} />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto h-full flex flex-col justify-between items-center py-2 px-4 select-none overflow-hidden font-display">
      {/* Top Header */}
      <div className="text-center my-1">
        <div className="w-24 h-2 rounded-full bg-[#38bdf8] shadow-[0_0_18px_#38bdf8] mb-2 mx-auto" />
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display flex items-center justify-center gap-3">
          <span className="text-3xl sm:text-4xl">🧪</span>
          <span>Simulation Stations</span>
        </h2>
      </div>

      {/* Main 2-Pane Container */}
      <div className="w-full bg-[#1c1242]/95 border border-white/15 rounded-[36px] p-3 sm:p-5 flex flex-col md:flex-row gap-3.5 shadow-2xl backdrop-blur-xl flex-1 max-h-[86vh] overflow-hidden my-auto">
        {/* Left Rail (Stations list) */}
        <div className="w-full md:w-80 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto custom-scrollbar flex-shrink-0 pb-1 md:pb-0">
          {STATIONS.map((st, idx) => {
            const progress = stationsProgress[st.id] || {};
            const isSelected = selectedStationId === st.id;
            const isUnlocked = true;
            const isDone = progress.done;

            return (
              <button
                key={st.id}
                onClick={() => handleSelectStation(st.id)}
                className={`p-2.5 sm:p-3.5 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between flex-shrink-0 md:flex-shrink select-none ${
                  isSelected
                    ? 'border-2 border-[#38bdf8] bg-[#1e2858] text-white shadow-[0_0_18px_rgba(56,189,248,0.5)] scale-102'
                    : 'border border-white/10 bg-[#160b33]/80 text-slate-200 hover:bg-[#1f1044]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-sky-950/70 border-2 border-sky-400/40 flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 shadow-md">
                    {st.icon}
                  </span>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-300 leading-none">
                      Station {idx + 1}:
                    </div>
                    <div className="text-base sm:text-lg md:text-xl font-black text-white font-display mt-0.5">
                      {st.railName[1]}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-base sm:text-lg">
                  {isDone ? (
                    <span className="text-emerald-400 font-black text-lg sm:text-xl">✓</span>
                  ) : (
                    <span className="text-amber-400 text-lg sm:text-xl">🔓</span>
                  )}
                </div>
              </button>
            );
          })}

          {/* Go to Practice Phase Button */}
          <div className="mt-auto pt-2 w-full">
            <button
              onClick={onCompletePhase}
              className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] text-[#1e1b4b] font-black text-base sm:text-lg md:text-xl shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:scale-102 active:scale-98 transition-transform font-display cursor-pointer text-center whitespace-nowrap"
            >
              Go to Practice Phase! ➔
            </button>
          </div>
        </div>

        {/* Right Active Station Canvas */}
        <div className="flex-1 bg-[#140b2f]/95 rounded-3xl border border-white/15 p-3.5 sm:p-5 flex flex-col justify-between overflow-y-auto custom-scrollbar shadow-inner">
          {/* Station Title Banner & Problem Progress Segment */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/15 pb-2.5 px-1 gap-2 flex-shrink-0">
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-display">
                {currentStationMeta.title}
              </h3>
            </div>
            
            {/* Problem Progress Tracker */}
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-wider">Progress:</span>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    className={`h-4 px-2.5 rounded-full text-xs sm:text-sm font-black flex items-center justify-center transition-all ${
                      idx === problemIndex
                        ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_#facc15] scale-105'
                        : idx < problemIndex
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/15 text-slate-400 border border-white/10'
                    }`}
                  >
                    {idx < problemIndex ? '✓' : idx + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Solve Concept Prompt */}
          <div className="text-center my-1.5 flex-shrink-0">
            <span className="text-base sm:text-lg md:text-xl font-black text-[#facc15] font-display bg-amber-500/10 px-4 py-1 rounded-full border border-amber-400/20 inline-block">
              🎯 Concept: {currentStationMeta.concept}
            </span>
          </div>

          {/* Interactive Component Area */}
          <div className="flex-1 flex items-center justify-center overflow-y-auto custom-scrollbar my-1 py-1">
            {renderStationComponent()}
          </div>
        </div>
      </div>
    </div>
  );
}
