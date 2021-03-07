module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1'
  },
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '.*\\.(vue)$': 'vue-jest'
  },
  moduleFileExtensions: ['ts', 'js', 'vue', 'json'],

  collectCoverageFrom: [
    'components/**/*.(vue|ts)',
    'layouts/**/*.vue',
    'pages/**/*.vue',
    'lib/**/*.ts',
    'plugins/**/*.ts',
    'store/**/*.ts',
    'model/**/*.ts'
  ],

  transformIgnorePatterns: [
    '/node_modules/.*\\.(?!vue)$'
  ],

  setupFilesAfterEnv: [
    'jest-sinon',
    'jest-localstorage-mock',
    'jest-canvas-mock',
    './tests/setupTests.ts'
  ]
}
