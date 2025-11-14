

import React, { useMemo } from 'react';
// FIX: Add .ts extension to import path.
import { Product, Order, Category, LocalizedString, AppSettings } from '../../types.ts';
import BoxIcon from '../icons/BoxIcon.tsx';
import TagIcon from '../icons/TagIcon.tsx';
import CashIcon from '../icons/CashIcon.tsx';
import ChartBarIcon from '../icons/ChartBarIcon.tsx';
import BarChart from './BarChart.tsx';
import PlusIcon from '../icons/PlusIcon.tsx';
import TruckIcon from '../icons/TruckIcon.tsx';
import StarIcon from '../icons/StarIcon.tsx';
import { useTranslation } from '../../i18n/index.tsx';

interface DashboardOverviewProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  settings: AppSettings;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm flex items-center space-x-4 rtl:space-x-reverse">
    <div className={`rounded-full p-3 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ products, categories, orders, settings }) => {
  const { t, locale } = useTranslation();
    
  const formatCurrency = (amount: number, compact = false) => {
    return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: settings.storeInfo.currency,
        currencyDisplay: 'symbol',
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0,
        ...(compact && { notation: 'compact' })
    }).format(amount);
  };
    
  const { stats, topCategoriesByStock, topSellingProducts } = useMemo(() => {
    let totalStock = 0;
    let inventoryValue = 0;

    products.forEach(p => {
        if (p.variants && p.variants.length > 0) {
            const stockForProduct = p.variants.reduce((acc, v) => {
                inventoryValue += (p.basePrice + v.priceModifier) * v.stock;
                return acc + v.stock;
            }, 0);
            totalStock += stockForProduct;
        } else {
            totalStock += p.stock;
            inventoryValue += p.basePrice * p.stock;
        }
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

    const categoryCounts: { [key: string]: number } = {};
    products.forEach(p => {
        let stockCount = 0;
        if (p.variants && p.variants.length > 0) {
            stockCount = p.variants.reduce((acc, v) => acc + v.stock, 0);
        } else {
            stockCount = p.stock;
        }
        categoryCounts[p.category] = (categoryCounts[p.category] || 0) + stockCount;
    });

    const sortedCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([key, value]) => {
          const catName = categories.find(c => c.key === key)?.name[locale] || key;
          return [catName, value];
      });
      
    const productSales = new Map<number, { name: LocalizedString; quantity: number; imageUrl: string }>();
    orders.forEach(order => {
        order.items.forEach(item => {
            const productId = item.id;
            const existing = productSales.get(productId);
            if (existing) {
                productSales.set(productId, { ...existing, quantity: existing.quantity + item.quantity });
            } else {
                productSales.set(productId, {
                    name: item.name,
                    quantity: item.quantity,
                    imageUrl: item.imageUrl
                });
            }
        });
    });

    const topProducts = Array.from(productSales.values())
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
        
    return {
      stats: {
        totalRevenue: formatCurrency(totalRevenue, true),
        inventoryValue: formatCurrency(inventoryValue, true),
        totalOrders: totalOrders.toLocaleString('en-US'),
        totalStock: totalStock.toLocaleString('en-US'),
      },
      topCategoriesByStock: {
        labels: sortedCategories.map(([label]) => label as string),
        values: sortedCategories.map(([, value]) => value as number),
      },
      topSellingProducts: topProducts,
    };
  }, [products, categories, orders, locale, settings.storeInfo.currency]);

  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">{t('dashboard.overview.title')}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard title={t('dashboard.overview.total_revenue')} value={stats.totalRevenue} icon={<CashIcon className="w-6 h-6 text-green-600" />} color="bg-green-100" />
            <StatCard title={t('dashboard.overview.total_orders')} value={stats.totalOrders} icon={<TruckIcon className="w-6 h-6 text-blue-600" />} color="bg-blue-100" />
            <StatCard title={t('dashboard.overview.inventory_value')} value={stats.inventoryValue} icon={<BoxIcon className="w-6 h-6 text-yellow-600" />} color="bg-yellow-100" />
            <StatCard title={t('dashboard.overview.total_stock')} value={stats.totalStock} icon={<ChartBarIcon className="w-6 h-6 text-purple-600" />} color="bg-purple-100" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-gray-700 mb-4">{t('dashboard.overview.stock_by_category')}</h2>
                <div className="h-80">
                  <BarChart data={topCategoriesByStock} format="number" currency={settings.storeInfo.currency} />
                </div>
            </div>
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                        <StarIcon className="w-6 h-6 me-3 text-yellow-500" />
                        {t('dashboard.overview.top_selling')}
                    </h2>
                    {topSellingProducts.length > 0 ? (
                        <ul className="space-y-4">
                            {topSellingProducts.map((product, index) => (
                                <li key={`${product.name.en}-${index}`} className="flex items-center gap-4">
                                    <img src={product.imageUrl} alt={product.name[locale]} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                                    <div className="flex-grow min-w-0">
                                        <p className="font-semibold text-sm text-gray-800 truncate">{product.name[locale]}</p>
                                    </div>
                                    <p className="text-sm font-bold text-gray-600 flex-shrink-0">
                                        {product.quantity.toLocaleString('en-US')} <span className="text-xs font-normal text-gray-500">{t('dashboard.overview.sales')}</span>
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-10">{t('dashboard.overview.no_sales_data')}</p>
                    )}
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
                   <h2 className="text-xl font-bold text-gray-700 mb-4">{t('dashboard.overview.quick_actions')}</h2>
                   <div className="space-y-4 flex flex-col flex-grow justify-center">
                        <a href="#products-management" className="w-full flex items-center justify-center text-center bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
                            <PlusIcon className="w-5 h-5 me-2" />
                            {t('dashboard.overview.manage_products')}
                        </a>
                         <a href="#orders-management" className="w-full text-center bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300 transition-colors">
                            {t('dashboard.overview.view_orders')}
                        </a>
                   </div>
                </div>
            </div>
        </div>

    </div>
  );
};

export default DashboardOverview;