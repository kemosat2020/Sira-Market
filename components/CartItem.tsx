

import React, { useState, useEffect } from 'react';
// FIX: Add .ts extension to import path.
import { CartItem as CartItemType, AppSettings } from '../types.ts';
import PlusIcon from './icons/PlusIcon.tsx';
import MinusIcon from './icons/MinusIcon.tsx';
import TrashIcon from './icons/TrashIcon.tsx';
import { useTranslation } from '../i18n/index.tsx';

interface CartItemProps {
  item: CartItemType;
  settings: AppSettings;
  onUpdateQuantity: (cartId: string, newQuantity: number) => void;
  onRemoveItem: (cartId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, settings, onUpdateQuantity, onRemoveItem }) => {
  const { t, locale } = useTranslation();
  const [isUpdating, setIsUpdating] = useState(false);
  const itemPrice = item.basePrice + (item.variant?.priceModifier || 0);

  useEffect(() => {
    // Trigger flash animation on quantity change, but not on initial render
    if (item.quantity > 0) {
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 300); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [item.quantity]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.storeInfo.currency, currencyDisplay: 'symbol' }).format(amount);
  };
  
  return (
    <div className={`flex items-center justify-between p-2 rounded-lg transition-colors duration-300 ${isUpdating ? 'bg-blue-100' : 'bg-gray-50'}`}>
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <img src={item.imageUrl} alt={item.name[locale]} className="w-12 h-12 object-cover rounded-md" />
        <div>
          <p className="font-semibold text-sm text-gray-800">
            {item.name[locale]} {item.variant && <span className="text-gray-500 font-normal">- {item.variant.name[locale]}</span>}
          </p>
          <p className="text-xs text-gray-500">{formatCurrency(itemPrice)}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <div className="flex items-center border rounded-md bg-white">
          <button
            onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
            className="p-1 text-gray-600 hover:bg-gray-200 rounded-s-md"
            aria-label={t('cartItem.decrease_quantity')}
          >
            <MinusIcon className="w-4 h-4" />
          </button>
          <span className="px-3 text-sm font-medium" aria-live="polite">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
            className="p-1 text-gray-600 hover:bg-gray-200 rounded-e-md"
            aria-label={t('cartItem.increase_quantity')}
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
         <button onClick={() => onRemoveItem(item.cartId)} className="p-1.5 text-red-500 hover:bg-red-100 rounded-full" aria-label={t('cartItem.remove_item_aria', {itemName: item.name[locale]})}>
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;