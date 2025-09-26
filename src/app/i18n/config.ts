import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(LanguageDetector)
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en-GB',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
    },
    backend: {
      loadPath:
        process.env.NODE_ENV === 'production'
          ? `${window.location.origin}/locales/{{lng}}/{{ns}}.json`
          : '/locales/{{lng}}/{{ns}}.json',
      requestOptions: {
        cache: 'no-store',
      },
    },
    load: 'languageOnly',
  })
  .catch((error) => {
    // Silently handle i18n initialization errors in production
    if (process.env.NODE_ENV === 'development') {
      throw error;
    }
  });

export default i18n;
