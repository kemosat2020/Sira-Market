
import React, { useMemo } from 'react';
// FIX: Add .ts extension to import path.
import { Product, Category, AppSettings } from '../../types.ts';
import BarChart from './BarChart.tsx';
import PieChart from './PieChart.tsx';
import { useTranslation } from '../../i18n/index.tsx';

interface ReportsProps {
  products: Product[];
  categories: Category[];
  settings: AppSettings;
}

const Reports: React.FC<ReportsProps> = ({ products, categories, settings }) => {
  const { t, locale } = useTranslation();
  const { top5ByStockData, top5ByValueData, categoryDistributionData } = useMemo(() => {
    const stats: { [key: string]: { stock: number; value: number } } = {};

    products.forEach(product => {
      if (!stats[product.category]) {
        stats[product.category] = { stock: 0, value: 0 };
      }
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
      stats[product.category].stock += stockForProduct;
      stats[product.category].value += valueForProduct;
    });
    
    const allCategoriesData = Object.entries(stats).map(([key, data]) => {
        const name = categories.find(c => c.key === key)?.name[locale] || key;
        return { name, ...data }
    });

    const sortedByStock = [...allCategoriesData].sort((a, b) => b.stock - a.stock).slice(0, 5);
    const sortedByValue = [...allCategoriesData].sort((a, b) => b.value - a.value).slice(0, 5);

    return {
      top5ByStockData: {
        labels: sortedByStock.map(c => c.name),
        values: sortedByStock.map(c => c.stock)
      },
      top5ByValueData: {
        labels: sortedByValue.map(c => c.name),
        values: sortedByValue.map(c => c.value)
      },
      categoryDistributionData: {
        labels: allCategoriesData.map(c => c.name),
        values: allCategoriesData.map(c => c.stock),
      }
    };
  }, [products, categories, locale]);


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">{t('dashboard.reports.title')}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-700 mb-4">{t('dashboard.reports.top_5_by_stock')}</h2>
           <div className="h-80">
                <BarChart data={top5ByStockData} format="number" currency={settings.storeInfo.currency} />
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-700 mb-4">{t('dashboard.reports.top_5_by_value')}</h2>
           <div className="h-80">
                <BarChart data={top5ByValueData} format="currency" currency={settings.storeInfo.currency} />
           </div>
        </div>
      </div>
       <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-700 mb-4">{t('dashboard.reports.distribution')}</h2>
          <PieChart data={categoryDistributionData} />
        </div>
    </div>
  );
};

export default Reports;