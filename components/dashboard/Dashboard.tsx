
import React, { useState } from 'react';
// FIX: Add .ts extension to import path.
import { Product, Order, Employee, AppSettings, OrderStatus, LowStockNotification, Category, Customer } from '../../types.ts';
import DashboardOverview from './DashboardOverview.tsx';
import ProductManagement from './ProductManagement.tsx';
import CategoryManagement from './CategoryManagement.tsx';
import Reports from './Reports.tsx';
import OrderManagement from './OrderManagement.tsx';
import EmployeeManagement from './EmployeeManagement.tsx';
import CustomerManagement from './CustomerManagement.tsx';
// FIX: Add .tsx extension to import path.
import Settings from './Settings.tsx';
import DashboardIcon from '../icons/DashboardIcon.tsx';
import BoxIcon from '../icons/BoxIcon.tsx';
import TagIcon from '../icons/TagIcon.tsx';
import TruckIcon from '../icons/TruckIcon.tsx';
import ChartBarIcon from '../icons/ChartBarIcon.tsx';
import UsersIcon from '../icons/UsersIcon.tsx';
import CogIcon from '../icons/CogIcon.tsx';
import UserGroupIcon from '../icons/UserGroupIcon.tsx';
import { useTranslation } from '../../i18n/index.tsx';

interface BackupData {
    products: Product[];
    categories: Category[];
    orders: Order[];
    employees: Employee[];
    customers: Customer[];
    settings: AppSettings;
}

interface DashboardProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  employees: Employee[];
  customers: Customer[];
  settings: AppSettings;
  onAddProduct: (product: Omit<Product, 'id'> | Product[]) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onBulkStockUpdate: (updates: { productId: number; variantId?: string | number; newStock: number }[]) => void;
  onBulkDeleteProducts: (deletions: { productId: number; variantId?: string | number }[]) => void;
  onAddEmployee: (data: Omit<Employee, 'id'>) => void;
  onUpdateEmployee: (data: Employee) => void;
  onDeleteEmployee: (id: number) => void;
  onSettingsChange: (settings: AppSettings) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onPrintOrder: (order: Order) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  lowStockNotifications: LowStockNotification[];
  onRestoreBackup: (data: BackupData) => void;
}

type DashboardView = 'overview' | 'products' | 'categories' | 'orders' | 'reports' | 'employees' | 'customers' | 'settings';

const Dashboard: React.FC<DashboardProps> = (props) => {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const { t } = useTranslation();

  const navItems = [
    { id: 'overview', label: t('dashboard.nav.overview'), icon: DashboardIcon },
    { id: 'products', label: t('dashboard.nav.products'), icon: BoxIcon },
    { id: 'categories', label: t('dashboard.nav.categories'), icon: TagIcon },
    { id: 'orders', label: t('dashboard.nav.orders'), icon: TruckIcon },
    { id: 'reports', label: t('dashboard.nav.reports'), icon: ChartBarIcon },
    { id: 'customers', label: t('dashboard.nav.customers'), icon: UserGroupIcon },
    { id: 'employees', label: t('dashboard.nav.employees'), icon: UsersIcon },
    { id: 'settings', label: t('dashboard.nav.settings'), icon: CogIcon },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return <DashboardOverview products={props.products} categories={props.categories} orders={props.orders} settings={props.settings} />;
      case 'products':
        return <ProductManagement 
                    products={props.products} 
                    categories={props.categories}
                    settings={props.settings}
                    onAddProduct={props.onAddProduct} 
                    onUpdateProduct={props.onUpdateProduct} 
                    onDeleteProduct={props.onDeleteProduct}
                    onBulkStockUpdate={props.onBulkStockUpdate}
                    onBulkDeleteProducts={props.onBulkDeleteProducts}
                    showToast={props.showToast}
                    lowStockNotifications={props.lowStockNotifications}
                />;
      case 'categories':
        return <CategoryManagement products={props.products} categories={props.categories} settings={props.settings} />;
      case 'orders':
        return <OrderManagement orders={props.orders} onUpdateStatus={props.onUpdateOrderStatus} onPrintOrder={props.onPrintOrder} settings={props.settings} />;
      case 'reports':
        return <Reports products={props.products} categories={props.categories} settings={props.settings} />;
      case 'customers':
        return <CustomerManagement customers={props.customers} orders={props.orders} settings={props.settings} />;
      case 'employees':
        return <EmployeeManagement 
                    employees={props.employees} 
                    settings={props.settings}
                    onAdd={props.onAddEmployee}
                    onUpdate={props.onUpdateEmployee}
                    onDelete={props.onDeleteEmployee}
                />;
      case 'settings':
        return <Settings 
                    settings={props.settings} 
                    onSettingsChange={props.onSettingsChange}
                    products={props.products}
                    categories={props.categories}
                    orders={props.orders}
                    employees={props.employees}
                    customers={props.customers}
                    onRestoreBackup={props.onRestoreBackup}
                    showToast={props.showToast}
                />;
      default:
        return <DashboardOverview products={props.products} categories={props.categories} orders={props.orders} settings={props.settings}/>;
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      <aside className="w-64 bg-white p-4 space-y-2 flex-shrink-0 overflow-y-auto">
        {navItems.map(item => {
           const Icon = item.icon;
           const isProductsTab = item.id === 'products';
           const hasLowStock = props.lowStockNotifications.length > 0;
           return (
            <button
                key={item.id}
                onClick={() => setCurrentView(item.id as DashboardView)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-start font-semibold transition-colors ${
                    currentView === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Icon className="w-6 h-6" />
                    <span>{item.label}</span>
                </div>
                {isProductsTab && hasLowStock && (
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {props.lowStockNotifications.length}
                    </span>
                )}
            </button>
           );
        })}
      </aside>
      <main id="dashboard-scroll-container" className="flex-grow p-6 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
