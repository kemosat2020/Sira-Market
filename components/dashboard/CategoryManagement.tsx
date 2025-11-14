

import React, { useMemo } from 'react';
// FIX: Add .ts extension to import path.
import { Product, Category, AppSettings } from '../../types.ts';
import { useTranslation } from '../../i18n/index.tsx';

interface CategoryManagementProps {
  products: Product[];
  categories: Category[];
  settings: AppSettings;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({ products, categories, settings }) => {
  const { t, locale } = useTranslation();
  const categoryStats = useMemo(() => {
    const stats = new Map<string, { count: number; value: number; stock: number }>();
    
    categories.forEach(cat => {
        stats.set(cat.key, { count: 0, value: 0, stock: 0 });
    });

    products.forEach(product => {
      const currentStat = stats.get(product.category) || { count: 0, value: 0, stock: 0 };
      let stockForProduct = 0;
      let valueForProduct = 0;

      if (product.variants && product.variants.length > 0) {
        product.variants.forEach(v => {
            stockForProduct += v.stock;
            valueForProduct += (product.basePrice + v.priceModifier) * v.stock;
        });
      } else {
        stockForProduct = product.stock;
        valueForProduct = product.basePrice * product.stock;
      }

      stats.set(product.category, {
        count: currentStat.count + 1,
        value: currentStat.value + valueForProduct,
        stock: currentStat.stock + stockForProduct,
      });
    });

    return Array.from(stats.entries()).map(([key, data]) => {
        return {
            name: categories.find(c => c.key === key)?.name[locale] || key,
            ...data
        }
    }).sort((a,b) => b.stock - a.stock);
  }, [products, categories, locale]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.storeInfo.currency, currencyDisplay: 'symbol' }).format(amount);
  };
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('dashboard.categoryManagement.title')}</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-start">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.categoryManagement.category')}</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.categoryManagement.unique_products')}</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.categoryManagement.total_stock')}</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.categoryManagement.inventory_value')}</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {categoryStats.map(({ name, count, value, stock }) => (
                    <tr key={name}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-800">{count.toLocaleString('en-US')}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-800">{stock.toLocaleString('en-US')}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-green-700">{formatCurrency(value)}</span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManagement;