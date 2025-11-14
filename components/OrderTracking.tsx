


import React from 'react';
// FIX: Add .ts extension to import path.
import { Order, OrderStatus, Customer, AppSettings } from '../types.ts';
import TruckIcon from './icons/TruckIcon.tsx';
import BoxIcon from './icons/BoxIcon.tsx';
import { useTranslation } from '../i18n/index.tsx';

interface OrderTrackingProps {
  orders: Order[];
  currentUser: Customer | null;
  settings: AppSettings;
}

const getStatusChipClass = (status: OrderStatus) => {
  switch (status) {
    case 'Processing':
      return 'bg-blue-100 text-blue-800';
    case 'Shipped':
      return 'bg-yellow-100 text-yellow-800';
    case 'Delivered':
      return 'bg-green-100 text-green-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const OrderTracking: React.FC<OrderTrackingProps> = ({ orders, currentUser, settings }) => {
  const { t, locale } = useTranslation();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.storeInfo.currency, currencyDisplay: 'symbol' }).format(amount);
  };

  const displayedOrders = currentUser ? orders.filter(o => o.customerId === currentUser.id) : orders;
  
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('orderTracking.my_orders')}</h1>
      <div className="space-y-6">
        {displayedOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <BoxIcon className="w-16 h-16 mx-auto text-gray-300" />
            <h2 className="mt-4 text-xl font-semibold text-gray-700">{t('orderTracking.no_orders_yet')}</h2>
            <p className="mt-2 text-gray-500">{t('orderTracking.start_shopping')}</p>
          </div>
        ) : (
          displayedOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="font-bold text-gray-800">
                    {t('orderTracking.order_id')} <span className="text-blue-600 font-mono">{order.id}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('orderTracking.order_date')} {new Date(order.date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                  </p>
                </div>
                <div className={`text-sm font-bold px-3 py-1 rounded-full ${getStatusChipClass(order.status)}`}>
                  {t(`receipt.statuses.${order.status}`)}
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <h3 className="font-semibold text-gray-700 mb-3">{t('orderTracking.products')}</h3>
                         <div className="space-y-3">
                            {order.items.map(item => (
                                <div key={item.cartId} className="flex items-center gap-4">
                                    <img src={item.imageUrl} alt={item.name[locale]} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                                    <div className="flex-grow">
                                        <p className="font-semibold text-gray-800">{item.name[locale]} {item.variant && <span className="text-gray-500 font-normal text-sm">- {item.variant.name[locale]}</span>}</p>
                                        <p className="text-sm text-gray-500">{t('orderTracking.quantity')} {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-gray-600">{formatCurrency(item.basePrice * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold text-gray-700 mb-3">{t('orderTracking.order_summary')}</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">{t('cart.subtotal')}:</span>
                                <span className="font-medium text-gray-800">{formatCurrency(order.subtotal)}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-gray-600">{t('receipt.shipping')}:</span>
                                <span className="font-medium text-gray-800">{formatCurrency(order.shippingCost)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">{t('cart.tax')}:</span>
                                <span className="font-medium text-gray-800">{formatCurrency(order.tax)}</span>
                            </div>
                            {order.pointsRedeemed && order.pointsRedeemed > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span className="font-medium">{t('checkoutModal.points_discount')}:</span>
                                    <span className="font-medium">-{formatCurrency(order.pointsRedeemed * 0.01)}</span>
                                </div>
                            )}
                             <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                                <span className="text-gray-800">{t('cart.total')}:</span>
                                <span>{formatCurrency(order.total)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-yellow-700 pt-2 border-t">
                                <span>{t('orderTracking.points_earned')}:</span>
                                <span className="font-semibold">+{order.pointsEarned}</span>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default OrderTracking;