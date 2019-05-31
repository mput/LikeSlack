module.exports = {
  collectCoverageFrom: [
    'server/*/*.{js,jsx}',
    '!**/client/**',
    '!**/bin/**',
    '!**/dist/**',
    '!**/node_modules/**',
    '!**/client/**',
    '!**/postgres-data/**',
    '!**/dist/**',
    '!**/migrations/**',
    '!coverage/**',
    '!gulpfile**',
    '!*config**',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
  modulePathIgnorePatterns: ['__utils__'],
  // testEnvironment: './testEnv.js',
};
