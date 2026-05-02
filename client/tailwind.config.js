/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        ethara: {
          bg: '#0f111a',
          card: '#1a1d2d',
          input: '#151726',
          border: '#2a2e45',
          primary: '#6b4bff',
          primaryHover: '#5a3ae0',
        }
      }
    },
  },
  plugins: [],
}
