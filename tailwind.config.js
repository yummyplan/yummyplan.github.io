module.exports = {
  purge: [
    './**/*.html',
    './**/*.vue',
    './**/*.ts'
  ],
  theme: {
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
