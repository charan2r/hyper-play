// tailwind.config.js
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        michroma: ['Michroma', ...fontFamily.sans],
      },
    },
  },
  plugins: [],

// tailwind.config.js

  extend: {
    keyframes: {
      carZoom: {
        '0%': { transform: 'translateY(100%) scale(0.3)', opacity: '0' },
        '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
      },
      borderGlow: {
        '0%': { boxShadow: '0 0 0px black' },
        '50%': { boxShadow: '0 0 10px 2px black' },
        '100%': { boxShadow: '0 0 0px black' },
      },
    },
    animation: {
      carZoom: 'carZoom 1s ease-out forwards',
      borderGlow: 'borderGlow 2s ease-in-out infinite',
    },
  },

}
