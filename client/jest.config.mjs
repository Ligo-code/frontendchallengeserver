export default {
    preset: 'ts-jest/presets/js-with-ts-esm',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    transform: {
      '^.+\\.tsx?$': ['ts-jest', {
        tsconfig: './tsconfig.app.json',
        useESM: true,
      }]
    },
    moduleNameMapper: {
      '\\.(css|less|sass|scss)$': 'identity-obj-proxy'
    },
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    testMatch: ['**/*.test.ts', '**/*.test.tsx']
  };