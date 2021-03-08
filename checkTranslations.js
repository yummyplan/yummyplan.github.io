// eslint-disable-next-line @typescript-eslint/no-var-requires
const languages = require('./translations')

const result = {}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const compare = (a, b, keySoFar, nameOfB) => {
  Object.keys(a).forEach((key) => {
    const newKey = keySoFar.length > 0 ? keySoFar + '.' + key : key

    if (typeof b[key] === 'object' && b[key] !== null) {
      compare(a[key], b[key], newKey, nameOfB)
    } else if (typeof a[key] === 'string') {
      if (!result[newKey]) {
        result[newKey] = {}
      }

      if (b[key] === null) {
        result[newKey][nameOfB] = 'Missing'
      } else if (a[key] === b[key]) {
        result[newKey][nameOfB] = 'Untranslated'
      } else {
        result[newKey][nameOfB] = 'Translated'
      }
    }
  })
}

Object.keys(languages).forEach((key) => {
  if (key === 'en') {
    return
  }

  compare(languages.en, languages[key], '', key.toUpperCase())
})

// eslint-disable-next-line no-console
console.table(result)
