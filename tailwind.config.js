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
      },
      spacing: {
        // Secuencia continua de números pares desde el 18 al 100 (N * 4px)
        '18': '4.5rem',   // 72px
        '20': '5rem',     // 80px
        '22': '5.5rem',   // 88px
        '24': '6rem',     // 96px
        '26': '6.5rem',   // 104px
        '28': '7rem',     // 112px
        '30': '7.5rem',   // 120px
        '32': '8rem',     // 128px
        '34': '8.5rem',   // 136px
        '36': '9rem',     // 144px
        '38': '9.5rem',   // 152px
        '40': '10rem',    // 160px
        '42': '10.5rem',  // 168px
        '44': '11rem',    // 176px
        '46': '11.5rem',  // 184px
        '48': '12rem',    // 192px
        '50': '12.5rem',  // 200px
        '52': '13rem',    // 208px
        '54': '13.5rem',  // 216px
        '56': '14rem',    // 224px
        '58': '14.5rem',  // 232px
        '60': '15rem',    // 240px
        '62': '15.5rem',  // 248px
        '64': '16rem',    // 256px
        '66': '16.5rem',  // 264px
        '68': '17rem',    // 272px
        '70': '17.5rem',  // 280px
        '72': '18rem',    // 288px
        '74': '18.5rem',  // 296px
        '76': '19rem',    // 304px
        '78': '19.5rem',  // 312px
        '80': '20rem',    // 320px
        '82': '20.5rem',  // 328px
        '84': '21rem',    // 336px
        '86': '21.5rem',  // 344px
        '88': '22rem',    // 352px
        '90': '22.5rem',  // 360px
        '92': '23rem',    // 368px
        '94': '23.5rem',  // 376px
        '96': '24rem',    // 384px
        '98': '24.5rem',  // 392px
        '100': '25rem',   // 400px
        '120': '30rem',   // 480px
        '140': '35rem',   // 560px
        '160': '40rem',   // 640px
      }
    },
  },
  plugins: [],
}
