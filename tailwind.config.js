/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          1: 'var(--color-gold)',
          2: 'var(--color-gold-hover)',
          DEFAULT: '#facc15',
          dark: '#eab308',
        },
        brand: {
          purple: '#8b5cf6',
          wonder: '#c084fc',
          story: '#fb923c',
          simulate: '#38bdf8',
          play: '#4ade80',
          reflect: '#818cf8',
        }
      },
      fontFamily: {
        display: ['"Fredoka One"', '"Baloo 2"', 'Nunito', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        glowGold: '0 8px 32px rgba(250, 204, 21, 0.35)',
        glowBlue: '0 0 24px rgba(56, 189, 248, 0.45)',
        glowPurple: '0 0 24px rgba(139, 92, 246, 0.45)',
        glass: '0 16px 48px rgba(0, 0, 0, 0.55)',
      },
      animation: {
        'float-slow': 'floatSlow 22s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'bounce-custom': 'bounceCustom 0.6s infinite alternate',
        'tilt': 'tilt 3s ease-in-out infinite alternate',
        'zoom-pulse': 'zoomPulse 2s ease-in-out infinite alternate',
        'pulse-glow': 'pulseGlow 1.5s ease-in-out infinite alternate',
        'fade-in-up': 'fadeInUp 0.45s ease-out both',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-28px) rotate(8deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        bounceCustom: {
          '0%': { transform: 'translateY(0) scaleY(1)' },
          '100%': { transform: 'translateY(-16px) scaleY(0.95)' },
        },
        tilt: {
          '0%': { transform: 'rotate(-3deg)' },
          '100%': { transform: 'rotate(3deg)' },
        },
        zoomPulse: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
        pulseGlow: {
          '0%': { opacity: '0.6', filter: 'drop-shadow(0 0 2px rgba(250, 204, 21, 0.4))' },
          '100%': { opacity: '1', filter: 'drop-shadow(0 0 10px rgba(250, 204, 21, 0.9))' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
