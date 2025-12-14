import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import { TextDecoder, TextEncoder } from 'node:util';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import englishTranslation from './public/locales/en-GB/translation.json';

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

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: {
        translation: englishTranslation,
      },
    },
  })
  .catch((_error) => {
    // Silently handle i18n initialization errors in tests
  });
