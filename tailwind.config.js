/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,js,jsx,tsx}'],
  safelist: [
    'sm:grid-cols-1',
    'sm:grid-cols-2',
    'sm:grid-cols-3',
    'sm:grid-cols-4',
    'sm:grid-cols-5',
    'sm:grid-cols-6',
    'sm:grid-cols-7',
    'sm:grid-cols-8',
    'sm:grid-cols-9',
    'sm:grid-cols-10',
    'sm:grid-cols-11',
    'sm:grid-cols-12',
  ],
  theme: {
    extend: {
      colors: {
        logo: '#0353a3',
        'logo-hover': '#2c8dee',
      },
    },
  },
  plugins: [],
};
