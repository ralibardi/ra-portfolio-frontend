import type { AppDictionary } from './get-dictionary';

export const translate = (dictionary: AppDictionary, key: string): string => {
  const value = key.split('.').reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === 'object' && segment in acc) {
      return (acc as Record<string, unknown>)[segment];
    }
    return undefined;
  }, dictionary);

  if (typeof value === 'string') {
    return value;
  }

  return key;
};
