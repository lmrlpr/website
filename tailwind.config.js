/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
        gotham: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        merch: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        resto: ['"Playfair Display SC"', '"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          orange: '#FF6B35',
          amber: '#FF9A3C',
        },
        gotham: {
          bg: '#0A0A0F',
          blue: '#00D4FF',
          purple: '#8B5CF6',
          rose: '#F43F5E',
          magenta: '#E11D48',
        },
        ink: '#1A1A1A',
        parchment: '#F8F7F4',
        resto: {
          bg: '#F5F3EF',
          text: '#1B2D52',
          accent: '#2558C9',
          'accent-alt': '#F5C640',
          sky: '#4B89E4',
          surface: '#EBF0FA',
          border: '#C3D1EC',
        },
      },
      boxShadow: {
        neon: '0 0 20px rgba(0,212,255,0.4), 0 0 40px rgba(0,212,255,0.2)',
        'neon-purple': '0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.2)',
        'neon-sm': '0 0 10px rgba(0,212,255,0.3)',
        'neon-strong': '0 0 30px rgba(0,212,255,0.6), 0 0 60px rgba(0,212,255,0.3), 0 0 100px rgba(0,212,255,0.1)',
        'card-glow': '0 0 40px rgba(0,212,255,0.08), 0 20px 60px rgba(0,0,0,0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.5s ease forwards',
        shake: 'shake 0.4s ease',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'scan': 'scan 8s linear infinite',
        'flicker': 'flicker 4s step-end infinite',
        'rain': 'rain 3s linear infinite',
        'glitch': 'glitch 6s step-end infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-8px)' },
          '40%, 80%': { transform: 'translateX(8px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.15' },
          '50%': { opacity: '0.35' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 95%, 100%': { opacity: '1' },
          '96%': { opacity: '0.6' },
          '97%': { opacity: '1' },
          '98%': { opacity: '0.4' },
          '99%': { opacity: '1' },
        },
        rain: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(120vh)', opacity: '0' },
        },
        glitch: {
          '0%, 92%, 100%': { transform: 'translateX(0) skewX(0deg)', opacity: '1' },
          '93%': { transform: 'translateX(-4px) skewX(-2deg)', opacity: '0.9' },
          '94%': { transform: 'translateX(4px) skewX(2deg)', opacity: '0.8' },
          '95%': { transform: 'translateX(-2px) skewX(0deg)', opacity: '1' },
          '96%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
