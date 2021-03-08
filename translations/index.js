// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')

const files = {}

fs.readdirSync('./translations').forEach((path) => {
  if (path === 'index.js') {
    return
  }

  files[path.split('.')[0]] = require('./' + path)
})

module.exports = files
