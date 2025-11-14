


import React, { useState, useMemo } from 'react';
// FIX: Add .ts extension to import path.
import { Order, OrderStatus, AppSettings } from '../../types.ts';
import SearchIcon from '../icons/SearchIcon.tsx';
import ChevronRightIcon from '../icons/ChevronRightIcon.tsx';
import Modal from '../Modal.tsx';
import PrintIcon from '../icons/PrintIcon.tsx';
import { useTranslation } from '../../i18n/index.tsx';

const getStatusChipClass = (status: OrderStatus) => {
  switch (status) {
    case 'Processing': return 'bg-blue-100 text-blue-800';
    case 'Shipped': return 'bg-yellow-100 text-yellow-800';
    case 'Delivered': return 'bg-green-100 text-green-800';
    case 'Cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const OrderDetailsModal: React.FC<{ order: Order; onClose: () => void; settings: AppSettings }> = ({ order, onClose, settings }) => {
    const { t, locale } = useTranslation();
    const pointsDiscount = (order.pointsRedeemed || 0) * 0.01;
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.storeInfo.currency, currencyDisplay: 'symbol' }).format(amount);
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={t('dashboard.orderManagement.details_title', { orderId: order.id })}>
            <div className="space-y-4">
            <div>
                <h4 className="font-bold">{t('dashboard.orderManagement.customer_info')}</h4>
                <p>{order.shippingInfo.name}</p>
                <p>{order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zip}</p>
            </div>
            <div>
                <h4 className="font-bold">{t('orderTracking.products')}</h4>
                <ul className="list-disc ps-5">
                {order.items.map(item => (
                    <li key={item.cartId}>{item.name[locale]} {item.variant ? `(${item.variant.name[locale]})` : ''} x {item.quantity}</li>
                ))}
                </ul>
            </div>
            <div>
                <h4 className="font-bold">{t('dashboard.orderManagement.payment_summary')}</h4>
                <p>{t('cart.subtotal')}: {formatCurrency(order.subtotal)}</p>
                <p>{t('receipt.shipping')}: {formatCurrency(order.shippingCost)}</p>
                <p>{t('receipt.tax')}: {formatCurrency(order.tax)}</p>
                {pointsDiscount > 0 && (
                  <p className="text-green-600">{t('checkoutModal.points_discount')}: -{formatCurrency(pointsDiscount)}</p>
                )}
                <p className="font-bold">{t('cart.total')}: {formatCurrency(order.total)}</p>
                <div className="text-sm mt-2 pt-2 border-t">
                    <p>{t('orderTracking.points_earned')}: <span className="font-semibold text-yellow-700">+{order.pointsEarned}</span></p>
                    {order.pointsRedeemed && order.pointsRedeemed > 0 && (
                       <p>{t('orderTracking.points_redeemed')}: <span className="font-semibold text-red-700">-{order.pointsRedeemed}</span></p>
                    )}
                </div>
            </div>
            </div>
        </Modal>
    );
};


interface OrderManagementProps {
    orders: Order[];
    onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
    onPrintOrder: (order: Order) => void;
    settings: AppSettings;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ orders, onUpdateStatus, onPrintOrder, settings }) => {
    const { t, locale } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<OrderStatus | 'All'>('All');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
            const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  order.shippingInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesSearch;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [orders, searchTerm, filterStatus]);

    const statuses: (OrderStatus | 'All')[] = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.storeInfo.currency, currencyDisplay: 'symbol' }).format(amount);
    };


    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('dashboard.orderManagement.title')}</h1>
            
            <div className="flex flex-wrap gap-4 mb-4">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder={t('dashboard.orderManagement.search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <SearchIcon className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <select 
                    value={filterStatus} 
                    onChange={e => setFilterStatus(e.target.value as OrderStatus | 'All')}
                    className="border-gray-300 rounded-lg"
                >
                    {statuses.map(s => <option key={s} value={s}>{s === 'All' ? t('dashboard.orderManagement.all_statuses') : t(`receipt.statuses.${s}`)}</option>)}
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-start">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t('dashboard.orderManagement.order_id')}</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t('dashboard.orderManagement.customer')}</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t('dashboard.orderManagement.date')}</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t('dashboard.orderManagement.total')}</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t('dashboard.orderManagement.status')}</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t('dashboard.orderManagement.change_status')}</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t('dashboard.orderManagement.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map(order => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 font-mono text-blue-600">{order.id}</td>
                                <td className="px-6 py-4">{order.shippingInfo.name}</td>
                                <td className="px-6 py-4">{new Date(order.date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}</td>
                                <td className="px-6 py-4 font-semibold">{formatCurrency(order.total)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChipClass(order.status)}`}>
                                        {t(`receipt.statuses.${order.status}`)}
                                    </span>
                                </td>
                                 <td className="px-6 py-4">
                                    <select 
                                        value={order.status}
                                        onChange={e => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                                        className="border-gray-300 rounded-md text-sm p-1"
                                    >
                                        {(statuses.slice(1) as OrderStatus[]).map(s => <option key={s} value={s}>{t(`receipt.statuses.${s}`)}</option>)}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 rtl:space-x-reverse">
                                    <button onClick={() => onPrintOrder(order)} className="text-gray-500 hover:text-blue-600 p-1" title={t('dashboard.orderManagement.print_invoice')}>
                                        <PrintIcon className="w-5 h-5"/>
                                    </button>
                                    <button onClick={() => setSelectedOrder(order)} className="text-gray-500 hover:text-blue-600 p-1" title={t('dashboard.orderManagement.view_details')}>
                                        <ChevronRightIcon className="w-5 h-5"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} settings={settings} />}
        </div>
    );
};

export default OrderManagement;