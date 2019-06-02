module.exports = {
  collectCoverageFrom: [
    'server/*/*.{js,jsx}',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
  modulePathIgnorePatterns: ['__utils__'],
  // testEnvironment: './testEnv.js',
};
