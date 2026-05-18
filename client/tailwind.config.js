/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <--- THIS LINE IS MISSING OR WRONG. IT MUST BE HERE.
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        sage: {
          50: '#f4f7f5',
          100: '#e3ebe5',
          200: '#c5d8cb',
          300: '#a3c2b0', // Added for better contrast
          500: '#7fa99b',
          600: '#5c8d7b',
          700: '#4a7263', // Added for text contrast
          800: '#39574d', // Added for text contrast
          900: '#2d4a3e',
          950: '#1a2e26', // Added for deep dark mode
        },
        earth: {
          100: '#f5f0e6',
          500: '#8d7b68',
          600: '#705c48',
          900: '#3d2e20',
        }
      }
    },
  },
  plugins: [],
}