import '@testing-library/jest-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import englishTranslation from './public/locales/en/translation.json';

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
  .catch((error) => console.error('i18n error:', error));
