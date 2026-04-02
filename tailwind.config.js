/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          DEFAULT: '#1855F5',
          blue: '#1855F5',
        },
        // Secondary/Accent colors
        accent: {
          gold: '#FCB62E',
        },
        // Navy/Dark blue shades
        navy: {
          DEFAULT: '#002855',
          dark: '#162D4C',
        },
        // Neutral colors
        neutral: {
          black: '#000000',
          dark: '#1F1F1F',
          gray: '#60666C',
          white: '#FFFFFF',
        },
        // Semantic colors
        error: '#D20B0B',
        success: '#34B233',
        // Background colors
        surface: {
          light: '#E5F3FDB2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
