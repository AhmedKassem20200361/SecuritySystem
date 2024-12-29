/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        minecraft: ['Minecraft', 'sans-serif'],
      },
      backgroundImage:{
        'dirt': "url('./src/img/dirt.jpg')",
        'planks': "url('./src/img/planks.png')",
      },
      backgroundSize:{
        'small': '80px 80px'
      }
    },
  },
  plugins: [],
}