module.exports = {
  purge: {
    content: [
      './**/*.html',
      './**/*.vue',
      './**/*.ts'
    ],
    options: {
      safelist: ['.html2canvas']
    }
  },
  darkMode: false,
  theme: {
    colors: {
      transparent: 'transparent',
      green: {
        100: '#f0fff4',
        200: '#c6f6d5',
        300: '#9ae6b4',
        400: '#68d391',
        500: '#48bb78',
        600: '#38a169',
        700: '#2f855a',
        800: '#276749',
        900: '#22543d'
      },
      black: '#000',
      white: '#fff',
      gray: {
        100: '#f7fafc',
        200: '#edf2f7',
        300: '#e2e8f0',
        400: '#cbd5e0',
        500: '#a0aec0',
        600: '#718096',
        700: '#4a5568',
        800: '#2d3748',
        900: '#1a202c'
      },
      yellow: {
        100: '#fffff0',
        200: '#fefcbf',
        300: '#faf089',
        400: '#f6e05e',
        500: '#ecc94b',
        600: '#d69e2e',
        700: '#b7791f',
        800: '#975a16',
        900: '#744210'
      }
    },
    fontFamily: {
      sans: 'var(--display-font)',
      nanum: "'Nanum Gothic', sans-serif;",
      opendyslexic: "'opendyslexic', sans-serif;"
    },
    filter: { // defaults to {}
      none: 'none',
      grayscale: 'grayscale(1)',
      invert: 'invert(1)',
      sepia: 'sepia(1)'
    },
    backdropFilter: { // defaults to {}
      none: 'none',
      blur: 'blur(5px)'
    },
    extend: {
      width: {
        '1/7': '14.2857143%',
        '2/7': '28.5714286%',
        '3/7': '42.8571429%',
        '4/7': '57.1428571%',
        '5/7': '71.4285714%',
        '6/7': '85.7142857%'
      }
    }
  },
  variants: {
    filter: ['responsive'],
    backdropFilter: ['responsive'] // defaults to ['responsive']
  },
  plugins: [
    require('tailwindcss-filters')
  ]
}
