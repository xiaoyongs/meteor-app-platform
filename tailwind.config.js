const colors = require("tailwindcss/colors");

module.exports = {
  purge: [
    "./imports/ui/**/*.{js,jsx,ts,tsx}",
    "./client/*.html",
    "./imports/pages/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      display: ["Martel Sans", "sans-serif"],
      body: ["Martel Sans", "sans-serif"],
    },
    extend: {
      spacing: {
        128: "32rem",
        112: "28rem",
        96: "24rem",
        80: "20rem",
        7: "1.875rem",
      },
      fontSize: {
        "4xs": "0.625rem",
        "3xs": "0.6875rem",
        "2xs": "0.75rem",
        xs: "0.8125rem",
      },
      colors: {
        fuchsia: colors.amber,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
};
