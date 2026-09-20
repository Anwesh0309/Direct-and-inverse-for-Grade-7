import React from 'react';

export default function CoordinateGraph({
  kind = 'direct', // 'direct' | 'inverse' | 'offset'
  k = 2,
  interactive = false,
  highlightPoints = [],
  width = 300,
  height = 200,
  maxX = 8,
  maxY = 16,
}) {
  const padding = 28;
  const plotW = width - padding * 2;
  const plotH = height - padding * 2;

  const toX = (x) => padding + (x / maxX) * plotW;
  const toY = (y) => height - padding - (y / maxY) * plotH;

  // Generate gridlines
  const gridLinesX = [];
  for (let x = 1; x <= maxX; x += (maxX > 10 ? 2 : 1)) {
    gridLinesX.push(x);
  }
  const gridLinesY = [];
  for (let y = 2; y <= maxY; y += (maxY > 15 ? 4 : 2)) {
    gridLinesY.push(y);
  }

  // Generate line or curve path
  let pathD = '';
  if (kind === 'direct') {
    // y = kx straight line from 0 to maxX
    const endX = Math.min(maxX, maxY / k);
    pathD = `M ${toX(0)} ${toY(0)} L ${toX(endX)} ${toY(endX * k)}`;
  } else if (kind === 'inverse') {
    // y = k / x hyperbola curve
    const points = [];
    const step = 0.2;
    for (let x = 0.6; x <= maxX; x += step) {
      const y = k / x;
      if (y <= maxY * 1.05) {
        points.push(`${toX(x)},${toY(y)}`);
      }
    }
    pathD = points.length > 1 ? `M ${points.join(' L ')}` : '';
  } else if (kind === 'offset') {
    // Non-proportion line (does not pass through origin, e.g. y = kx + 3)
    pathD = `M ${toX(0)} ${toY(3)} L ${toX(maxX)} ${toY(Math.min(maxY, 3 + k * maxX))}`;
  }

  return (
    <div className="flex flex-col items-center justify-center my-1">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="rounded-2xl border-2 border-white/20 bg-slate-900/90 shadow-2xl backdrop-blur-md overflow-visible"
        role="img"
        aria-label={`Graph of ${kind === 'direct' ? `direct proportion y = ${k}x` : `inverse proportion y = ${k}/x`}`}
      >
        <defs>
          <linearGradient id="lineGradDirect" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="lineGradInverse" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <filter id="glowPoint" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {gridLinesX.map((x) => (
          <line
            key={`gx-${x}`}
            x1={toX(x)}
            y1={toY(0)}
            x2={toX(x)}
            y2={toY(maxY)}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        ))}
        {gridLinesY.map((y) => (
          <line
            key={`gy-${y}`}
            x1={toX(0)}
            y1={toY(y)}
            x2={toX(maxX)}
            y2={toY(y)}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        ))}

        {/* Axes */}
        <line
          x1={toX(0)}
          y1={toY(0)}
          x2={toX(maxX)}
          y2={toY(0)}
          stroke="#94a3b8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1={toX(0)}
          y1={toY(0)}
          x2={toX(0)}
          y2={toY(maxY)}
          stroke="#94a3b8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Origin dot */}
        <circle
          cx={toX(0)}
          cy={toY(0)}
          r="5"
          fill={kind === 'direct' ? '#facc15' : '#94a3b8'}
          filter="url(#glowPoint)"
        />
        <text
          x={toX(0) - 12}
          y={toY(0) + 16}
          fill="#94a3b8"
          fontSize="13"
          fontWeight="bold"
          fontFamily="Nunito, sans-serif"
        >
          0
        </text>

        {/* Axis Labels */}
        <text
          x={toX(maxX) - 4}
          y={toY(0) + 18}
          fill="#cbd5e1"
          fontSize="14"
          fontWeight="900"
          fontFamily="Fredoka One, sans-serif"
        >
          x
        </text>
        <text
          x={toX(0) - 18}
          y={toY(maxY) + 6}
          fill="#cbd5e1"
          fontSize="14"
          fontWeight="900"
          fontFamily="Fredoka One, sans-serif"
        >
          y
        </text>

        {/* Graph Path */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke={kind === 'direct' ? 'url(#lineGradDirect)' : kind === 'inverse' ? 'url(#lineGradInverse)' : '#f43f5e'}
            strokeWidth="3.5"
            strokeDasharray={kind === 'offset' ? '4 3' : 'none'}
            strokeLinecap="round"
          />
        )}

        {/* Plotted Points */}
        {highlightPoints.map((pt, idx) => (
          <g key={idx}>
            <circle
              cx={toX(pt.x)}
              cy={toY(pt.y)}
              r="7"
              fill="#facc15"
              stroke="#0f172a"
              strokeWidth="2"
              filter="url(#glowPoint)"
            />
            {pt.label && (
              <text
                x={toX(pt.x) + 9}
                y={toY(pt.y) - 6}
                fill="#facc15"
                fontSize="13"
                fontWeight="900"
                fontFamily="Fredoka One, sans-serif"
              >
                {pt.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
