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
      lightGrey: "#3d3d3d",
      darkGrey: "#232626",
      textGray: "#bac3bd",
      mainWhiteBorder: "#e5e7eb",
      whiteHover: "#eaedf9",
      borderGray: "#424242",
      mainGrey: "#333333",
    },
  },
  plugins: [],
};
