module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        screen60: "60vh",
        screen65: "65vh",
        screen70: "70vh",
        screen75: "75vh",
        screen80: "80vh",
        screen95: "95vh",
      },
      colors: {
        blueMain: "#5296BC",
        timberwolf: "#eaebed",
        font: "#0f172a",
        whiteSmoke: "#F5F6F4",
        raisin: "#212738",
        error: "#F27D7F",
        blackMain: "#222f44",
      },
    },
  },
  screens: {},
  variants: {
    extend: {},
    outline: ["focus"],
  },
};
