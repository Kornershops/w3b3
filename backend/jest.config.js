module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  // Look for .js tests to bypass broken ts-jest transformer
  testMatch: ['**/?(*.)+(spec|test).js'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  verbose: true,
  forceExit: true,
};
