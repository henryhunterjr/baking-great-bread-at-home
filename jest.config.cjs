/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: { module: 'CommonJS', jsx: 'react-jsx', isolatedModules: true },
    }],
  },
  setupFilesAfterEnv: ['<rootDir>/src/lib/ai-services/content-indexing/__tests__/jest.setup.ts'],
  clearMocks: true,
};