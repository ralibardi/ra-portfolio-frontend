import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@chromatic-com/storybook',
    '@storybook/addon-docs'
  ],

  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  core: {
    builder: '@storybook/builder-vite',
  },

  viteFinal: async (config) => {
    // Remove PWA plugin for Storybook builds to avoid cache size issues
    if (config.plugins) {
      config.plugins = config.plugins.flat().filter((plugin) => {
        if (plugin && typeof plugin === 'object' && 'name' in plugin) {
          const pluginName = (plugin as { name: string }).name;
          // Filter out all PWA-related plugins
          return !pluginName.toLowerCase().includes('pwa');
        }
        return true;
      });
    }
    return config;
  },
};

export default config;
