/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "luxury",      // elegant dark theme
      "cupcake",     // soft pastel theme
      "corporate",   // clean professional blue theme
      "synthwave",   // neon futuristic theme
      "light",       // default light
      "dark",        // default dark
      "dracula",     // purple terminal-style
    ],
    darkTheme: "luxury", // default dark mode theme
  },
}
