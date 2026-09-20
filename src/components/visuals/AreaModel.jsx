import React from 'react';

export default function AreaModel({
  w = 4,
  h = 15,
  k = 60,
  wLabel = 'Workers',
  hLabel = 'Days',
  onChangeWidth = null,
  interactive = false,
  width = 300,
  height = 180,
}) {
  // Map w and h into visual rectangle dimensions bounded inside the SVG
  const maxVisualW = width - 70;
  const maxVisualH = height - 50;

  // Let width scale from 2 to 12
  const rectW = Math.max(50, Math.min(maxVisualW, 40 + (w / 12) * (maxVisualW - 40)));
  const rectH = Math.max(30, Math.min(maxVisualH, (k / (w * 1.5)) + 30));

  return (
    <div className="flex flex-col items-center justify-center my-1 w-full max-w-sm mx-auto">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="rounded-2xl border-2 border-white/20 bg-slate-900/90 shadow-2xl backdrop-blur-md"
        role="img"
        aria-label={`Area rectangle model: ${w} ${wLabel} by ${h} ${hLabel}, total area ${k}`}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Rectangle representing constant work k */}
        <g transform="translate(45, 25)">
          <rect
            x="0"
            y="0"
            width={rectW}
            height={rectH}
            fill="url(#areaGrad)"
            stroke="#38bdf8"
            strokeWidth="2.5"
            rx="8"
          />

          {/* Area label in the center */}
          <text
            x={rectW / 2}
            y={rectH / 2 - 4}
            fill="#facc15"
            fontSize="17"
            fontWeight="900"
            textAnchor="middle"
            fontFamily="Fredoka One, sans-serif"
          >
            Area = {k}
          </text>
          <text
            x={rectW / 2}
            y={rectH / 2 + 16}
            fill="#cbd5e1"
            fontSize="13"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="Nunito, sans-serif"
          >
            ({w} × {h})
          </text>

          {/* Top Width dimension label */}
          <text
            x={rectW / 2}
            y="-8"
            fill="#38bdf8"
            fontSize="14"
            fontWeight="900"
            textAnchor="middle"
            fontFamily="Fredoka One, sans-serif"
          >
            {w} {wLabel} ↔
          </text>

          {/* Left Height dimension label */}
          <text
            x="-10"
            y={rectH / 2}
            fill="#818cf8"
            fontSize="14"
            fontWeight="900"
            textAnchor="end"
            dominantBaseline="middle"
            fontFamily="Fredoka One, sans-serif"
          >
            {h} {hLabel}
          </text>
        </g>
      </svg>
    </div>
  );
}
