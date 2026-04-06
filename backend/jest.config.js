module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  testMatch: ['**/?(*.)+(spec|test).js'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node', 'ts'],
  transform: {
    '.(ts|tsx)': '@sucrase/jest-plugin',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  verbose: true,
  forceExit: true,
};
