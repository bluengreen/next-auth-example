const colors = require('tailwindcss/colors')

module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
  theme: {
    extend: {
      colors: {
        sky: colors.sky,
        teal: colors.teal,
        orange: colors.orange,
        'blue-gray': colors.slate,
        'warm-gray': colors.stone,
        cyan: colors.cyan,
        rose: colors.rose,
        grape: colors.purple,
      }
    }
  },
};
