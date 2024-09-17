/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        gradient: 'gradientAnimation 10s ease infinite',
      },
      keyframes: {
        gradientAnimation: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
      },
      colors: {
        'custom-gray': '#2e0249',
        'custom-pink': '#a91079',
      },
    },
  },
  plugins: [],
};
