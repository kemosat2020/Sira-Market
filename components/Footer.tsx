import React from 'react';
import { useTranslation } from '../i18n/index.tsx';

interface FooterProps {
  onAdminLoginClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminLoginClick }) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-sm text-gray-500 py-3 px-4 border-t flex-shrink-0">
      <div className="container mx-auto flex justify-between items-center">
        <span>{t('footer.copyright', { year: currentYear })}</span>
        <button
          onClick={onAdminLoginClick}
          className="text-gray-600 hover:text-blue-600 font-semibold transition-colors"
        >
          {t('footer.adminLogin')}
        </button>
      </div>
    </footer>
  );
};

export default Footer;