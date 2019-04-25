module.exports = {
  collectCoverageFrom: [
    'server/*.{js,jsx}',
    '!**/client/**',
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
};
