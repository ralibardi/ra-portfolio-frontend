import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testMatch: ['**/*.test.{js,jsx,ts,tsx}'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/?(*.)test.{ts,tsx}',
    '!src/lib/testing/design-system-audit.ts',
    '!src/**/index.ts',
  ],
  moduleNameMapper: {
    '^.+\\.(css|scss|sass)$': 'identity-obj-proxy',
    '^.+\\.(svg|png|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@public/(.*)$': '<rootDir>/public/$1',
    '^@app/(.*)$': '<rootDir>/src/application/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@api/(.*)$': '<rootDir>/src/api/$1',
    '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@lib/testing$': '<rootDir>/src/lib/testing/index.ts',
    '^@lib/testing/(.*)$': '<rootDir>/src/lib/testing/$1',
    '^@lib/components$': '<rootDir>/src/lib/components/index.ts',
    '^@lib/components/(.*)$': '<rootDir>/src/lib/components/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@type/(.*)$': '<rootDir>/src/type/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  maxWorkers: '50%',
  testTimeout: 10000,
};

export default createJestConfig(config);
