

import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header.tsx';
import ProductGrid from './components/ProductGrid.tsx';
import Cart from './components/Cart.tsx';
import VariantSelectionModal from './components/VariantSelectionModal.tsx';
import CheckoutModal from './components/CheckoutModal.tsx';
import Toast from './components/Toast.tsx';
import FlyingProductAnimation from './components/FlyingProductAnimation.tsx';
import Dashboard from './components/dashboard/Dashboard.tsx';
import OrderTracking from './components/OrderTracking.tsx';
import PrintPreviewModal from './components/PrintPreviewModal.tsx';
import ScrollButtons from './components/ScrollButtons.tsx';
import LoginModal from './components/LoginModal.tsx';
import RegisterModal from './components/RegisterModal.tsx';
import DashboardLoginModal from './components/DashboardLoginModal.tsx';
import Footer from './components/Footer.tsx';
import YemenShipping, { YemenShippingInfo } from './components/YemenShipping.tsx';
import BillPayments from './components/BillPayments.tsx';
import { useTranslation } from './i18n/index.tsx';

import { Product, Variant, CartItem, AppSettings, Order, OrderStatus, ShippingInfo, Employee, OrderPaymentMethod, LowStockNotification, Category, Customer } from './types.ts';
import { INITIAL_PRODUCTS, CATEGORIES, INITIAL_SETTINGS, INITIAL_ORDERS, INITIAL_EMPLOYEES, INITIAL_CUSTOMERS, ADMIN_USER } from './constants.ts';

interface BackupData {
    products: Product[];
    categories: Category[];
    orders: Order[];
    employees: Employee[];
    customers: Customer[];
    settings: AppSettings;
}


const App: React.FC = () => {
    const { t, locale } = useTranslation();
    // State
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [categories] = useState<Category[]>(CATEGORIES);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
    const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
    const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
    const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
    const [currentUser, setCurrentUser] = useState<Customer | null>(null);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    
    const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
    const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
    const [isDashboardLoginModalOpen, setDashboardLoginModalOpen] = useState(false);
    
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; show: boolean }>({ message: '', type: 'success', show: false });
    
    const [flyingProduct, setFlyingProduct] = useState<{ imageUrl: string; startRect: DOMRect } | null>(null);
    const [isCartShaking, setIsCartShaking] = useState(false);

    const [currentView, setCurrentView] = useState<'store' | 'dashboard' | 'tracking' | 'yemen-shipping' | 'bill-payments'>('store');
    
    const [orderToPrint, setOrderToPrint] = useState<Order | null>(null);

    const [showIdleReminder, setShowIdleReminder] = useState(false);
    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    const [lowStockNotifications, setLowStockNotifications] = useState<LowStockNotification[]>([]);

    const [scrollContainerId, setScrollContainerId] = useState('main-scroll-container');


    // Computed Values
    const cartSubtotal = cart.reduce((acc, item) => acc + (item.basePrice + (item.variant?.priceModifier || 0)) * item.quantity, 0);
    const cartTax = cartSubtotal * settings.taxRate;
    const cartTotal = cartSubtotal + cartTax;
    const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    // Low Stock Check Logic
    const checkLowStock = (currentProducts: Product[]) => {
        const notifications: LowStockNotification[] = [];
        currentProducts.forEach(p => {
            if (p.variants && p.variants.length > 0) {
                p.variants.forEach(v => {
                    if (typeof v.lowStockThreshold !== 'undefined' && v.stock > 0 && v.stock <= v.lowStockThreshold) {
                        notifications.push({
                            uniqueId: `variant-${p.id}-${v.id}`,
                            productId: p.id,
                            variantId: v.id,
                            productName: p.name,
                            variantName: v.name,
                            remainingStock: v.stock,
                            threshold: v.lowStockThreshold,
                        });
                    }
                });
            } else {
                if (typeof p.lowStockThreshold !== 'undefined' && p.stock > 0 && p.stock <= p.lowStockThreshold) {
                    notifications.push({
                        uniqueId: `product-${p.id}`,
                        productId: p.id,
                        productName: p.name,
                        remainingStock: p.stock,
                        threshold: p.lowStockThreshold,
                    });
                }
            }
        });
        setLowStockNotifications(notifications);
    };

    // Effects
    useEffect(() => {
        const titleKey = `header.title_${currentView}` as const;
        document.title = t(titleKey);
    }, [currentView, t]);

    useEffect(() => {
    const handleResize = () => {
      const isLargeScreen = window.innerWidth >= 1024;
      if (currentView === 'store' && isLargeScreen) {
        setScrollContainerId('product-grid-scroll-container');
      } else if (currentView === 'dashboard') {
        setScrollContainerId('dashboard-scroll-container');
      } else {
        setScrollContainerId('main-scroll-container');
      }
    };
    handleResize(); // Set initial ID
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentView]);

    
    useEffect(() => {
        // Reset idle timer whenever cart changes
        if (cart.length > 0) {
            if (idleTimer.current) clearTimeout(idleTimer.current);
            setShowIdleReminder(false);
            idleTimer.current = setTimeout(() => {
                setShowIdleReminder(true);
            }, 10000); // 10 seconds
        } else {
            if (idleTimer.current) clearTimeout(idleTimer.current);
            setShowIdleReminder(false);
        }
        return () => {
            if (idleTimer.current) clearTimeout(idleTimer.current);
        };
    }, [cart]);
    
    // Initial low stock check on app load
    useEffect(() => {
        checkLowStock(products);
    }, []);

    // Keyboard shortcuts effect
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.altKey || event.metaKey) { // Use Alt or Cmd as modifier
                switch (event.key.toLowerCase()) {
                    case 'c':
                        if (currentView === 'store' && cart.length > 0) {
                            event.preventDefault();
                            setCheckoutModalOpen(true);
                        }
                        break;
                    case 'd':
                        event.preventDefault();
                        handleNavigation('dashboard');
                        break;
                    case 's':
                        event.preventDefault();
                        handleNavigation('store');
                        break;
                    case 't':
                        event.preventDefault();
                        handleNavigation('tracking');
                        break;
                    case 'f':
                         if (currentView === 'store') {
                            event.preventDefault();
                            document.getElementById('product-search-input')?.focus();
                        }
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentView, cart.length, isAdminLoggedIn]);

    // Handlers
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type, show: true });
    };
    
    const handleNavigation = (view: 'store' | 'dashboard' | 'tracking' | 'yemen-shipping' | 'bill-payments') => {
        if (view === 'dashboard' && !isAdminLoggedIn) {
            setDashboardLoginModalOpen(true);
        } else {
            setCurrentView(view);
        }
    };

    const handleAddToCart = (product: Product, variant: Variant | undefined, element?: HTMLElement) => {
        if (product.variants && product.variants.length > 0 && !variant) {
            setSelectedProductForModal(product);
            return;
        }

        if (element) {
            const startRect = element.getBoundingClientRect();
            setFlyingProduct({ imageUrl: product.imageUrl, startRect });
        } else {
            // Fallback for when there's no element to animate from, e.g., variant modal
            setIsCartShaking(true);
            setTimeout(() => setIsCartShaking(false), 500);
        }
        
        const cartId = variant ? `${product.id}-${variant.id}` : `${product.id}`;
        const existingItem = cart.find(item => item.cartId === cartId);

        if (existingItem) {
            setCart(cart.map(item => item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            const newItem: CartItem = {
                ...product,
                cartId,
                quantity: 1,
                variant,
            };
            setCart([...cart, newItem]);
        }
        setSelectedProductForModal(null);
    };

    const handleToggleFavorite = (productId: number) => {
        setProducts(prevProducts =>
            prevProducts.map(p =>
                p.id === productId ? { ...p, isFavorited: !p.isFavorited } : p
            )
        );
    };

    const handleUpdateQuantity = (cartId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            handleRemoveItem(cartId);
        } else {
            setCart(cart.map(item => item.cartId === cartId ? { ...item, quantity: newQuantity } : item));
        }
    };

    const handleRemoveItem = (cartId: string) => {
        setCart(cart.filter(item => item.cartId !== cartId));
    };

    const handleClearCart = () => setCart([]);

    const handlePlaceOrder = (shippingInfo: ShippingInfo, shippingCost: number, paymentMethod: OrderPaymentMethod, pointsToRedeem: number) => {
        const pointsDiscount = pointsToRedeem * settings.loyaltySettings.dollarsPerPoint;
        const totalAfterDiscount = cartSubtotal + cartTax + shippingCost - pointsDiscount;

        const pointsEarned = Math.floor(totalAfterDiscount * settings.loyaltySettings.pointsPerDollar);

        const newOrder: Order = {
            id: `ORD-${Date.now()}`,
            date: new Date(),
            items: cart,
            subtotal: cartSubtotal,
            tax: cartTax,
            shippingCost,
            total: totalAfterDiscount,
            status: 'Processing',
            shippingInfo,
            paymentMethod,
            customerId: currentUser?.id,
            pointsEarned,
            pointsRedeemed: pointsToRedeem > 0 ? pointsToRedeem : undefined,
        };

        if (currentUser) {
            const updatedPoints = currentUser.loyaltyPoints - pointsToRedeem + pointsEarned;
            const updatedUser = { ...currentUser, shippingInfo, loyaltyPoints: updatedPoints };
            setCurrentUser(updatedUser);
            setCustomers(customers.map(c => c.id === updatedUser.id ? updatedUser : c));
        }
        
        // BUG FIX: Decrement stock levels immutably
        const updatedProducts: Product[] = JSON.parse(JSON.stringify(products));
        cart.forEach(cartItem => {
            const product = updatedProducts.find(p => p.id === cartItem.id);
            if (product) {
                if (cartItem.variant) {
                    const variant = product.variants.find((v: Variant) => v.id === cartItem.variant!.id);
                    if (variant) {
                        variant.stock -= cartItem.quantity;
                    }
                } else {
                    product.stock -= cartItem.quantity;
                }
            }
        });

        setProducts(updatedProducts);
        checkLowStock(updatedProducts);
        
        setOrders(prev => [newOrder, ...prev]);
        setCheckoutModalOpen(false);
        setCart([]);
        showToast(t('toasts.orderPlaced'), 'success');
        if (settings.printerSettings.autoPrint) {
            handlePrintOrder(newOrder);
        }
    };
    
    const handlePrintOrder = (order: Order) => {
        setOrderToPrint(order);
    };

    const handleLogin = (email: string, pass: string): boolean => {
        const customer = customers.find(c => c.email.toLowerCase() === email.toLowerCase() && c.passwordHash === pass);
        if (customer) {
            setCurrentUser(customer);
            setLoginModalOpen(false);
            showToast(t('toasts.loginSuccess'));
            return true;
        }
        showToast(t('toasts.loginFailure'), 'error');
        return false;
    };
    
    const handleRegister = (name: string, email: string, pass: string): boolean => {
        if (customers.some(c => c.email.toLowerCase() === email.toLowerCase())) {
            showToast(t('toasts.emailExists'), 'error');
            return false;
        }
        const newCustomer: Customer = {
            id: Date.now(),
            name,
            email,
            passwordHash: pass,
            loyaltyPoints: 0, // Start with 0 points
        };
        setCustomers(prev => [...prev, newCustomer]);
        setCurrentUser(newCustomer);
        setRegisterModalOpen(false);
        showToast(t('toasts.registerSuccess'));
        return true;
    };
    
    const handleLogout = () => {
        setCurrentUser(null);
        showToast(t('toasts.logoutSuccess'));
    };

    const handleAdminLogin = (username: string, pass: string): boolean => {
        if (username === ADMIN_USER.username && pass === ADMIN_USER.password) {
            setIsAdminLoggedIn(true);
            setDashboardLoginModalOpen(false);
            setCurrentView('dashboard');
            return true;
        }
        return false;
    };

    const handleYemenShippingSubmit = (data: YemenShippingInfo) => {
        console.log("Yemen Shipping Info:", data); // In a real app, this would be saved or used.
        showToast(t('toasts.yemenInfoSaved'), 'success');
        setCurrentView('store');
    };

    const handleRestoreBackup = (data: BackupData) => {
        try {
            // Basic validation
            if (!data.products || !Array.isArray(data.products) || !data.settings) {
                throw new Error("Invalid backup data structure.");
            }

            setProducts(data.products);
            checkLowStock(data.products);

            if (data.orders && Array.isArray(data.orders)) {
                const restoredOrders = data.orders.map((o: any) => ({ ...o, date: new Date(o.date) }));
                setOrders(restoredOrders);
            }
            if (data.employees && Array.isArray(data.employees)) {
                const restoredEmployees = data.employees.map((e: any) => ({ ...e, startDate: new Date(e.startDate) }));
                setEmployees(restoredEmployees);
            }
            if (data.settings) {
                setSettings(data.settings);
            }
            if (data.customers && Array.isArray(data.customers)) {
                setCustomers(data.customers);
            }
            
            // Reset session-specific state
            setCurrentUser(null);
            setCart([]);
            
            showToast(t('toasts.restoreSuccess'), 'success');
        } catch (error) {
            console.error("Failed to apply backup:", error);
            showToast(t('toasts.restoreError'), 'error');
        }
    };


    // Dashboard Handlers
    const handleAddProduct = (productData: Omit<Product, 'id'> | Product[]) => {
       if (Array.isArray(productData)) {
            setProducts(prev => [...prev, ...productData]);
        } else {
            const singleProductData = productData as Omit<Product, 'id'>;
            const newProduct: Product = {
                ...singleProductData,
                id: Date.now(),
                // ImageURL is now part of the data from the form. Fallback if not provided.
                imageUrl: singleProductData.imageUrl || `https://picsum.photos/seed/${Date.now()}/400`,
            };
            setProducts(prev => [...prev, newProduct]);
        }
    };
    
    const handleUpdateProduct = (updatedProduct: Product) => {
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const handleDeleteProduct = (productId: number) => {
        setProducts(products.filter(p => p.id !== productId));
    };

    const handleBulkStockUpdate = (updates: { productId: number; variantId?: string | number; newStock: number }[]) => {
        setProducts(prevProducts => {
            // Use deep clone to ensure immutability for nested variants
            const newProducts: Product[] = JSON.parse(JSON.stringify(prevProducts));
            updates.forEach(update => {
                const product = newProducts.find(p => p.id === update.productId);
                if (product) {
                    if (update.variantId) {
                        const variant = product.variants.find((v: Variant) => v.id === update.variantId);
                        if (variant) {
                            variant.stock = update.newStock;
                        }
                    } else {
                        product.stock = update.newStock;
                    }
                }
            });
            checkLowStock(newProducts);
            return newProducts;
        });
        showToast(t('toasts.stockUpdated'));
    };

    const handleBulkDeleteProducts = (deletions: { productId: number; variantId?: string | number }[]) => {
         const newProducts: Product[] = JSON.parse(JSON.stringify(products));
         const productIdsToDeleteCompletely = new Set<number>();
         
         deletions.forEach(del => {
             if (del.variantId) {
                 const product = newProducts.find(p => p.id === del.productId);
                 if (product) {
                     product.variants = product.variants.filter(v => v.id !== del.variantId);
                 }
             } else {
                 productIdsToDeleteCompletely.add(del.productId);
             }
         });
         
         const finalProducts = newProducts.filter(p => !productIdsToDeleteCompletely.has(p.id));
         setProducts(finalProducts);
         showToast(t('toasts.itemsDeleted'));
    };


    const handleAddEmployee = (data: Omit<Employee, 'id'>) => {
        const newEmployee = { ...data, id: Date.now() };
        setEmployees(prev => [...prev, newEmployee]);
    };

    const handleUpdateEmployee = (data: Employee) => {
        setEmployees(employees.map(e => e.id === data.id ? data : e));
    };

    const handleDeleteEmployee = (id: number) => {
        setEmployees(employees.filter(e => e.id !== id));
    };

    const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };


    return (
        <div className="h-screen bg-gray-100 flex flex-col font-cairo">
            <Header
                cartItemCount={cartItemCount}
                cartTotal={cartTotal}
                settings={settings}
                currentView={currentView}
                onNavigate={handleNavigation}
                isCartShaking={isCartShaking}
                showIdleReminder={showIdleReminder}
                currentUser={currentUser}
                onLoginClick={() => setLoginModalOpen(true)}
                onRegisterClick={() => setRegisterModalOpen(true)}
                onLogout={handleLogout}
            />
            <main id="main-scroll-container" className="flex-grow p-4 overflow-y-auto lg:overflow-hidden">
                {currentView === 'store' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:h-full">
                        <div className="lg:col-span-2 lg:h-full">
                            <ProductGrid
                                products={products}
                                categories={categories}
                                settings={settings}
                                onAddToCart={handleAddToCart}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        </div>
                        <div id="cart-section" className="lg:h-full">
                            <Cart
                                items={cart}
                                subtotal={cartSubtotal}
                                tax={cartTax}
                                total={cartTotal}
                                settings={settings}
                                onUpdateQuantity={handleUpdateQuantity}
                                onRemoveItem={handleRemoveItem}
                                onClearCart={handleClearCart}
                                onCheckout={() => setCheckoutModalOpen(true)}
                            />
                        </div>
                    </div>
                )}
                 {currentView === 'dashboard' && (
                    <div className="h-full">
                        <Dashboard
                            products={products}
                            categories={categories}
                            orders={orders}
                            employees={employees}
                            customers={customers}
                            settings={settings}
                            onAddProduct={handleAddProduct}
                            onUpdateProduct={handleUpdateProduct}
                            onDeleteProduct={handleDeleteProduct}
                            onBulkStockUpdate={handleBulkStockUpdate}
                            onBulkDeleteProducts={handleBulkDeleteProducts}
                            onAddEmployee={handleAddEmployee}
                            onUpdateEmployee={handleUpdateEmployee}
                            onDeleteEmployee={handleDeleteEmployee}
                            onSettingsChange={setSettings}
                            onUpdateOrderStatus={handleUpdateOrderStatus}
                            onPrintOrder={handlePrintOrder}
                            showToast={showToast}
                            lowStockNotifications={lowStockNotifications}
                            onRestoreBackup={handleRestoreBackup}
                        />
                    </div>
                 )}
                 {currentView === 'tracking' && <OrderTracking orders={orders} currentUser={currentUser} settings={settings} />}
                 {currentView === 'yemen-shipping' && <YemenShipping onSubmit={handleYemenShippingSubmit} />}
                 {currentView === 'bill-payments' && <BillPayments />}
            </main>

            <Footer onAdminLoginClick={() => handleNavigation('dashboard')} />

            {selectedProductForModal && (
                <VariantSelectionModal
                    product={selectedProductForModal}
                    settings={settings}
                    onClose={() => setSelectedProductForModal(null)}
                    onAddToCart={handleAddToCart}
                />
            )}

            {isCheckoutModalOpen && (
                <CheckoutModal
                    items={cart}
                    subtotal={cartSubtotal}
                    tax={cartTax}
                    settings={settings}
                    currentUser={currentUser}
                    onClose={() => setCheckoutModalOpen(false)}
                    onPlaceOrder={handlePlaceOrder}
                />
            )}

            {isLoginModalOpen && (
              <LoginModal
                onClose={() => setLoginModalOpen(false)}
                onLogin={handleLogin}
                onSwitchToRegister={() => {
                  setLoginModalOpen(false);
                  setRegisterModalOpen(true);
                }}
              />
            )}
            
            {isRegisterModalOpen && (
              <RegisterModal
                onClose={() => setRegisterModalOpen(false)}
                onRegister={handleRegister}
                onSwitchToLogin={() => {
                  setRegisterModalOpen(false);
                  setLoginModalOpen(true);
                }}
              />
            )}

            {isDashboardLoginModalOpen && (
                <DashboardLoginModal
                    onClose={() => setDashboardLoginModalOpen(false)}
                    onLogin={handleAdminLogin}
                />
            )}
            
            <PrintPreviewModal 
                order={orderToPrint} 
                onClose={() => setOrderToPrint(null)} 
                settings={settings}
            />
            
            <Toast
                message={toast.message}
                type={toast.type}
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
            />

            <FlyingProductAnimation
                product={flyingProduct}
                onAnimationEnd={() => {
                    setFlyingProduct(null);
                    setIsCartShaking(true);
                    setTimeout(() => setIsCartShaking(false), 500);
                }}
            />
            <ScrollButtons scrollContainerId={scrollContainerId} />
             <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
                .font-cairo { font-family: 'Cairo', sans-serif; }
                .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
                @keyframes shake {
                  10%, 90% { transform: translate3d(-1px, 0, 0); }
                  20%, 80% { transform: translate3d(2px, 0, 0); }
                  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                  40%, 60% { transform: translate3d(4px, 0, 0); }
                }
                .animate-pulse-subtle { animation: pulse-subtle 2s infinite; }
                @keyframes pulse-subtle {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .7; }
                }
            `}</style>
        </div>
    );
};

export default App;