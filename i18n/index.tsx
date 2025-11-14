import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ar } from './locales/ar.ts';
import { en } from './locales/en.ts';

export type Locale = 'ar' | 'en';
export type Translations = typeof ar;

interface LanguageContextType {
  locale: Locale;
  changeLanguage: (locale: Locale) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
  translations: Translations;
}

const translations: { [key in Locale]: Translations } = { ar, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('ar');

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = 'ltr'; // Always set direction to LTR to prevent layout shifts
    const titleKey = 'header.title_store';
    document.title = t(titleKey);
  }, [locale]);

  const changeLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  const t = (key: string, options?: { [key: string]: string | number }): string => {
    const keys = key.split('.');
    let result: any = translations[locale];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    let resultString = String(result);

    if (options) {
        Object.keys(options).forEach(optKey => {
            resultString = resultString.replace(`{{${optKey}}}`, String(options[optKey]));
        });
    }

    return resultString;
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage, t, translations: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};