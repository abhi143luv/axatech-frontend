/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Primary brand */
        primary: '#123E73',
        'primary-hover': '#0F315C',
        secondary: '#1FB6B6',
        accent: '#3ED2C7',
        /* Info */
        info: {
          lighter: '#CAFDF5',
          light: '#61F3F3',
          DEFAULT: '#00B8D9',
          dark: '#006C9C',
          darker: '#003768',
        },
        /* Success */
        success: {
          lighter: '#D3FCD2',
          light: '#77ED8B',
          DEFAULT: '#22C55E',
          dark: '#118D57',
          darker: '#065E49',
        },
        /* Warning */
        warning: {
          lighter: '#FFF5CC',
          light: '#FFD666',
          DEFAULT: '#FFAB00',
          dark: '#B76E00',
          darker: '#7A4100',
        },
        /* Error */
        error: {
          lighter: '#FFE9D5',
          light: '#FFAC82',
          DEFAULT: '#FF5630',
          dark: '#B71D18',
          darker: '#7A0916',
        },
        /* Neutrals */
        bg: '#F5F7FA',
        text: '#2D3748',
        'text-muted': '#718096',
        border: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Outfit', 'DM Sans', 'system-ui', 'sans-serif'],
        'nunito': ['Nunito Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '10px',
      },
      aspectRatio: {
        '4/3': '4 / 3',
      },
      boxShadow: {
        DEFAULT: '0 2px 12px rgba(18, 62, 115, 0.08)',
        lg: '0 8px 30px rgba(18, 62, 115, 0.12)',
      },
      zIndex: {
        100: '100',
        110: '110',
        1000: '1000',
      },
      container: {
        center: true,
        padding: '1.25rem',
        screens: { default: '1200px' },
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(4px) rotate(1deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-4px) rotate(-1deg)' },
        },
        crater: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(6px)' },
        },
        craterSmall: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-6px)' },
        },
        starTwinkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        glassShine: {
          '0%': { transform: 'translateX(-68px) rotate(0deg)' },
          '20%': { transform: 'translateX(80px) rotate(-30deg)' },
          '100%': { transform: 'translateX(80px) rotate(-30deg)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'home-hero-shine': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'home-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'home-fadeInUp': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'admin-fadeIn': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'admin-slideUp': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'hero-pattern':
          'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 40%)',
      },
      animation: {
        float: 'float 2s ease-in-out infinite',
        floatReverse: 'floatReverse 2s ease-in-out infinite',
        crater: 'crater 2s ease-in-out infinite',
        craterSmall: 'craterSmall 2s ease-in-out infinite',
        starTwinkle: 'starTwinkle 2s ease-in-out infinite',
        glassShine: 'glassShine 10s ease-in-out 2s infinite',
        fadeInUp: 'fadeInUp 0.5s ease-out both',
        fadeInUpSlow: 'fadeInUp 0.6s ease-out both',
        'admin-fadeIn': 'admin-fadeIn 0.2s ease-out',
        'admin-slideUp': 'admin-slideUp 0.25s ease-out',
      },
    },
  },
  plugins: [],
};
