

import React, { useState } from 'react';
import { Product, Variant, Category, AppSettings } from '../types.ts';
import InlineVariantSelector from './InlineVariantSelector.tsx';
import ShoppingBagPlusIcon from './icons/ShoppingBagPlusIcon.tsx';
import XIcon from './icons/XIcon.tsx';
import HeartIcon from './icons/HeartIcon.tsx';
import { useTranslation } from '../i18n/index.tsx';

interface ProductListItemProps {
  product: Product;
  categories: Category[];
  settings: AppSettings;
  // FIX: Changed `variant?: Variant` to `variant: Variant | undefined` to fix parameter order error.
  onAddToCart: (product: Product, variant: Variant | undefined, element?: HTMLElement) => void;
  onToggleFavorite: (productId: number) => void;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product, categories, settings, onAddToCart, onToggleFavorite }) => {
  const { t, locale } = useTranslation();
  const hasVariants = product.variants && product.variants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(hasVariants ? product.variants[0] : undefined);
  const itemRef = React.useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.storeInfo.currency, currencyDisplay: 'symbol' }).format(amount);
  };

  const price = product.basePrice + (selectedVariant?.priceModifier || 0);

  const stock = selectedVariant ? selectedVariant.stock : product.stock;
  const lowStockThreshold = selectedVariant?.lowStockThreshold ?? product.lowStockThreshold;
  const isOutOfStock = stock <= 0;
  const isLowStock = !isOutOfStock && lowStockThreshold !== undefined && stock <= lowStockThreshold;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (itemRef.current) {
      onAddToCart(product, selectedVariant, itemRef.current);
    }
  };
  
  const categoryName = categories.find(c => c.key === product.category)?.name[locale] || product.category;

  const getStockDisplay = () => {
    let textColor = 'text-gray-500';
    if (isOutOfStock) textColor = 'text-red-600 font-semibold';
    if (isLowStock) textColor = 'text-yellow-600 font-semibold';

    return (
      <span className={`text-sm ${textColor}`}>
        {t('productListItem.stock')}: {stock.toLocaleString('en-US')}
      </span>
    );
  };

  return (
    <div ref={itemRef} className="flex items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
      <img src={product.imageUrl} alt={product.name[locale]} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
      <div className="ms-4 flex-grow">
        <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-800">{product.name[locale]}</p>
             <button
                onClick={() => onToggleFavorite(product.id)}
                className="text-gray-400 hover:text-red-500"
                aria-label={t('productCard.toggle_favorite_aria')}
            >
                <HeartIcon isFavorited={!!product.isFavorited} className={`w-5 h-5 ${product.isFavorited ? 'text-red-500' : ''}`} />
            </button>
        </div>
        <div className="flex items-center gap-x-4 gap-y-1 flex-wrap mt-1">
          {hasVariants && selectedVariant ? (
            <InlineVariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
            />
          ) : (
            <p className="text-sm text-gray-500">{categoryName}</p>
          )}
          {getStockDisplay()}
        </div>
      </div>
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <p className="font-bold text-lg text-blue-600 w-24 text-center">{formatCurrency(price)}</p>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="bg-blue-100 text-blue-700 hover:bg-blue-200 p-2 rounded-full transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          aria-label={isOutOfStock ? t('productListItem.out_of_stock_aria') : t('productCard.add_to_cart_aria', {productName: product.name[locale]})}
        >
          {isOutOfStock ? <XIcon className="w-5 h-5"/> : <ShoppingBagPlusIcon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default ProductListItem;