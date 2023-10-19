/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  important: true,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      ...colors,
      mainBlack: "#2b2d42",
      mainBlack2: "#1f1d26",
      mainGray: "#8d99ae",
      mainWhite: "#edf2f4",
      mainLightRed: "#ef233c",
      mainDarkRed: "#c81c22",
    },
  },
  plugins: [],
};
