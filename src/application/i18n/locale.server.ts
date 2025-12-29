import { cookies, headers } from 'next/headers';
import { type AppLocale, i18nConfig } from './config';

const SUPPORTED = new Set<AppLocale>(i18nConfig.locales);

const normalizeLocale = (value?: string | null): AppLocale | null => {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  if (SUPPORTED.has(normalized as AppLocale)) {
    return normalized as AppLocale;
  }

  // Try matching language without region (e.g. en -> en-GB)
  const base = normalized.split('-')[0];
  const fallback = i18nConfig.locales.find((locale) => locale.startsWith(base));
  return fallback ?? null;
};

export const resolveRequestLocale = (): AppLocale => {
  const cookieLocale = normalizeLocale(cookies().get('NEXT_LOCALE')?.value);
  if (cookieLocale) {
    return cookieLocale;
  }

  const acceptLanguage = headers().get('accept-language');
  if (acceptLanguage) {
    const preferred = acceptLanguage
      .split(',')
      .map((section) => section.split(';')[0])
      .map((section) => normalizeLocale(section))
      .find((locale): locale is AppLocale => Boolean(locale));

    if (preferred) {
      return preferred;
    }
  }

  return i18nConfig.defaultLocale;
};
