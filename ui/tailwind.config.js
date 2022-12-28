module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    // TODO: can introduce themes here for backgrounds, icon colors
    extend: {
      height: {
        screen60: "60vh",
        screen65: "65vh",
        screen70: "70vh",
        screen75: "75vh",
        screen80: "80vh",
      },
      colors: {
        blueMain: "#337CA0",
      },
    },
  },
  screens: {},
  variants: {
    extend: {},
    outline: ["focus"],
  },
};
