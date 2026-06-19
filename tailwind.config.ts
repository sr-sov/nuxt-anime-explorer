import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        // Neutral near-black canvas with a faintly violet cast.
        ink: {
          900: '#0a0a0f',
          800: '#0f0f17',
          700: '#15151f',
          600: '#1c1c2a',
          500: '#262636',
        },
        accent: {
          DEFAULT: '#8b5cf6',
          soft: '#a78bfa',
          ring: '#7c3aed',
        },
      },
      fontFamily: {
        sans: [
          'InterVariable',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.35)',
        glow: '0 0 0 1px rgba(139,92,246,0.35), 0 8px 32px rgba(139,92,246,0.18)',
      },
    },
  },
  plugins: [],
}
