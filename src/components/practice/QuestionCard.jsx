import React, { useState } from 'react';
import RatioTable from '../visuals/RatioTable';
import CoordinateGraph from '../visuals/CoordinateGraph';
import AreaModel from '../visuals/AreaModel';
import WorkerRow from '../visuals/WorkerRow';
import MachineDiagram from '../visuals/MachineDiagram';
import ScaleBar from '../visuals/ScaleBar';
import GearPair from '../visuals/GearPair';
import NumberPad from '../ui/NumberPad';

export default function QuestionCard({
  question,
  answered = false,
  selectedOption = null,
  onSelectOption,
}) {
  const [numPadVal, setNumPadVal] = useState('');

  if (!question) return null;

  const handleNumericSubmit = () => {
    if (!numPadVal) return;
    onSelectOption(numPadVal);
  };

  const renderVisual = () => {
    const { visual, visualData } = question;
    if (!visualData && visual === 'none') return null;

    switch (visual) {
      case 'ratioTable':
        return (
          <RatioTable
            headers={visualData?.headers || ['x', 'y']}
            rows={visualData?.rows || []}
          />
        );
      case 'graph':
        return (
          <CoordinateGraph
            kind={visualData?.kind || 'direct'}
            k={visualData?.k || 2}
            width={240}
            height={105}
          />
        );
      case 'areaModel':
        return (
          <AreaModel
            w={visualData?.w || 4}
            h={visualData?.h || 15}
            k={visualData?.k || 60}
            width={240}
            height={95}
          />
        );
      case 'workers':
        return (
          <WorkerRow
            count={visualData?.workers || 4}
            icon={visualData?.icon || '👷'}
          />
        );
      case 'machine':
        return (
          <MachineDiagram
            inLabel={visualData?.inLabel}
            outLabel={visualData?.outLabel}
            factor={visualData?.factor}
          />
        );
      case 'scaleBar':
        return <ScaleBar cm={visualData?.cm} km={visualData?.km} />;
      case 'gears':
        return (
          <GearPair
            teethA={visualData?.teethA}
            teethB={visualData?.teethB}
            turnsA={visualData?.turnsA}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none relative">
      {/* Rule Tag Pill centered above inner question box */}
      {question.ruleTag && (
        <div className="px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-300 to-yellow-400 text-slate-950 font-black text-sm sm:text-base font-display uppercase tracking-wider shadow-md mb-2 flex items-center gap-1.5 border-2 border-yellow-200">
          <span>✨</span>
          <span>{question.ruleTag}</span>
          <span>✨</span>
        </div>
      )}

      {/* Inner Visual & Question Box with sky-blue border matching target design */}
      <div className="w-full rounded-2xl bg-[#140a2c]/95 border-2 border-sky-400/40 p-3 sm:p-4 flex flex-col items-center justify-center my-1 shadow-inner">
        {/* Visual Canvas (if present) */}
        {question.visual && question.visual !== 'none' && (
          <div className="w-full flex items-center justify-center mb-2">
            {renderVisual()}
          </div>
        )}

        {/* Question Stem Text */}
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white text-center leading-snug font-display px-2 sm:px-4 my-1.5">
          {question.stem}
        </h3>
      </div>

      {/* Options: 2x2 Grid or NumberPad */}
      {question.numeric ? (
        <NumberPad
          value={numPadVal}
          onChange={setNumPadVal}
          onSubmit={handleNumericSubmit}
          disabled={answered}
        />
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full my-2">
          {question.options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const isCorrect = idx === question.correctIndex;

            let btnStyle = 'bg-[#180e38]/95 border-2 border-white/15 hover:border-purple-400 hover:bg-[#231454] text-white';
            if (answered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-500/30 border-2 border-emerald-400 text-emerald-200 shadow-[0_0_16px_rgba(52,211,153,0.5)]';
              } else if (isSelected) {
                btnStyle = 'bg-rose-500/30 border-2 border-rose-500 text-rose-200 opacity-80';
              } else {
                btnStyle = 'bg-slate-950/40 border-2 border-white/5 opacity-40';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={answered}
                onClick={() => onSelectOption(opt)}
                className={`min-h-[50px] sm:min-h-[58px] p-2.5 sm:p-3 rounded-2xl font-display font-black text-lg sm:text-xl md:text-2xl flex items-center justify-center text-center transition-all cursor-pointer shadow-md hover:scale-102 active:scale-98 ${btnStyle}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
