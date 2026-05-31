/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          900: '#164e63'
        },
        ink: '#101828',
        coral: '#ff6b5f',
        gold: '#f5b84b'
      },
      boxShadow: {
        glow: '0 24px 80px rgba(6, 182, 212, 0.22)'
      }
    }
  },
  plugins: []
};
