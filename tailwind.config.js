/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fffbeb',
          100: '#fff7d6',
          200: '#fff0ad',
          300: '#ffe985',
          400: '#ffe25c',
          500: '#ffdb33',
          600: '#ffd700',
          700: '#e6c200',
          800: '#ccac00',
          900: '#b39600',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#e0fbe9',
          200: '#c1f8d2',
          300: '#a3f5bc',
          400: '#84f2a5',
          500: '#65ef8e',
          600: '#4bd675',
          700: '#31bd5c',
          800: '#17a443',
          900: '#008b2a',
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(255, 219, 51, 0.1), 0 4px 6px -2px rgba(255, 219, 51, 0.05)',
        'glow': '0 0 15px rgba(255, 219, 51, 0.15)',
        'glow-hover': '0 0 20px rgba(255, 219, 51, 0.2)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        }
      },
      screens: {
        'xs': '375px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar'),
  ],
};