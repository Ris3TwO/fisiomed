import { defaultLang } from "./languages";
import en from "./translations/en.json";
import es from "./translations/es.json";

const translations = {
  en: en,
  es: es,
} as const;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in translations) return lang as keyof typeof translations;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof translations) {
  return function t<T extends string>(key: T): string {
    const keys = key.split(".");
    let value: any = translations[lang];

    // Recorrer el objeto anidado
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        value = translations[defaultLang];
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

// Tipo para TypeScript (opcional pero recomendado)
export type TranslationKey = {
  [K in keyof (typeof translations)[typeof defaultLang]]: (typeof translations)[typeof defaultLang][K] extends object
    ? `${K}.${keyof (typeof translations)[typeof defaultLang][K] & string}`
    : K;
}[keyof (typeof translations)[typeof defaultLang]];
