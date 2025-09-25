import { DEFAULT_LOCALE, type Locale } from './config';
import en from "./translations/en.json";
import es from "./translations/es.json";

export const translations = {
  en: en,
  es: es,
} as const;

export function useTranslations(lang: Locale) {
  return function t<T extends string>(key: T): string {
    const keys = key.split(".");
    let value: any = translations[lang as keyof typeof translations];

    // Recorrer el objeto anidado
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        value = translations[DEFAULT_LOCALE];
        for (const k of keys) {
          value = value?.[k];
          if (value === undefined) return key;
        }
        return value;
      }
    }

    return value;
  };
}

export type TranslationKey = {
  [K in keyof (typeof translations)[typeof DEFAULT_LOCALE]]: (typeof translations)[typeof DEFAULT_LOCALE][K] extends object
    ? `${K}.${keyof (typeof translations)[typeof DEFAULT_LOCALE][K] & string}`
    : K;
}[keyof (typeof translations)[typeof DEFAULT_LOCALE]];
