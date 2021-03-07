import de from './translations/de'
import en from './translations/en'

const result = {}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const compare = (a, b, keySoFar, nameOfB) => {
  Object.keys(a).forEach((key) => {
    const newKey = keySoFar.length > 0 ? keySoFar + '.' + key : key

    if (typeof b[key] === 'object' && b[key] !== null) {
      compare(a[key], b[key], newKey, nameOfB)
    } else if (typeof a[key] === 'string') {
      result[newKey] = {}

      if (b[key] === null) {
        result[newKey]['Comparison source (en)'] = '-'
        result[newKey][nameOfB] = 'Missing'
      } else if (a[key] === b[key]) {
        result[newKey]['Comparison source (en)'] = '-'
        result[newKey][nameOfB] = 'Untranslated'
      } else {
        result[newKey]['Comparison source (en)'] = '-'
        result[newKey][nameOfB] = 'Translated'
      }
    }
  })
}

compare(en, de, '', 'DE')

// eslint-disable-next-line no-console
console.table(result)
