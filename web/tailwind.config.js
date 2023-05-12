/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        main: "#168c94",
        dark: "#167994",
      },
    },
  },
  plugins: [],
};
