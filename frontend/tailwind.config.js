/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F2A1D',
        leaf: { DEFAULT: '#1F7A45', dark: '#155C33', light: '#2E9E5B' },
        lime: '#8CC63F',
        mango: { DEFAULT: '#FFB020', dark: '#E89400' },
        sand: '#FBF7EF',
        shell: '#F3EDE1',
        teal: '#1F7F92',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 18px 40px -24px rgba(15, 42, 29, 0.45)',
        lift: '0 30px 60px -30px rgba(15, 42, 29, 0.55)',
      },
      borderRadius: { xl2: '1.75rem' },
      opacity: { 6: '0.06', 8: '0.08', 12: '0.12', 15: '0.15', 35: '0.35', 92: '0.92' },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spinSlow 18s linear infinite',
      },
    },
  },
  plugins: [],
}
