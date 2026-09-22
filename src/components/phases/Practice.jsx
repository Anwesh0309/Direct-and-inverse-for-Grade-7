import React, { useState, useEffect } from 'react';
import WorldSelect from '../practice/WorldSelect';
import WorldRun from '../practice/WorldRun';
import { narrate, stopNarration } from '../../utils/audio';
import { worldSelectNarration } from '../../utils/narration';

export default function Practice({
  worldsProgress,
  onFinishWorld,
  seenHashes,
  audioEnabled,
}) {
  const [activeWorldId, setActiveWorldId] = useState(null);

  useEffect(() => {
    if (!activeWorldId && audioEnabled) {
      narrate(worldSelectNarration(), true);
    }
  }, [activeWorldId, audioEnabled]);

  useEffect(() => {
    return () => stopNarration();
  }, []);

  const handleSelectWorld = (wId) => {
    stopNarration();
    setActiveWorldId(wId);
  };

  const handleBackToWorlds = () => {
    stopNarration();
    setActiveWorldId(null);
  };

  if (activeWorldId) {
    return (
      <WorldRun
        worldId={activeWorldId}
        onBackToWorlds={handleBackToWorlds}
        onFinishWorld={(summary) => {
          stopNarration();
          onFinishWorld(summary);
          setActiveWorldId(null);
        }}
        seenHashes={seenHashes}
        audioEnabled={audioEnabled}
      />
    );
  }

  return (
    <WorldSelect
      worldsProgress={worldsProgress}
      onSelectWorld={handleSelectWorld}
    />
  );
}
