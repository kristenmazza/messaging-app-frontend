module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js, jsx, ts, tsx}'],
  coverageDirectory: 'test-coverage',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTest.ts'],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
};
