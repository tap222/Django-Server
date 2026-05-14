import tailwindcssAnimate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/app.vue',
    './app/plugins/**/*.{js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        /** Marketing hero (reference HTML) */
        display: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        /** Public marketing / LMS landing (Figma) */
        brand: {
          DEFAULT: '#F38B3C',
          foreground: '#FFFFFF'
        },
        public: {
          surface: '#121212',
          muted: '#9CA3AF'
        }
      },
      backgroundImage: {
        'figma-gradient':
          'linear-gradient(180deg, #FFF5EE 0%, #FFFCF8 14rem, #FFFFFF 32rem, #FFFFFF 100%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        heroFloatLeft: {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg) scale(1)' },
          '50%': { transform: 'translateY(-6px) rotate(2deg) scale(1.02)' },
        },
        heroFloatRight: {
          '0%, 100%': { transform: 'translateY(0) rotate(2deg) scale(1)' },
          '50%': { transform: 'translateY(6px) rotate(-2deg) scale(1.02)' },
        },
        /** Hero decorative orbs (reference HTML) */
        heroOrbFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(4deg)' },
        },
        heroFadeUpStrong: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.55s ease-out forwards',
        'hero-float-left': 'heroFloatLeft 7s ease-in-out infinite',
        'hero-float-right': 'heroFloatRight 8.5s ease-in-out infinite',
        'hero-orb': 'heroOrbFloat 4s ease-in-out infinite',
        'hero-fade-up':
          'heroFadeUpStrong 0.65s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [tailwindcssAnimate]
}