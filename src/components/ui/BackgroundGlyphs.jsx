import React from 'react';

const GLYPHS = [
  // Exact positions & numbers matching screenshot 1
  { text: '54', top: '9%', left: '8%', size: '20px', delay: '0s' },
  { text: '100', top: '12%', left: '7%', size: '36px', delay: '1s' },
  { text: 'H', top: '38%', left: '4%', size: '32px', delay: '4s' },
  { text: '200', top: '62%', left: '11%', size: '34px', delay: '2s' },

  { text: '91', top: '7%', left: '21%', size: '28px', delay: '3s' },
  { text: '11', top: '9%', left: '24.5%', size: '18px', delay: '1.5s' },
  { text: '66', top: '7.5%', left: '26.5%', size: '24px', delay: '5s' },
  { text: 'T', top: '15%', left: '29%', size: '28px', delay: '3.5s' },

  { text: '90', top: '5%', left: '34%', size: '28px', delay: '0.5s' },
  { text: '64', top: '5%', left: '51%', size: '28px', delay: '6s' },

  { text: '30', top: '7%', right: '34%', size: '24px', delay: '2.5s' },
  { text: '69', top: '5%', right: '31%', size: '18px', delay: '4.5s' },
  { text: '500', top: '9%', right: '23%', size: '38px', delay: '1s' },
  { text: '90', top: '10%', right: '9%', size: '28px', delay: '3s' },

  { text: '347', top: '21%', right: '12%', size: '36px', delay: '5s' },
  { text: '123', top: '48%', right: '7%', size: '28px', delay: '2s' },
  { text: '999', top: '74%', right: '10%', size: '42px', delay: '4s' },

  // Grade 7 Proportional symbols
  { text: 'y = kx', top: '82%', left: '38%', size: '22px', delay: '3s' },
  { text: 'xy = k', top: '30%', left: '46%', size: '22px', delay: '6s' },
];

export default function BackgroundGlyphs() {
  return (
    <div className="floating-bg-container pointer-events-none" aria-hidden="true">
      {GLYPHS.map((g, i) => (
        <span
          key={i}
          className="floating-bg-item pointer-events-none select-none font-display font-black text-white/[0.045] drop-shadow-sm"
          style={{
            top: g.top,
            left: g.left,
            right: g.right,
            fontSize: g.size,
            animationDelay: g.delay,
          }}
        >
          {g.text}
        </span>
      ))}
    </div>
  );
}
