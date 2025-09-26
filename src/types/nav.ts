import type { LanguageOption } from "./i18n";

export interface NavProps {
  isSubPage?: boolean;
}

export interface LanguageSelectorProps {
  languages?: LanguageOption[];
  currentLang?: string;
  currentPath?: string;
  initialTextColor?: string;
}