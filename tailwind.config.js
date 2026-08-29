/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1B2B4B',
          blue: '#2B7FE0',
          purple: '#7B3FE4',
          teal: '#2EC4B6',
          orange: '#F4A261',
          muted: '#6B7280',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #2B7FE0, #7B3FE4)',
        'gradient-brand-radial':
          'radial-gradient(ellipse at center, rgba(43, 127, 224, 0.08) 0%, rgba(123, 63, 228, 0.05) 50%, transparent 70%)',
      },
      fontFamily: {
        nunito: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
