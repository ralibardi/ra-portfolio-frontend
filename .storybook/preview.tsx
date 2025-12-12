import React from 'react';
import { Decorator, Preview } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/app/i18n/config';

import '../src/assets/index.scss';

const withProviders: Decorator = (Story) => (
  <MemoryRouter>
    <I18nextProvider i18n={i18n}>
      <Story />
    </I18nextProvider>
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
  },

  decorators: [withProviders],
  tags: ['autodocs']
};

export default preview;
