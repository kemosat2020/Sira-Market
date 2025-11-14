import React from 'react';
import { useTranslation } from '../i18n/index.tsx';

const LanguageSwitcher: React.FC = () => {
  const { locale, changeLanguage } = useTranslation();

  const handleToggleLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    changeLanguage(newLocale);
  };

  return (
    <button
      onClick={handleToggleLanguage}
      className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-md bg-gray-100 hover:bg-gray-200"
      aria-label={`Switch to ${locale === 'en' ? 'Arabic' : 'English'}`}
    >
      {locale === 'en' ? 'العربية' : 'English'}
    </button>
  );
};

export default LanguageSwitcher;
