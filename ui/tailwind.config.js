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
        screen95: "95vh",
      },
      colors: {
        blueMain: "#5296BC",
        // blueMain: "#222F44",
        sage: "#BBC7A4",
        timberwolf: "#eaebed",
        ivory: "#F2F5EA",
        wine: "#773344",
        font: "#122313",
        whiteSmoke: "#F5F6F4",
        roseTaupe: "#7F636E",
        raisin: "#212738",
        cambridge: "#8BBEB2",
        fontWhite: "#FFFFFA",
      },
    },
  },
  screens: {},
  variants: {
    extend: {},
    outline: ["focus"],
  },
};
