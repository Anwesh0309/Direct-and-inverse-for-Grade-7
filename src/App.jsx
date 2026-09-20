import React, { useState, useEffect } from 'react';
import { loadProgress, saveProgress, getDefaultProgress } from './core/storage/progressStore';
import { canOpenPhase } from './core/gamification/unlock';
import { evaluateBadges } from './content/badges';
import { setAudioMuted, unlockAudioContext } from './utils/audio';

import BackgroundGlyphs from './components/ui/BackgroundGlyphs';
import TopBar from './components/ui/TopBar';
import XPPopup from './components/ui/XPPopup';

import Landing from './components/phases/Landing';
import Wonder from './components/phases/Wonder';
import Story from './components/phases/Story';
import Simulate from './components/phases/Simulate';
import Practice from './components/phases/Practice';
import Reflect from './components/phases/Reflect';

export default function App() {
  const [progress, setProgress] = useState(() => loadProgress());
  const [currentView, setCurrentView] = useState('landing');
  const [floatingXp, setFloatingXp] = useState(null);

  // Sync audio mute state
  useEffect(() => {
    setAudioMuted(!progress.settings?.audioEnabled);
  }, [progress.settings?.audioEnabled]);

  // Save progress on change
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Unlock audio on first global user interaction
  useEffect(() => {
    const handleFirstGesture = () => {
      unlockAudioContext();
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
    window.addEventListener('pointerdown', handleFirstGesture);
    window.addEventListener('keydown', handleFirstGesture);
    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  const handleToggleAudio = () => {
    setProgress((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        audioEnabled: !prev.settings.audioEnabled,
      },
    }));
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset all lesson progress and start from the beginning?')) {
      const defaultState = getDefaultProgress();
      setProgress(defaultState);
      saveProgress(defaultState);
      setCurrentView('landing');
    }
  };

  const handleNavigate = (phaseKey) => {
    if (canOpenPhase(phaseKey, progress.phases)) {
      setCurrentView(phaseKey);
    }
  };

  const handleStartJourney = () => {
    // Always start from Wonder phase (Phase 1)
    setCurrentView('wonder');
  };

  // Phase completions
  const handleWonderComplete = () => {
    setProgress((prev) => {
      const next = {
        ...prev,
        phases: {
          ...prev.phases,
          wonder: 'done',
          story: prev.phases.story === 'locked' ? 'active' : prev.phases.story,
        },
        totals: {
          ...prev.totals,
          xp: prev.totals.xp + 15,
        },
      };
      const { updatedBadges } = evaluateBadges(next);
      next.badges = updatedBadges;
      return next;
    });
    setFloatingXp(15);
    setCurrentView('story');
  };

  const handleStoryComplete = () => {
    setProgress((prev) => {
      const next = {
        ...prev,
        phases: {
          ...prev.phases,
          story: 'done',
          simulate: prev.phases.simulate === 'locked' ? 'active' : prev.phases.simulate,
        },
        totals: {
          ...prev.totals,
          xp: prev.totals.xp + 15,
        },
      };
      const { updatedBadges } = evaluateBadges(next);
      next.badges = updatedBadges;
      return next;
    });
    setFloatingXp(15);
    setCurrentView('simulate');
  };

  const handleUpdateStation = (stationId, data) => {
    setProgress((prev) => {
      const prevStars = prev.stations[stationId]?.stars || 0;
      const newStars = Math.max(prevStars, data.stars || 0);
      const starDiff = newStars - prevStars;
      const xpBonus = starDiff * 20;

      const nextStations = {
        ...prev.stations,
        [stationId]: {
          ...prev.stations[stationId],
          ...data,
          stars: newStars,
          done: true,
        },
      };

      const next = {
        ...prev,
        stations: nextStations,
        totals: {
          ...prev.totals,
          xp: prev.totals.xp + xpBonus,
        },
      };

      const { updatedBadges } = evaluateBadges(next);
      next.badges = updatedBadges;
      return next;
    });
  };

  const handleSimulateComplete = () => {
    setProgress((prev) => ({
      ...prev,
      phases: {
        ...prev.phases,
        simulate: 'done',
        play: prev.phases.play === 'locked' ? 'active' : prev.phases.play,
      },
    }));
    setCurrentView('play');
  };

  const handleFinishWorld = (summary) => {
    setProgress((prev) => {
      const prevBest = prev.worlds[summary.worldId]?.bestStars || 0;
      const newBest = Math.max(prevBest, summary.stars);
      const starDiff = newBest - prevBest;
      const worldBonus = summary.stars >= 1 && prevBest === 0 ? 50 : 0;
      const starsBonus = starDiff * 25;

      // Unlock next world ONLY if user gives 4 or more correct answers out of 10
      const worldNum = parseInt(summary.worldId.replace('W', ''), 10);
      const earnedUnlock = (summary.correctCount >= 4) || (summary.pct >= 40);

      const nextWorlds = {
        ...prev.worlds,
        [summary.worldId]: {
          unlocked: true,
          bestStars: newBest,
          bestPct: Math.max(prev.worlds[summary.worldId]?.bestPct || 0, summary.pct),
          bestStreak: Math.max(prev.worlds[summary.worldId]?.bestStreak || 0, summary.streak),
          bestCorrect: Math.max(prev.worlds[summary.worldId]?.bestCorrect || 0, summary.correctCount || 0),
          runs: (prev.worlds[summary.worldId]?.runs || 0) + 1,
        },
      };

      if (earnedUnlock && worldNum < 10) {
        const nextWorldId = `W${worldNum + 1}`;
        nextWorlds[nextWorldId] = {
          ...nextWorlds[nextWorldId],
          unlocked: true,
        };
      }

      const totalStars = Object.values(nextWorlds).reduce((acc, w) => acc + (w.bestStars || 0), 0);
      const bestEverStreak = Math.max(prev.totals.bestStreak, summary.streak);

      const next = {
        ...prev,
        worlds: nextWorlds,
        phases: {
          ...prev.phases,
          play: summary.stars >= 1 ? 'done' : prev.phases.play,
          reflect: summary.stars >= 1 && prev.phases.reflect === 'locked' ? 'active' : prev.phases.reflect,
        },
        totals: {
          xp: prev.totals.xp + summary.xpEarned + worldBonus + starsBonus,
          stars: totalStars,
          bestStreak: bestEverStreak,
        },
      };

      const { updatedBadges } = evaluateBadges(next, summary);
      next.badges = updatedBadges;
      return next;
    });
  };

  const handleSaveReflection = (text) => {
    setProgress((prev) => ({
      ...prev,
      reflection: {
        text,
        completedAt: Date.now(),
      },
    }));
  };

  const handleCompleteLesson = () => {
    setProgress((prev) => {
      const next = {
        ...prev,
        phases: {
          ...prev.phases,
          reflect: 'done',
        },
        totals: {
          ...prev.totals,
          xp: prev.totals.xp + 50,
        },
      };
      const { updatedBadges } = evaluateBadges(next);
      next.badges = updatedBadges;
      return next;
    });
    setFloatingXp(50);
  };

  const hasAnyProgress = progress.phases.wonder === 'done' || progress.totals.xp > 0;

  return (
    <div className="app-container">
      <BackgroundGlyphs />

      {/* Global TopBar for all screens except landing */}
      {currentView !== 'landing' && (
        <TopBar
          phases={progress.phases}
          currentPhase={currentView}
          onNavigate={handleNavigate}
          onHome={() => setCurrentView('landing')}
          onClose={() => setCurrentView('landing')}
          audioEnabled={progress.settings?.audioEnabled}
          onToggleAudio={handleToggleAudio}
          xp={progress.totals.xp}
        />
      )}

      {/* Main Screen Router */}
      <main className="app-main">
        {currentView === 'landing' && (
          <Landing
            hasProgress={hasAnyProgress}
            onStart={handleStartJourney}
            onSelectPhase={(phaseKey) => setCurrentView(phaseKey)}
          />
        )}

        {currentView === 'wonder' && (
          <Wonder
            onComplete={handleWonderComplete}
            audioEnabled={progress.settings?.audioEnabled}
          />
        )}

        {currentView === 'story' && (
          <Story
            onComplete={handleStoryComplete}
            audioEnabled={progress.settings?.audioEnabled}
            initialSlide={progress.storyIndex || 0}
            onResetProgress={handleResetProgress}
          />
        )}

        {currentView === 'simulate' && (
          <Simulate
            stationsProgress={progress.stations}
            onUpdateStation={handleUpdateStation}
            onCompletePhase={handleSimulateComplete}
            audioEnabled={progress.settings?.audioEnabled}
          />
        )}

        {currentView === 'play' && (
          <Practice
            worldsProgress={progress.worlds}
            onFinishWorld={handleFinishWorld}
            seenHashes={new Set(progress.seen || [])}
            audioEnabled={progress.settings?.audioEnabled}
          />
        )}

        {currentView === 'reflect' && (
          <Reflect
            totals={progress.totals}
            worldsProgress={progress.worlds}
            reflectionData={progress.reflection}
            onSaveReflection={handleSaveReflection}
            onCompleteLesson={handleCompleteLesson}
            audioEnabled={progress.settings?.audioEnabled}
          />
        )}
      </main>

      {/* Floating XP Gain Popup */}
      {floatingXp && (
        <XPPopup amount={floatingXp} onComplete={() => setFloatingXp(null)} />
      )}
    </div>
  );
}
