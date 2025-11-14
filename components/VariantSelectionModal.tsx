

import React, { useState } from 'react';
import { Product, Variant, AppSettings } from '../types.ts';
import Modal from './Modal.tsx';
import ShoppingBagPlusIcon from './icons/ShoppingBagPlusIcon.tsx';
import { useTranslation } from '../i18n/index.tsx';

interface VariantSelectionModalProps {
  product: Product;
  settings: AppSettings;
  onClose: () => void;
  onAddToCart: (product: Product, variant: Variant, element?: HTMLElement) => void;
}

const VariantSelectionModal: React.FC<VariantSelectionModalProps> = ({ product, settings, onClose, onAddToCart }) => {
  const { t, locale } = useTranslation();
  const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.storeInfo.currency, currencyDisplay: 'symbol' }).format(amount);
  };
  
  const handleAddToCart = () => {
    onAddToCart(product, selectedVariant);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={t('variantModal.title', {productName: product.name[locale]})}>
      <div className="flex flex-col md:flex-row gap-6">
        <img src={product.imageUrl} alt={product.name[locale]} className="w-full md:w-1/3 h-48 object-cover rounded-lg"/>
        <div className="flex-grow">
          <p className="text-gray-600 mb-4">{product.category}</p>
          <div className="space-y-3">
            {product.variants.map(variant => (
              <div
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer transition-all ${selectedVariant.id === variant.id ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                <span className="font-semibold text-gray-700">{variant.name[locale]}</span>
                <div className="text-right">
                    <span className="font-bold text-gray-800">{formatCurrency(product.basePrice + variant.priceModifier)}</span>
                    {variant.priceModifier !== 0 && (
                       <p className="text-xs text-gray-500">({variant.priceModifier > 0 ? '+' : ''}{formatCurrency(variant.priceModifier)})</p>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <button 
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <ShoppingBagPlusIcon className="w-5 h-5"/>
           {t('variantModal.add_to_cart')} - {formatCurrency(product.basePrice + selectedVariant.priceModifier)}
        </button>
      </div>
    </Modal>
  );
};

export default VariantSelectionModal;