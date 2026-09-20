import React from 'react';

export default function ProgressRing({ timeLeft = 40, totalTime = 40, size = 48 }) {
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, timeLeft / totalTime));
  const offset = circumference - pct * circumference;

  let color = '#38bdf8'; // Blue
  if (timeLeft <= 5) color = '#f43f5e'; // Red alert
  else if (timeLeft <= 10) color = '#facc15'; // Amber warning

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={stroke}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: 'stroke-dashoffset 0.8s linear, stroke 0.3s' }}
        />
      </svg>
      <span
        className="absolute font-display font-black text-xs"
        style={{ color }}
      >
        {timeLeft}s
      </span>
    </div>
  );
}
