/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif']
      },
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63'
        },
        ink: '#0b1220',
        coral: '#ff6b5f',
        gold: '#f5b84b'
      },
      boxShadow: {
        glow: '0 18px 60px -12px rgba(8, 145, 178, 0.45)',
        soft: '0 4px 24px -8px rgba(15, 23, 42, 0.12)',
        clay: '-9px -9px 18px var(--clay-light), 9px 9px 20px var(--clay-shadow)',
        'clay-sm': '-5px -5px 10px var(--clay-light), 5px 5px 12px var(--clay-shadow)',
        'clay-lg': '-12px -12px 28px var(--clay-light), 14px 14px 32px var(--clay-shadow)',
        'clay-inset': 'inset -5px -5px 10px var(--clay-light), inset 5px 5px 12px var(--clay-shadow)',
        'clay-pressed': 'inset -4px -4px 8px var(--clay-light), inset 4px 4px 10px var(--clay-shadow)'
      },
      borderRadius: {
        clay: '28px',
        'clay-sm': '18px',
        'clay-lg': '36px'
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #06b6d4 0%, #0e7490 60%, #4f46e5 100%)'
      }
    }
  },
  plugins: []
};
