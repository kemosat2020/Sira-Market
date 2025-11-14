
import React from 'react';
import CartIcon from './icons/CartIcon.tsx';
import BoxIcon from './icons/BoxIcon.tsx';
import TruckIcon from './icons/TruckIcon.tsx';
import UserIcon from './icons/UserIcon.tsx';
import LogoutIcon from './icons/LogoutIcon.tsx';
import GlobeIcon from './icons/GlobeIcon.tsx';
import { useTranslation } from '../i18n/index.tsx';
import LanguageSwitcher from './LanguageSwitcher.tsx';
import { Customer, AppSettings } from '../types.ts';
import StarIcon from './icons/StarIcon.tsx';
import BillIcon from './icons/BillIcon.tsx';

interface HeaderProps {
  cartItemCount: number;
  cartTotal: number;
  settings: AppSettings;
  currentView: 'store' | 'dashboard' | 'tracking' | 'yemen-shipping' | 'bill-payments';
  onNavigate: (view: 'store' | 'dashboard' | 'tracking' | 'yemen-shipping' | 'bill-payments') => void;
  isCartShaking: boolean;
  showIdleReminder: boolean;
  currentUser: Customer | null;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemCount, cartTotal, settings, currentView, onNavigate, isCartShaking, showIdleReminder, currentUser, onLoginClick, onRegisterClick, onLogout }) => {
  const { t, locale } = useTranslation();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.storeInfo.currency, currencyDisplay: 'symbol' }).format(amount);
  };
  
  const getTitle = () => {
    const key = `header.title_${currentView}` as const;
    return t(key);
  };

  const handleCartNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const cartSection = document.getElementById('cart-section');
    if (cartSection) {
      cartSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {settings.storeInfo.logoUrl && (
            <img src={settings.storeInfo.logoUrl} alt={t('header.store_logo_alt')} className="h-10 max-w-[150px] object-contain" />
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-800 leading-tight">{settings.storeInfo.name}</h1>
            <p className="text-sm text-gray-500 leading-tight">{getTitle()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {currentView === 'store' && (
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
              <a href="#cart-section" onClick={handleCartNavigation} aria-label={t('header.view_cart')} className="transition-transform hover:scale-105">
                <div id="cart-icon-target" className={`flex items-center space-x-2 rtl:space-x-reverse text-gray-700 ${isCartShaking ? 'shake' : ''}`}>
                    <div className="relative">
                        <CartIcon className="w-7 h-7" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -end-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        )}
                    </div>
                    <span className="text-lg font-semibold">{formatCurrency(cartTotal)}</span>
                    {showIdleReminder && (
                      <span className="hidden md:inline text-sm text-blue-600 font-semibold animate-pulse-subtle ms-2">
                          {t('header.ready_to_checkout')}
                      </span>
                    )}
                </div>
              </a>
               <button onClick={() => onNavigate('bill-payments')} className="hidden sm:flex items-center text-gray-600 hover:text-blue-600 font-semibold transition-colors">
                  <BillIcon className="w-5 h-5 me-2" />
                  <span>{t('header.pay_bills')}</span>
              </button>
               <button onClick={() => onNavigate('yemen-shipping')} className="hidden sm:flex items-center text-gray-600 hover:text-blue-600 font-semibold transition-colors">
                  <GlobeIcon className="w-5 h-5 me-2" />
                  <span>{t('header.yemen_shipping')}</span>
              </button>
              <button onClick={() => onNavigate('tracking')} className="hidden sm:flex items-center text-gray-600 hover:text-blue-600 font-semibold transition-colors">
                  <TruckIcon className="w-5 h-5 me-2" />
                  <span>{t('header.track_order')}</span>
              </button>
            </div>
          )}
          {currentView !== 'store' && (
            <button onClick={() => onNavigate('store')} className="flex items-center space-x-2 rtl:space-x-reverse bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              <BoxIcon className="w-5 h-5 me-2" />
              <span>{t('header.main_store')}</span>
            </button>
          )}

          <div className="border-s ps-4">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                    <UserIcon className="w-6 h-6 text-gray-600"/>
                    <div>
                        <span className="font-semibold text-gray-800 block">{t('header.welcome')}, {currentUser.name.split(' ')[0]}</span>
                        <div className="flex items-center gap-1 text-yellow-600 font-semibold">
                            <StarIcon className="w-4 h-4 text-yellow-500" />
                            <span>{currentUser.loyaltyPoints.toLocaleString('en-US')} {t('header.points')}</span>
                        </div>
                    </div>
                </div>
                <button onClick={onLogout} className="text-red-600 hover:text-red-800 p-1.5 rounded-full hover:bg-red-50" aria-label={t('header.logout')}>
                    <LogoutIcon className="w-5 h-5"/>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={onLoginClick} className="font-semibold text-gray-600 hover:text-blue-600">{t('header.login')}</button>
                <button onClick={onRegisterClick} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">{t('header.register')}</button>
              </div>
            )}
          </div>
           <div className="border-s ps-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;