export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

// Language display names
export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
};

// Language flags (emoji)
export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  fr: '🇫🇷',
};
