export const DEFAULT_LOCALE = "es";

export const LOCALES = ["es", "en"];

export const i18n = {
  defaultLocale: DEFAULT_LOCALE,
  locales: LOCALES,
  routing: {
    prefixDefaultLocale: true,
  },
};

export type Locale = typeof LOCALES[number];