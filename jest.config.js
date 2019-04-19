module.exports = {
  collectCoverageFrom: [
    '**/server/*.{js,jsx}',
    '!**/client/**',
    '!**/node_modules/**',
    '!**/client/**',
    '!**/postgres-data/**',
    '!**/dist/**',
    '!**/migrations/**',
    '!coverage/**',
    '!gulpfile**',
    '!*config**',
  ],
};
