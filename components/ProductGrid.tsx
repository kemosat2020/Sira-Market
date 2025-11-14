
import React, { useState, useMemo } from 'react';
import { Product, Variant, Category, AppSettings } from '../types.ts';
import ProductCard from './ProductCard.tsx';
import SearchIcon from './icons/SearchIcon.tsx';
import ProductListItem from './ProductListItem.tsx';
import GridIcon from './icons/GridIcon.tsx';
import ListBulletIcon from './icons/ListBulletIcon.tsx';
import HeartIcon from './icons/HeartIcon.tsx';
import { useTranslation } from '../i18n/index.tsx';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  settings: AppSettings;
  // FIX: Changed `variant?: Variant` to `variant: Variant | undefined` to fix parameter order error.
  onAddToCart: (product: Product, variant: Variant | undefined, element?: HTMLElement) => void;
  onToggleFavorite: (productId: number) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, categories, settings, onAddToCart, onToggleFavorite }) => {
  const { t, locale } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('default');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const getProductPrice = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map(v => product.basePrice + v.priceModifier);
      return Math.min(...prices);
    }
    return product.basePrice;
  };

  const getProductStock = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((acc, v) => acc + v.stock, 0);
    }
    return product.stock;
  };

  const filteredProducts = useMemo(() => {
    const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);

    const filtered = products.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const productName = p.name[locale].toLowerCase();
      const matchesSearch = searchWords.every(word => productName.includes(word));
      const matchesFavorites = !showFavoritesOnly || p.isFavorited;
      return matchesCategory && matchesSearch && matchesFavorites;
    });

    switch (sortBy) {
      case 'name-asc':
        return filtered.sort((a, b) => a.name[locale].localeCompare(b.name[locale], locale === 'ar' ? 'ar' : 'en'));
      case 'name-desc':
        return filtered.sort((a, b) => b.name[locale].localeCompare(a.name[locale], locale === 'ar' ? 'ar' : 'en'));
      case 'price-asc':
        return filtered.sort((a, b) => getProductPrice(a) - getProductPrice(b));
      case 'price-desc':
        return filtered.sort((a, b) => getProductPrice(b) - getProductPrice(a));
      case 'stock-asc':
        return filtered.sort((a, b) => getProductStock(a) - getProductStock(b));
      case 'stock-desc':
        return filtered.sort((a, b) => getProductStock(b) - getProductStock(a));
      case 'default':
      default:
        // Return a stable sort based on original order (or ID)
        return filtered.sort((a, b) => a.id - b.id);
    }
  }, [products, searchTerm, selectedCategory, sortBy, locale, showFavoritesOnly]);
  
  const allCategories = [{key: 'All', name: {[locale]: t('productGrid.all_categories')}}, ...categories];

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col h-full overflow-hidden">
      {/* Top Bar */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center p-4 border-b gap-3">
        <div className="relative w-full sm:w-auto flex-grow">
          <input
            id="product-search-input"
            type="text"
            placeholder={t('productGrid.search_placeholder')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchIcon className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap justify-center sm:justify-end">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="border-gray-300 rounded-lg shadow-sm w-full sm:w-auto flex-grow sm:flex-grow-0"
            aria-label={t('productGrid.all_categories')}
          >
            {allCategories.map(cat => (
              <option key={cat.key} value={cat.key}>
                {cat.name[locale]}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border-gray-300 rounded-lg shadow-sm w-full sm:w-auto flex-grow sm:flex-grow-0"
          >
            <option value="default">{t('productGrid.sort_by_default')}</option>
            <option value="name-asc">{t('productGrid.sort_by_name_asc')}</option>
            <option value="name-desc">{t('productGrid.sort_by_name_desc')}</option>
            <option value="price-asc">{t('productGrid.sort_by_price_asc')}</option>
            <option value="price-desc">{t('productGrid.sort_by_price_desc')}</option>
            <option value="stock-asc">{t('productGrid.sort_by_stock_asc')}</option>
            <option value="stock-desc">{t('productGrid.sort_by_stock_desc')}</option>
          </select>
          <div className="flex items-center border rounded-lg p-1 bg-gray-100">
            <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`p-1 rounded transition-colors ${showFavoritesOnly ? 'bg-red-100 text-red-600' : 'text-gray-500 hover:bg-white'}`}
                aria-label={t('productGrid.show_favorites')}
            >
                <HeartIcon isFavorited={showFavoritesOnly} className="w-5 h-5" />
            </button>
            <button onClick={() => setView('grid')} className={`p-1 rounded ${view === 'grid' ? 'bg-white shadow' : 'text-gray-500'}`}><GridIcon className="w-5 h-5" /></button>
            <button onClick={() => setView('list')} className={`p-1 rounded ${view === 'list' ? 'bg-white shadow' : 'text-gray-500'}`}><ListBulletIcon className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        {/* Product list */}
        <main id="product-grid-scroll-container" className="flex-grow p-4 overflow-y-auto h-full">
          {filteredProducts.length > 0 ? (
            view === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} categories={categories} settings={settings} onAddToCart={onAddToCart} onToggleFavorite={onToggleFavorite} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map(product => (
                  <ProductListItem key={product.id} product={product} categories={categories} settings={settings} onAddToCart={onAddToCart} onToggleFavorite={onToggleFavorite} />
                ))}
              </div>
            )
          ) : (
             <div className="text-center py-16">
                  <SearchIcon className="mx-auto w-12 h-12 text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium text-gray-800">{t('productGrid.no_products_found')}</h3>
                  <p className="mt-1 text-sm text-gray-500">{t('productGrid.no_products_found_desc')}</p>
              </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductGrid;