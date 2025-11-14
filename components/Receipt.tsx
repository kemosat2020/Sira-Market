

import React from 'react';
// FIX: Add .ts extension to import path.
import { Order, ReceiptSettings, StoreInfo } from '../types.ts';
import Barcode from './Barcode.tsx';
import { useTranslation } from '../i18n/index.tsx';

// FIX: Define the props interface for the Receipt component.
interface ReceiptProps {
  order: Order;
  settings: ReceiptSettings;
  storeInfo: StoreInfo;
}

const Receipt: React.FC<ReceiptProps> = ({ order, settings, storeInfo }) => {
  const { t, locale } = useTranslation();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: storeInfo.currency, currencyDisplay: 'symbol' }).format(amount);
  };

  const getPaymentMethodLabel = (method: Order['paymentMethod']) => {
      // FIX: The translation key is a simple string path. The previous type assertion was incorrect, tried to access a property on the `t` function, and caused type errors.
      const key = `receipt.payment_methods.${method}`;
      return t(key);
  }

  const receiptStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&family=Inconsolata:wght@400;700&display=swap');
    
    body {
      font-family: 'Cairo', 'Inconsolata', monospace;
      margin: 0;
      padding: 10px;
      color: #000;
      background-color: #fff;
    }
    .receipt-container {
      width: 100%;
      max-width: 320px;
      margin: 0 auto;
      font-size: 12px;
      direction: ltr;
    }
    .header {
      text-align: center;
      margin-bottom: 10px;
    }
    .header img {
      max-width: 150px;
      max-height: 75px;
      margin-bottom: 5px;
      margin-left: auto;
      margin-right: auto;
    }
    .header h1 {
      font-family: 'Cairo', sans-serif;
      font-size: 1.5em;
      font-weight: bold;
      margin: 0;
    }
    .header p {
      margin: 2px 0;
      font-size: 0.8em;
    }
    .separator {
      border-top: 1px dashed #000;
      margin: 8px 0;
    }
    .order-info, .customer-info {
      margin-bottom: 8px;
    }
    .order-info p, .customer-info p {
      margin: 2px 0;
      text-align: left;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    thead th {
      text-align: left;
      border-bottom: 1px solid #000;
      padding-bottom: 4px;
      font-weight: bold;
    }
    .item-name {
      text-align: left;
    }
    .item-details {
       font-size: 0.85em;
       color: #555;
    }
    .numeric {
      text-align: right;
    }
    .summary {
      margin-top: 10px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin: 3px 0;
    }
    .total {
      font-weight: bold;
      font-size: 1.1em;
      border-top: 1px solid #000;
      padding-top: 5px;
      margin-top: 5px;
    }
    .footer {
      text-align: center;
      margin-top: 15px;
    }
    .footer p {
      margin: 3px 0;
    }
    .footer img {
      max-width: 100px;
      margin: 10px auto 0;
    }
  `;

  return (
    <>
      <style>{receiptStyles}</style>
      <div className="receipt-container">
        <div className="header">
          {settings.showLogo && storeInfo.logoUrl && <img src={storeInfo.logoUrl} alt="Store Logo" />}
          {settings.showLogo && <h1>{storeInfo.name}</h1>}
          {settings.showStoreAddress && (
            <>
              <p>{storeInfo.address}</p>
            </>
          )}
        </div>
        <div className="separator"></div>
        <div className="order-info">
          <p><strong>{t('receipt.order')}:</strong> {order.id}</p>
          <p><strong>{t('receipt.date')}:</strong> {new Date(order.date).toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')}</p>
          <p><strong>{t('receipt.payment_method')}:</strong> {getPaymentMethodLabel(order.paymentMethod)}</p>
        </div>
        <div className="customer-info">
          <p><strong>{t('receipt.customer')}:</strong> {order.shippingInfo.name}</p>
          <p>{order.shippingInfo.address}, {order.shippingInfo.city}</p>
        </div>
        <div className="separator"></div>
        <table>
          <thead>
            <tr>
              <th>{t('receipt.product')}</th>
              <th className="numeric">{t('receipt.qty')}</th>
              <th className="numeric">{t('receipt.price')}</th>
              <th className="numeric">{t('receipt.total')}</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => {
              const itemPrice = item.basePrice + (item.variant?.priceModifier || 0);
              return (
              <tr key={item.cartId}>
                <td className="item-name">
                  {item.name[locale]}
                  {item.variant && <div className="item-details">{item.variant.name[locale]}</div>}
                </td>
                <td className="numeric">{item.quantity}</td>
                <td className="numeric">{formatCurrency(itemPrice)}</td>
                <td className="numeric">{formatCurrency(itemPrice * item.quantity)}</td>
              </tr>
            )})}
          </tbody>
        </table>
        <div className="separator"></div>
        <div className="summary">
          <div className="summary-row">
            <span>{t('receipt.subtotal')}</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>{t('receipt.shipping')}</span>
            <span>{formatCurrency(order.shippingCost)}</span>
          </div>
          <div className="summary-row">
            <span>{t('receipt.tax')}</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>
          <div className="summary-row total">
            <span>{t('receipt.total')}</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
        <div className="footer">
          <p>{settings.customFooterText}</p>
          {settings.showBarcode && <Barcode text={order.id.replace('ORD-', '')} />}
          {settings.showLogo && storeInfo.logoUrl && <img src={storeInfo.logoUrl} alt="Store Logo" />}
        </div>
      </div>
    </>
  );
};

export default Receipt;