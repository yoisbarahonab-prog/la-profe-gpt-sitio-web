/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        profe: {
          purple: '#6B4FBB',
          'purple-dark': '#4A3490',
          'purple-light': '#EDE9FF',
          pink: '#E8607A',
          'pink-dark': '#B5194A',
          'pink-light': '#FFF0F3',
          cream: '#FDF5FF',
          text: '#1E1040',
          muted: '#6B6280',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'Outfit', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
