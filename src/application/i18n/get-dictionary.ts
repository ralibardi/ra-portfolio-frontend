import type enDictionary from '@public/locales/en-GB/translation.json';
import type { AppLocale } from './config';

export type AppDictionary = typeof enDictionary;

const dictionaries: Record<AppLocale, () => Promise<AppDictionary>> = {
  'en-GB': () => import('@public/locales/en-GB/translation.json').then((module) => module.default),
  'es-ES': () => import('@public/locales/es-ES/translation.json').then((module) => module.default),
};

export async function getDictionary(locale: AppLocale): Promise<AppDictionary> {
  const loader = dictionaries[locale] ?? dictionaries['en-GB'];
  return loader();
}
