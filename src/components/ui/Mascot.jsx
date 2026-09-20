import React from 'react';

export default function Mascot({ state = 'idle', size = 70, className = '' }) {
  // States: 'idle' | 'happy' | 'celebrating' | 'thinking' | 'curious'
  const stateClass = ['celebrating', 'happy', 'thinking', 'curious'].includes(state) ? state : 'idle';

  const antennaColor = state === 'celebrating' ? '#ffd700' : state === 'happy' ? '#22c55e' : '#f97316';

  return (
    <div className={`mascot-container ${stateClass} ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Leo Robot Mascot (${state})`}
      >
        <defs>
          <linearGradient id="robotBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="60%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="facePlateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Antenna */}
        <line x1="50" y1="20" x2="50" y2="5" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
        <circle
          cx="50"
          cy="5"
          r="5"
          fill={antennaColor}
          className="antenna-glow"
          filter="url(#neonGlow)"
        />

        {/* Ears */}
        <rect x="5" y="42" width="6" height="12" rx="2" fill="#475569" />
        <rect x="89" y="42" width="6" height="12" rx="2" fill="#475569" />

        {/* Head Shell */}
        <rect
          x="10"
          y="20"
          width="80"
          height="60"
          rx="25"
          fill="url(#robotBodyGrad)"
          stroke="#94a3b8"
          strokeWidth="3"
        />

        {/* Dark Screen Face Plate */}
        <rect
          x="16"
          y="26"
          width="68"
          height="42"
          rx="15"
          fill="url(#facePlateGrad)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />

        {/* Digital Eyes & Mouth based on state */}
        <g filter="url(#neonGlow)">
          {(() => {
            switch (state) {
              case 'happy':
                return (
                  <>
                    <path d="M 22 42 Q 30 32 38 42" stroke="#00E676" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M 62 42 Q 70 32 78 42" stroke="#00E676" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M 40 54 Q 50 64 60 54 Z" fill="#00E676" />
                  </>
                );
              case 'celebrating':
                return (
                  <>
                    <path d="M 30 30 L 33 38 L 41 38 L 35 43 L 37 51 L 30 46 L 23 51 L 25 43 L 19 38 L 27 38 Z" fill="#FFD700" />
                    <path d="M 70 30 L 73 38 L 81 38 L 75 43 L 77 51 L 70 46 L 63 51 L 65 43 L 59 38 L 67 38 Z" fill="#FFD700" />
                    <path d="M 42 56 Q 50 62 58 56" stroke="#FFD700" strokeWidth="4" fill="none" strokeLinecap="round" />
                  </>
                );
              case 'thinking':
                return (
                  <>
                    <ellipse cx="30" cy="40" rx="8" ry="3" fill="#29B6F6" />
                    <ellipse cx="70" cy="38" rx="8" ry="6" fill="#29B6F6" />
                    <path d="M 43 56 Q 50 50 57 56" stroke="#29B6F6" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </>
                );
              case 'curious':
                return (
                  <>
                    <circle cx="30" cy="40" r="9" fill="#FFCA28" />
                    <circle cx="70" cy="40" r="6" fill="#FFCA28" />
                    <circle cx="50" cy="56" r="4" fill="#FFCA28" />
                  </>
                );
              default: // idle
                return (
                  <>
                    <circle cx="30" cy="40" r="7" fill="#818cf8" />
                    <circle cx="70" cy="40" r="7" fill="#818cf8" />
                    <path d="M 42 54 Q 50 60 58 54" stroke="#818cf8" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </>
                );
            }
          })()}
        </g>
      </svg>
    </div>
  );
}
