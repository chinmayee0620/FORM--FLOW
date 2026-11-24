/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // FormFlow Editorial × Linear Design System Palette
        'ff-dark': '#064E3B',
        'ff-forest': '#0B3D2E',
        'ff-sidebar': '#06392B',
        'ff-green': '#087F5B',
        'ff-teal': '#65BFAF',
        'ff-mint': '#BDE9D4',
        'ff-mint-light': '#E9F8F2',
        'ff-ivory': '#FAF6EF',
        'ff-cream': '#F6EFE4',
        'ff-surface': '#FFFDF9',
        'ff-yellow': '#F6E9B9',
        'ff-peach': '#F5D9C8',
        'ff-coral': '#E99A89',
        'ff-text': '#202720',
        'ff-subtext': '#77776E',
        'ff-border': '#E8DFC8',
        'ff-card': '#FFFFFF',
        brand: {
          50: '#F2FAF6',
          100: '#E2F5ED',
          200: '#BDE9D4',
          300: '#65BFAF',
          400: '#2DB899',
          500: '#087F5B',
          600: '#076C4D',
          700: '#064E3B',
          800: '#0B3D2E',
          900: '#052A1F',
          950: '#021811',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Newsreader', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'editorial': '0 4px 20px -2px rgba(6, 78, 59, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'editorial-hover': '0 10px 30px -4px rgba(6, 78, 59, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
        'modal': '0 20px 50px -12px rgba(6, 78, 59, 0.25)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
