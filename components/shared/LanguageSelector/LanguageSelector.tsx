'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';
import { setLocaleCookie } from './LanguageSelector.utils';
import { LanguageSelectorProps } from './LanguageSelector.types';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSelector({
  variant = 'dropdown',
  className = '',
}: LanguageSelectorProps) {
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    startTransition(() => {
      setLocaleCookie(newLocale);
      setIsOpen(false);
      // Reload to apply new locale
      window.location.reload();
    });
  };

  if (variant === 'buttons') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {locales.map((l) => (
          <button
            key={l}
            onClick={() => handleLocaleChange(l)}
            disabled={isPending || l === locale}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              l === locale
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            } disabled:opacity-50`}
          >
            <span className="mr-1.5">{localeFlags[l]}</span>
            {localeNames[l]}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Select language"
        >
          <span className="text-lg">{localeFlags[locale]}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => handleLocaleChange(l)}
                disabled={isPending}
                className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                  l === locale
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>{localeFlags[l]}</span>
                <span className="flex-1">{localeNames[l]}</span>
                {l === locale && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
      >
        <Globe className="w-4 h-4 text-gray-500" />
        <span className="text-sm">{localeFlags[locale]}</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {localeNames[locale]}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => handleLocaleChange(l)}
              disabled={isPending}
              className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                l === locale
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="text-lg">{localeFlags[l]}</span>
              <span className="flex-1">{localeNames[l]}</span>
              {l === locale && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
