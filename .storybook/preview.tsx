import React from 'react';
import { Decorator, Preview } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '../src/contexts/theme-context';
import i18n from '../src/app/i18n/config';

import '../src/assets/index.scss';

/**
 * Storybook decorator that wraps stories with all necessary providers.
 * Includes Router, ThemeProvider, and I18nextProvider for full component functionality.
 */
const withProviders: Decorator = (Story) => (
  <MemoryRouter>
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <Story />
      </I18nextProvider>
    </ThemeProvider>
  </MemoryRouter>
);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    a11y: {
      // Accessibility addon configuration
      element: '#storybook-root',
      config: {},
      options: {},
      manual: false,
    },
  },

  decorators: [withProviders],
  tags: ['autodocs'],
};

export default preview;
