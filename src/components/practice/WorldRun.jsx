import React, { useState, useEffect } from 'react';
import { WORLDS } from '../../content/worlds';
import { generateRun } from '../../core/questions/questionBank';
import { xpForCorrect } from '../../core/gamification/xp';
import { worldStars } from '../../core/gamification/stars';
import QuestionCard from './QuestionCard';
import BossBar from './BossBar';
import WorldSummary from './WorldSummary';
import HintBubble from '../ui/HintBubble';
import FeedbackOverlay from '../ui/FeedbackOverlay';
import XPPopup from '../ui/XPPopup';
import { fireConfetti } from '../ui/Confetti';
import { narrate, stopNarration } from '../../utils/audio';
import { questionNarration, hintNarration, feedbackNarration } from '../../utils/narration';

export default function WorldRun({
  worldId,
  onBackToWorlds,
  onFinishWorld,
  seenHashes,
  audioEnabled,
}) {
  const world = WORLDS.find((w) => w.id === worldId) || WORLDS[0];
  const isGuided = world.mode === 'guided';
  const isTimed = world.mode === 'timed';
  const isBoss = world.mode === 'boss';

  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [recentXp, setRecentXp] = useState(null);

  // Per-question state
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintTier, setHintTier] = useState(0);
  const [hintTiersUsed, setHintTiersUsed] = useState([]);
  const [timeLeft, setTimeLeft] = useState(world.timer || 40);

  // Boss health
  const [bossHp, setBossHp] = useState(10);

  // Out of hearts modal
  const [showOutOfHeartsModal, setShowOutOfHeartsModal] = useState(false);

  // Completed run
  const [isRunComplete, setIsRunComplete] = useState(false);

  // Initialize questions
  useEffect(() => {
    const runQuestions = generateRun(worldId, Date.now(), seenHashes);
    setQuestions(runQuestions);
    setQIndex(0);
    setHearts(3);
    setStreak(0);
    setBestStreak(0);
    setCorrectCount(0);
    setTotalXpEarned(0);
    setBossHp(10);
    setShowOutOfHeartsModal(false);
    setIsRunComplete(false);
  }, [worldId]);

  const currentQ = questions[qIndex];

  // Narration for question stem on mount/index change
  useEffect(() => {
    if (currentQ && audioEnabled && !answered) {
      narrate(questionNarration(currentQ), true);
    }
    return () => stopNarration();
  }, [qIndex, currentQ, audioEnabled]);

  // Timer countdown for Timed and Boss modes
  useEffect(() => {
    if (!world.timer || answered || isRunComplete || showOutOfHeartsModal) return;

    setTimeLeft(world.timer);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAnswer(null, true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [qIndex, world.timer, answered, isRunComplete, showOutOfHeartsModal]);

  const handleAnswer = (option, isTimeout = false) => {
    if (answered || !currentQ || showOutOfHeartsModal) return;
    setAnswered(true);
    setSelectedOption(option);

    const correctAnsStr = String(currentQ.answer).trim().toLowerCase();
    const correctLabelStr = String(currentQ.answerLabel || '').trim().toLowerCase();
    const chosenStr = String(option || '').trim().toLowerCase();

    const correct = !isTimeout && (
      chosenStr === correctAnsStr ||
      chosenStr === correctLabelStr ||
      (currentQ.options && currentQ.options[currentQ.correctIndex] && chosenStr === currentQ.options[currentQ.correctIndex].trim().toLowerCase())
    );

    setIsCorrect(correct);

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setCorrectCount((prev) => prev + 1);

      if (isBoss) {
        setBossHp((prev) => Math.max(0, prev - 1));
      }

      // XP calculation
      const xpGained = xpForCorrect({
        tier: currentQ.tier,
        streak: newStreak,
        hintTiersUsed,
        timeLeft,
        timed: isTimed || isBoss,
      });

      setTotalXpEarned((prev) => prev + xpGained);
      setRecentXp(xpGained);

      fireConfetti();
      if (audioEnabled) {
        narrate(feedbackNarration(true), true);
      }
    } else {
      setStreak(0);
      setHearts((prev) => Math.max(0, prev - 1));
      if (audioEnabled) {
        narrate(feedbackNarration(false), true);
      }
    }
  };

  const handleRetryWorld = () => {
    const runQuestions = generateRun(worldId, Date.now(), seenHashes);
    setQuestions(runQuestions);
    setQIndex(0);
    setHearts(3);
    setStreak(0);
    setBestStreak(0);
    setCorrectCount(0);
    setTotalXpEarned(0);
    setAnswered(false);
    setSelectedOption(null);
    setHintTier(0);
    setHintTiersUsed([]);
    setShowOutOfHeartsModal(false);
    setIsRunComplete(false);
  };

  const handleUseHint = () => {
    if (hintTier < (currentQ.hints?.length || 3)) {
      const nextTier = hintTier + 1;
      setHintTier(nextTier);
      setHintTiersUsed((prev) => [...prev, nextTier]);

      if (audioEnabled && currentQ.hints[nextTier - 1]) {
        narrate(hintNarration(currentQ.hints[nextTier - 1]), true);
      }
    }
  };

  const handleNextQuestion = () => {
    if (hearts <= 0) {
      setShowOutOfHeartsModal(true);
      setAnswered(false);
      return;
    }

    if (qIndex + 1 < questions.length) {
      setQIndex((prev) => prev + 1);
      setAnswered(false);
      setSelectedOption(null);
      setHintTier(0);
      setHintTiersUsed([]);
      setTimeLeft(world.timer || 40);
    } else {
      setIsRunComplete(true);
      const pct = Math.round((correctCount / questions.length) * 100);
      const stars = worldStars(pct);

      onFinishWorld({
        worldId,
        stars,
        pct,
        streak: bestStreak,
        xpEarned: totalXpEarned,
        hearts,
        hintsUsed: hintTiersUsed.length,
        correctCount,
      });
    }
  };

  if (isRunComplete) {
    const pct = Math.round((correctCount / questions.length) * 100);
    const stars = worldStars(pct);

    return (
      <WorldSummary
        worldId={worldId}
        worldName={world.name}
        stars={stars}
        accuracy={pct}
        streak={bestStreak}
        xpEarned={totalXpEarned}
        correctCount={correctCount}
        onReplay={handleRetryWorld}
        onNextWorld={onBackToWorlds}
      />
    );
  }

  const progressPct = Math.round((qIndex / 10) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto h-full flex flex-col justify-between items-center py-1 sm:py-2 px-3 select-none text-center overflow-y-auto custom-scrollbar">
      {/* Top Bar: Back to Worlds button on left matching target design */}
      <div className="w-full flex items-center justify-between gap-2 my-1 flex-shrink-0">
        <button
          onClick={onBackToWorlds}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-sm sm:text-base font-black font-display text-white shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <span className="text-base sm:text-lg">←</span>
          <span>Worlds</span>
        </button>

        {/* World Name Pill matching target design */}
        <div className="px-5 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-display font-black text-base sm:text-lg md:text-xl shadow-md flex items-center justify-center gap-2 mx-auto">
          <span>⭐</span>
          <span>{world.name}</span>
        </div>

        <div className="w-16 sm:w-20" />
      </div>

      {/* Stats Row matching target design (Stars, 3 Hearts, Streak) */}
      <div className="w-full flex items-center justify-between px-2 my-1 flex-shrink-0">
        {/* Left: Star counter */}
        <div className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-white/10 border border-white/15 text-sm sm:text-base md:text-lg font-black text-amber-300 font-display">
          <span className="text-lg sm:text-xl">⭐</span>
          <span>{correctCount}</span>
        </div>

        {/* Center: 3 Glowing Hearts */}
        <div className="flex items-center gap-2.5 text-2xl sm:text-3xl">
          {Array.from({ length: 3 }).map((_, i) => {
            const isAlive = i < hearts;
            return (
              <span
                key={i}
                className={`transition-all duration-300 ${
                  isAlive
                    ? 'opacity-100 scale-100 drop-shadow-[0_0_10px_rgba(244,63,94,0.85)]'
                    : 'opacity-25 grayscale scale-90'
                }`}
              >
                {isAlive ? '❤️' : '🖤'}
              </span>
            );
          })}
        </div>

        {/* Right: Streak counter */}
        <div className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-white/10 border border-white/15 text-sm sm:text-base md:text-lg font-black text-amber-400 font-display">
          <span className="text-lg sm:text-xl">🔥</span>
          <span>{streak}x</span>
        </div>
      </div>

      {/* Progress Line matching target design */}
      <div className="w-full my-1 flex-shrink-0">
        <div className="flex items-center justify-between text-xs sm:text-sm font-black font-display text-slate-200 mb-1 px-1">
          <span>Question {qIndex + 1}/10</span>
          <span>{progressPct}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 shadow-[0_0_10px_#38bdf8] transition-all duration-300"
            style={{ width: `${Math.max(4, progressPct)}%` }}
          />
        </div>
      </div>

      {/* Boss Health Bar (if W10) */}
      {isBoss && <BossBar hp={bossHp} maxHp={10} />}

      {/* Main Question Card container - auto scrollable if needed */}
      <div className="w-full bg-[#1c1242]/95 border-2 border-white/15 rounded-[28px] p-3 sm:p-4.5 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center relative my-auto overflow-y-auto custom-scrollbar max-h-full">
        <QuestionCard
          question={currentQ}
          answered={answered}
          selectedOption={selectedOption}
          onSelectOption={handleAnswer}
        />

        {/* Hints or Worked Feedback */}
        {answered ? (
          <FeedbackOverlay
            kind={isCorrect ? 'correct' : 'incorrect'}
            solution={currentQ?.solution || []}
            correctAnswer={currentQ?.answerLabel || String(currentQ?.answer)}
            userChoice={selectedOption}
            onNext={handleNextQuestion}
          />
        ) : (
          <div className="w-full flex flex-col items-center mt-1.5">
            {hintTier > 0 ? (
              <HintBubble
                tier={hintTier}
                text={currentQ?.hints?.[hintTier - 1]}
                onNextTier={handleUseHint}
                maxTiers={currentQ?.hints?.length || 3}
              />
            ) : (
              <button
                onClick={handleUseHint}
                className="mt-0.5 px-6 py-2 rounded-full bg-purple-500/25 hover:bg-purple-500/35 border border-purple-400/45 text-purple-100 text-sm sm:text-base font-black font-display shadow transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                💡 Need a Hint?
              </button>
            )}
          </div>
        )}
      </div>

      {/* Floating XP Gain Popup */}
      {recentXp && (
        <XPPopup amount={recentXp} onComplete={() => setRecentXp(null)} />
      )}

      {/* Out of Hearts Modal Overlay */}
      {showOutOfHeartsModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4 select-none animate-fadeIn">
          <div className="bg-[#1c1242]/95 border-2 border-rose-500/60 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center flex flex-col items-center shadow-2xl shadow-rose-950/80">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-rose-500/20 border-2 border-rose-400/40 flex items-center justify-center text-4xl sm:text-5xl mb-3 shadow-inner">
              💔
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-display mb-1">
              Out of Hearts!
            </h3>
            <p className="text-sm sm:text-base font-bold text-slate-200 mb-4 leading-relaxed font-body">
              You ran out of hearts in this world run. Don't worry — practice makes perfect!
            </p>

            {/* Summary recap pill */}
            <div className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 mb-5 flex items-center justify-around text-xs sm:text-sm font-black font-display text-slate-200">
              <div>
                <span className="block text-slate-400 font-bold text-[11px]">Correct Answers</span>
                <span className="text-base text-amber-300 font-black">{correctCount} / 10</span>
              </div>
              <div className="h-6 w-px bg-white/15" />
              <div>
                <span className="block text-slate-400 font-bold text-[11px]">XP Earned</span>
                <span className="text-base text-purple-300 font-black">+{totalXpEarned} ✨</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full font-display">
              <button
                onClick={handleRetryWorld}
                className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-base sm:text-lg font-display shadow-lg hover:scale-102 active:scale-98 transition-transform cursor-pointer"
              >
                🔄 Retry World
              </button>
              <button
                onClick={onBackToWorlds}
                className="w-full py-3 px-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-base sm:text-lg font-display shadow transition-all cursor-pointer hover:scale-102 active:scale-98"
              >
                🌍 World List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
