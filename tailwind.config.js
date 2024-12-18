const defaultTheme = require("tailwindcss/defaultTheme");
const COLOR = require("./src/theme/color.js");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ...defaultTheme.colors,
        ...COLOR,
      },
      fontFamily: {
        sans: ["SVN-Gilroy", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        ...defaultTheme.fontSize,
      },
      fontWeight: {
        ...defaultTheme.fontWeight,
      },
      screens: {
        ...defaultTheme.screens,
        mobile: { max: "767px" },
        "none-mobile": {
          min: "768px",
        },
        "break-screen": {
          min: "1078px",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
