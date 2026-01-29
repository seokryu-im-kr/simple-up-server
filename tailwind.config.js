const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./templates/**/*.html",
    "./templates/*.html",
    "./static/src/**/*.js",
    ".app.py"
  ],
  theme: {
    extend: {
      colors: {
        slate: colors.slate,
      },
    },
  },
  plugins: [],
}
