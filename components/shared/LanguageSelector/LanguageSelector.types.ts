import { Locale } from '@/i18n/config';

export interface LanguageSelectorProps {
  variant?: 'dropdown' | 'buttons' | 'compact';
  className?: string;
}

export interface LocaleOption {
  value: Locale;
  label: string;
  flag: string;
}
