/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#e8f0ed",
          100: "#c5d9d0",
          200: "#9ebdb0",
          300: "#74a18e",
          400: "#548b76",
          500: "#34755e",
          600: "#1b4332",
          700: "#163a2b",
          800: "#102f23",
          900: "#081d14",
        },
      },
    },
  },
  plugins: [],
};
