import type { Config } from 'jest';

// Mock environment variables for tests
process.env.VITE_API_BASE_URL = 'http://localhost:3000/mock';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['./setupTests.ts'],
  testMatch: ['**/*.test.{js,jsx,ts,tsx}'],
  transform: {
    '\\.[jt]sx?$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript',
        ],
        plugins: [
          // Transform import.meta.env to process.env
          ['babel-plugin-transform-vite-meta-env'],
        ],
      },
    ],
    '\\.scss$': 'jest-transform-css',
    '\\.(svg|png|jpg|jpeg)$': 'jest-transform-stub',
  },
  collectCoverageFrom: [
    'src/**/*.{js,ts,jsx,tsx}',
    '!**/node_modules/**',
    '!**/*.stories.{js,ts,jsx,tsx}',
    '!**/*.test.{js,ts,jsx,tsx}',
    '!**/tests/**',
    '!**/config/**',
    '!manifestGenerator.ts',
    '!**/types/**',
    '!**/index.ts',
    '!src/service-worker.ts',
    '!src/service-worker-registration.ts',
    '!src/main.tsx',
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@public/(.*)$': '<rootDir>/public/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@routes/(.*)$': '<rootDir>/src/app/routes/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@api/(.*)$': '<rootDir>/src/api/$1',
    '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@tests/(.*)$': '<rootDir>/src/tests/$1',
    '^@type(.*)$': '<rootDir>/src/type/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  transformIgnorePatterns: ['/node_modules/(?!(react-ios-pwa-prompt)/)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  maxWorkers: '50%',
  testTimeout: 10000,
};

export default config;
