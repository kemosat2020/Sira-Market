

import React, { useMemo } from 'react';
import { Customer, Order, AppSettings } from '../../types.ts';
import { useTranslation } from '../../i18n/index.tsx';

interface CustomerManagementProps {
  customers: Customer[];
  orders: Order[];
  settings: AppSettings;
}

const CustomerManagement: React.FC<CustomerManagementProps> = ({ customers, orders, settings }) => {
  const { t, locale } = useTranslation();

  const customerStats = useMemo(() => {
    return customers.map(customer => {
      const customerOrders = orders.filter(o => o.customerId === customer.id);
      const lifetimeValue = customerOrders.reduce((sum, order) => sum + order.total, 0);
      return {
        ...customer,
        orderCount: customerOrders.length,
        lifetimeValue,
      };
    }).sort((a, b) => b.lifetimeValue - a.lifetimeValue);
  }, [customers, orders]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.storeInfo.currency, currencyDisplay: 'symbol' }).format(amount);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('dashboard.customerManagement.title')}</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-start">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.customerManagement.name')}</th>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.customerManagement.email')}</th>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.customerManagement.total_orders')}</th>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.customerManagement.loyalty_points')}</th>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.customerManagement.lifetime_value')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customerStats.map(customer => (
              <tr key={customer.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.orderCount.toLocaleString('en-US')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-yellow-700">{customer.loyaltyPoints.toLocaleString('en-US')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">{formatCurrency(customer.lifetimeValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerManagement;