

import React, { useRef } from 'react';
import { Product, Variant, Category, AppSettings } from '../types.ts';
import ShoppingBagPlusIcon from './icons/ShoppingBagPlusIcon.tsx';
import HeartIcon from './icons/HeartIcon.tsx';
import { useTranslation } from '../i18n/index.tsx';

interface ProductCardProps {
  product: Product;
  categories: Category[];
  settings: AppSettings;
  onAddToCart: (product: Product, variant: Variant | undefined, element?: HTMLElement) => void;
  onToggleFavorite: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, categories, settings, onAddToCart, onToggleFavorite }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { t, locale } = useTranslation();
  
  const hasVariants = product.variants && product.variants.length > 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.storeInfo.currency, currencyDisplay: 'symbol' }).format(amount);
  };
  
  const getPriceDisplay = () => {
    if (!hasVariants) {
        return formatCurrency(product.basePrice);
    }
    const prices = product.variants.map(v => product.basePrice + v.priceModifier);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    if (minPrice === maxPrice) return formatCurrency(minPrice);
    return `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
  };
  
  const handleAction = (element: HTMLElement) => {
    // If it has variants, onAddToCart will open the modal.
    // If not, it adds directly to cart and triggers animation.
    onAddToCart(product, undefined, element);
  };

  const handleCardClick = () => {
    if (cardRef.current) {
        // For animation, we prefer the image. Let's find it.
        const imageElement = cardRef.current.querySelector('img');
        handleAction(imageElement || cardRef.current);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cardRef.current) {
        const imageElement = cardRef.current.querySelector('img');
        handleAction(imageElement || cardRef.current);
    }
  };
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    onToggleFavorite(product.id);
  };
  
  const categoryName = categories.find(c => c.key === product.category)?.name[locale] || product.category;

  return (
    <div ref={cardRef} onClick={handleCardClick} className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden group transition-shadow hover:shadow-md cursor-pointer">
      <div className="relative">
        <img src={product.imageUrl} alt={product.name[locale]} className="w-full h-32 object-cover" />
         <button
            onClick={handleToggleFavorite}
            className="absolute top-2 end-2 bg-white/70 backdrop-blur-sm p-1.5 rounded-full text-gray-600 hover:text-red-500 transition-colors"
            aria-label={t('productCard.toggle_favorite_aria')}
        >
            <HeartIcon isFavorited={!!product.isFavorited} className={`w-5 h-5 ${product.isFavorited ? 'text-red-500' : ''}`} />
        </button>
      </div>
      <div className="p-3 flex-grow flex flex-col justify-between">
        <div>
            <h3 className="text-sm font-semibold text-gray-800 truncate">{product.name[locale]}</h3>
            <p className="text-xs text-gray-500">{categoryName}</p>
        </div>
        <div className="flex justify-between items-center mt-2">
            <p className="text-md font-bold text-blue-600">{getPriceDisplay()}</p>
            <button
                onClick={handleButtonClick}
                className="bg-blue-100 text-blue-700 hover:bg-blue-200 p-2 rounded-full transition-colors transform group-hover:scale-110"
                aria-label={t('productCard.add_to_cart_aria', {productName: product.name[locale]})}
            >
                <ShoppingBagPlusIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;