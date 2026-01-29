import { Locale } from '@/i18n/config';

/**
 * Set the locale cookie
 */
export function setLocaleCookie(locale: Locale) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

/**
 * Get the current locale from cookie
 */
export function getLocaleCookie(): Locale | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
  return match ? (match[1] as Locale) : null;
}
