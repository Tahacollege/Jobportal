/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{ejs,js}"],
  theme: {
    extend: {
      width:{
      'w-2':'800px',
      },
      screens:{
        sm:'750px',
      }
    },
  },
  plugins: [],
}

