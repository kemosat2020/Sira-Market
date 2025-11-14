
import React from 'react';
// FIX: Add .ts extension to import path.
import { CartItem as CartItemType, AppSettings } from '../types.ts';
import CartItem from './CartItem.tsx';
import { useTranslation } from '../i18n/index.tsx';

interface CartProps {
  items: CartItemType[];
  subtotal: number;
  tax: number;
  total: number;
  settings: AppSettings;
  onUpdateQuantity: (cartId: string, newQuantity: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ items, subtotal, tax, total, settings, onUpdateQuantity, onRemoveItem, onClearCart, onCheckout }) => {
  const { t, locale } = useTranslation();
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.storeInfo.currency, currencyDisplay: 'symbol' }).format(amount);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-3">{t('cart.current_order')}</h2>
      
      <div className="flex-grow overflow-y-auto max-h-[40vh] lg:max-h-[45vh]">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-10">{t('cart.empty_cart')}</p>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <CartItem
                key={item.cartId}
                item={item}
                settings={settings}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
              />
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="mt-auto pt-4 border-t">
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>{t('cart.subtotal')}</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('cart.tax')}</span>
              <span className="font-medium">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-800">
              <span>{t('cart.total')}</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
             <button
              onClick={onCheckout}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('cart.checkout')}
            </button>
            <button
              onClick={onClearCart}
              className="w-full bg-gray-200 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {t('cart.clear_cart')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;