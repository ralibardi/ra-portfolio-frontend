import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import { TextDecoder, TextEncoder } from 'node:util';
import React from 'react';

// Polyfill TextEncoder and TextDecoder for Jest environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Force NODE_ENV to be 'test' during tests
process.env.NODE_ENV = 'test';

// Mock window.matchMedia which is not implemented in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Next.js Image component for Jest environment
jest.mock('next/image', () => ({
  // biome-ignore lint/style/useNamingConvention: __esModule is a standard Jest/TypeScript property for ES modules
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => React.createElement('img', props),
}));
