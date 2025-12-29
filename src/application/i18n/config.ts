export const i18nConfig = {
  defaultLocale: 'en-GB',
  locales: ['en-GB', 'es-ES'] as const,
};

export type AppLocale = (typeof i18nConfig)['locales'][number];
