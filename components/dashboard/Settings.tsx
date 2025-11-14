
import React from 'react';
// FIX: Add .ts extension to import path.
import { AppSettings, Product, Order, Employee, Customer, Category } from '../../types.ts';
// FIX: Add .tsx extension to import path.
import ShippingSettings from './ShippingSettings.tsx';
// FIX: Add .tsx extension to import path.
import PaymentSettings from './PaymentSettings.tsx';
// FIX: Add .tsx extension to import path.
import PrinterSettings from './PrinterSettings.tsx';
import StoreSettings from './StoreSettings.tsx';
import BackupAndRestore from './BackupAndRestore.tsx';
import { useTranslation } from '../../i18n/index.tsx';

interface BackupData {
    products: Product[];
    categories: Category[];
    orders: Order[];
    employees: Employee[];
    customers: Customer[];
    settings: AppSettings;
}

interface SettingsProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  products: Product[];
  categories: Category[];
  orders: Order[];
  employees: Employee[];
  customers: Customer[];
  onRestoreBackup: (data: BackupData) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const Settings: React.FC<SettingsProps> = ({ 
    settings, 
    onSettingsChange,
    products,
    categories,
    orders,
    employees,
    customers,
    onRestoreBackup,
    showToast
 }) => {
  const { t } = useTranslation();

  const backupData = { products, categories, orders, employees, customers, settings };

  return (
    <div className="space-y-8">
       <h1 className="text-3xl font-bold text-gray-800">{t('dashboard.settings.store_settings')}</h1>
       <StoreSettings
        settings={settings.storeInfo}
        onChange={(newStoreInfo) => onSettingsChange({ ...settings, storeInfo: newStoreInfo })}
      />
      <ShippingSettings 
        settings={settings.shippingMethods}
        onChange={(newShippingMethods) => onSettingsChange({ ...settings, shippingMethods: newShippingMethods })}
      />
      <PaymentSettings 
        settings={settings.paymentSettings}
        onChange={(newPaymentSettings) => onSettingsChange({ ...settings, paymentSettings: newPaymentSettings })}
      />
      <PrinterSettings
        settings={settings.printerSettings}
        onChange={(newPrinterSettings) => onSettingsChange({ ...settings, printerSettings: newPrinterSettings })}
      />
       <BackupAndRestore 
            backupData={backupData}
            onRestore={onRestoreBackup}
            showToast={showToast}
       />
    </div>
  );
};

export default Settings;
