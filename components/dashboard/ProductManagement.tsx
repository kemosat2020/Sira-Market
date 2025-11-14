

import React, { useState, useMemo, useRef, useEffect } from 'react';
// FIX: Add .ts extension to import path.
import { Product, Variant, LowStockNotification, Category, LocalizedString, AppSettings } from '../../types.ts';
import Modal from '../Modal.tsx';
import EditIcon from '../icons/EditIcon.tsx';
import TrashIcon from '../icons/TrashIcon.tsx';
import PlusIcon from '../icons/PlusIcon.tsx';
import SearchIcon from '../icons/SearchIcon.tsx';
import DownloadIcon from '../icons/DownloadIcon.tsx';
import ExclamationIcon from '../icons/ExclamationIcon.tsx';
import UploadIcon from '../icons/UploadIcon.tsx';
import XIcon from '../icons/XIcon.tsx';
import { useTranslation } from '../../i18n/index.tsx';


interface ProductManagementProps {
  products: Product[];
  categories: Category[];
  settings: AppSettings;
  onAddProduct: (product: Omit<Product, 'id'> | Product[]) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onBulkStockUpdate: (updates: { productId: number; variantId?: string | number; newStock: number }[]) => void;
  onBulkDeleteProducts: (deletions: { productId: number; variantId?: string | number }[]) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  lowStockNotifications: LowStockNotification[];
}

const ProductForm: React.FC<{
  product?: Product | null;
  categories: Category[];
  onSubmit: (productData: Omit<Product, 'id'> | Product) => void;
  onCancel: () => void;
}> = ({ product, categories, onSubmit, onCancel }) => {
  const { t, locale } = useTranslation();
  const [name, setName] = useState<LocalizedString>(product?.name || { en: '', ar: '' });
  const [basePrice, setBasePrice] = useState(product?.basePrice?.toString() || '');
  const [category, setCategory] = useState(product?.category || categories[0]?.key || '');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
  const [hasVariants, setHasVariants] = useState(!!product?.variants && product.variants.length > 0);
  const [stock, setStock] = useState(product?.stock?.toString() || '0');
  const [lowStockThreshold, setLowStockThreshold] = useState(product?.lowStockThreshold?.toString() || '');
  const [variants, setVariants] = useState<Variant[]>(product?.variants || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
        setName(product.name);
        setBasePrice(product.basePrice.toString());
        setCategory(product.category);
        setImageUrl(product.imageUrl);
        setHasVariants(!!product.variants && product.variants.length > 0);
        setStock(product.stock.toString());
        setLowStockThreshold(product.lowStockThreshold?.toString() || '');
        setVariants(product.variants || []);
    }
  }, [product])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string, lang?: 'en' | 'ar') => {
    const newVariants = [...variants];
    const variant = { ...newVariants[index] };
     if (field === 'priceModifier' || field === 'stock' || field === 'lowStockThreshold') {
      (variant[field] as number | undefined) = value === '' ? undefined : (parseFloat(value) || 0);
    } else if (field === 'name' && lang) {
      variant.name = {...variant.name, [lang]: value };
    }
    newVariants[index] = variant;
    setVariants(newVariants);
  };
  
  const addVariant = () => {
    setVariants([...variants, { id: `new-${Date.now()}`, name: {en: '', ar: ''}, priceModifier: 0, stock: 0, lowStockThreshold: undefined }]);
  };
  
  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceValue = parseFloat(basePrice);
    if (!name.en || !name.ar || isNaN(priceValue) || priceValue < 0 || !category) {
        alert('Please fill out the main fields correctly.');
        return;
    }

    const productData = {
      name,
      basePrice: priceValue,
      category,
      imageUrl,
      stock: hasVariants ? 0 : parseInt(stock, 10) || 0,
      lowStockThreshold: hasVariants ? undefined : (lowStockThreshold ? parseInt(lowStockThreshold, 10) : undefined),
      variants: hasVariants ? variants.map(v => ({...v, id: String(v.id).startsWith('new-') ? v.name.en.toLowerCase().replace(/\s+/g, '-') : v.id})) : [],
    };
    
    if(product) {
        onSubmit({ ...product, ...productData });
    } else {
        onSubmit(productData as Omit<Product, 'id'>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
       <div>
        <label className="block text-sm font-medium text-gray-700">{t('dashboard.productManagement.product_image')}</label>
        <div className="mt-1 flex items-center gap-4">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange}
                className="hidden" 
                accept="image/*" 
            />
            <div 
                className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
            >
                {imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover rounded-md" />
                ) : (
                    <div className="text-xs text-gray-500 text-center p-2">
                        <UploadIcon className="w-6 h-6 mx-auto text-gray-400"/>
                        <span>{t('dashboard.productManagement.click_to_upload')}</span>
                    </div>
                )}
            </div>
            {imageUrl && (
              <button type="button" onClick={() => setImageUrl('')} className="text-sm text-red-600 font-semibold hover:text-red-800">{t('dashboard.productManagement.remove_image')}</button>
            )}
        </div>
      </div>
      <div>
        <label htmlFor="name_en" className="block text-sm font-medium text-gray-700">{t('dashboard.productManagement.product_name')} (EN)</label>
        <input type="text" id="name_en" value={name.en} onChange={e => setName(p => ({...p, en: e.target.value}))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
      </div>
      <div>
        <label htmlFor="name_ar" className="block text-sm font-medium text-gray-700">{t('dashboard.productManagement.product_name')} (AR)</label>
        <input type="text" id="name_ar" value={name.ar} onChange={e => setName(p => ({...p, ar: e.target.value}))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">{t('dashboard.productManagement.base_price')}</label>
          <input type="number" id="basePrice" value={basePrice} onChange={e => setBasePrice(e.target.value)} min="0" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">{t('dashboard.productManagement.category')}</label>
          <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
            {categories.map(cat => <option key={cat.key} value={cat.key}>{cat.name[locale]}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input type="checkbox" id="hasVariants" checked={hasVariants} onChange={e => setHasVariants(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
        <label htmlFor="hasVariants" className="ms-2 block text-sm text-gray-900">{t('dashboard.productManagement.has_variants')}</label>
      </div>

      {!hasVariants ? (
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">{t('dashboard.productManagement.stock')}</label>
              <input type="number" id="stock" value={stock} onChange={e => setStock(e.target.value)} min="0" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
              <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700">{t('dashboard.productManagement.low_stock_threshold')}</label>
              <input type="number" id="lowStockThreshold" value={lowStockThreshold} onChange={e => setLowStockThreshold(e.target.value)} placeholder={t('dashboard.productManagement.optional')} min="0" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
        </div>
      ) : (
        <div className="space-y-3 border-t pt-4">
          <h4 className="font-semibold">{t('dashboard.productManagement.product_options')}</h4>
            <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 px-1">
                <div className="col-span-3">{t('dashboard.productManagement.option_name')} (EN)</div>
                <div className="col-span-3">{t('dashboard.productManagement.option_name')} (AR)</div>
                <div className="col-span-2">{t('dashboard.productManagement.price_modifier')}</div>
                <div className="col-span-2">{t('dashboard.productManagement.stock')}</div>
                <div className="col-span-1">{t('dashboard.productManagement.low_stock_threshold').substring(0,3)}</div>
            </div>
            {variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <input type="text" placeholder="e.g. Large" value={variant.name.en} onChange={e => handleVariantChange(index, 'name', e.target.value, 'en')} className="col-span-3 border-gray-300 rounded-md text-sm" />
                <input type="text" placeholder="مثال: كبير" value={variant.name.ar} onChange={e => handleVariantChange(index, 'name', e.target.value, 'ar')} className="col-span-3 border-gray-300 rounded-md text-sm" />
                <input type="number" step="0.01" placeholder="+/-" value={variant.priceModifier} onChange={e => handleVariantChange(index, 'priceModifier', e.target.value)} className="col-span-2 border-gray-300 rounded-md text-sm" />
                <input type="number" placeholder="Qty" value={variant.stock} onChange={e => handleVariantChange(index, 'stock', e.target.value)} className="col-span-2 border-gray-300 rounded-md text-sm" />
                <input type="number" placeholder="Opt" value={variant.lowStockThreshold || ''} onChange={e => handleVariantChange(index, 'lowStockThreshold', e.target.value)} className="col-span-1 border-gray-300 rounded-md text-sm" />
                <button type="button" onClick={() => removeVariant(index)} className="col-span-1 text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
              </div>
            ))}
            <button type="button" onClick={addVariant} className="text-sm text-blue-600 font-semibold hover:text-blue-800 flex items-center">
              <PlusIcon className="w-4 h-4 me-1"/> {t('dashboard.productManagement.add_option')}
            </button>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">{t('general.cancel')}</button>
        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">{product ? t('general.save') : t('dashboard.productManagement.add_product')}</button>
      </div>
    </form>
  )
}

const LowStockAlert: React.FC<{ notifications: LowStockNotification[] }> = ({ notifications }) => {
    const { t, locale } = useTranslation();
    const [isOpen, setIsOpen] = useState(true);
    if (!isOpen || notifications.length === 0) return null;

    return (
        <div className="bg-yellow-50 border-s-4 border-yellow-400 p-4 mb-6 rounded-e-lg shadow">
            <div className="flex">
                <div className="flex-shrink-0">
                    <ExclamationIcon className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ms-3 flex-grow">
                    <p className="text-sm font-bold text-yellow-800">
                        {t('dashboard.productManagement.low_stock_alert_title', { count: notifications.length })}
                    </p>
                    <div className="mt-2 text-sm text-yellow-700">
                        <ul className="list-disc space-y-1 ps-5 max-h-32 overflow-y-auto">
                            {notifications.map(n => (
                                <li key={n.uniqueId}>
                                    <strong>{n.productName[locale]} {n.variantName && <span className="font-normal">({n.variantName[locale]})</span>}</strong>
                                    - {t('dashboard.productManagement.remaining')}: {n.remainingStock} ({t('dashboard.productManagement.threshold')}: {n.threshold})
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="ms-auto ps-3">
                    <div className="-mx-1.5 -my-1.5">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="inline-flex bg-yellow-50 rounded-md p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
                            aria-label="Dismiss"
                        >
                            <XIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductManagement: React.FC<ProductManagementProps> = ({ products, categories, settings, onAddProduct, onUpdateProduct, onDeleteProduct, onBulkStockUpdate, onBulkDeleteProducts, showToast, lowStockNotifications }) => {
    const { t, locale } = useTranslation();
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isBulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [stockFilter, setStockFilter] = useState<'All' | 'In Stock' | 'Low Stock' | 'Out of Stock'>('All');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const selectAllCheckboxRef = useRef<HTMLInputElement>(null);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [bulkStock, setBulkStock] = useState('');

    const getStockStatus = (product: Product): 'In Stock' | 'Low Stock' | 'Out of Stock' => {
        const totalStock = product.variants?.length > 0
            ? product.variants.reduce((sum, v) => sum + v.stock, 0)
            : product.stock;

        if (totalStock <= 0) return 'Out of Stock';
        
        let hasLowStock = false;
        if (product.variants?.length > 0) {
            hasLowStock = product.variants.some(v => typeof v.lowStockThreshold !== 'undefined' && v.stock > 0 && v.stock <= v.lowStockThreshold);
        } else {
            hasLowStock = typeof product.lowStockThreshold !== 'undefined' && product.stock > 0 && product.stock <= product.lowStockThreshold;
        }

        if (hasLowStock) return 'Low Stock';

        return 'In Stock';
    };

    const filteredProducts = useMemo(() => {
        return products
            .filter(p => p.name[locale].toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(p => categoryFilter === 'All' || p.category === categoryFilter)
            .filter(p => {
                if (stockFilter === 'All') return true;
                const status = getStockStatus(p);
                return status === stockFilter;
            });
    }, [products, searchTerm, categoryFilter, stockFilter, locale]);
    
    const flattenedProducts = useMemo(() => {
        return filteredProducts.flatMap(p => {
            if (!p.variants || p.variants.length === 0) {
                return [{
                    uniqueId: `product-${p.id}`,
                    productId: p.id,
                    productName: p.name[locale],
                    variantName: '—',
                    category: categories.find(c => c.key === p.category)?.name[locale] || p.category,
                    price: p.basePrice,
                    stock: p.stock,
                    imageUrl: p.imageUrl,
                    isVariant: false,
                    productRef: p,
                    variantId: undefined,
                }];
            }
            return p.variants.map(v => ({
                uniqueId: `variant-${p.id}-${v.id}`,
                productId: p.id,
                productName: p.name[locale],
                variantName: v.name[locale],
                category: categories.find(c => c.key === p.category)?.name[locale] || p.category,
                price: p.basePrice + v.priceModifier,
                stock: v.stock,
                imageUrl: p.imageUrl,
                isVariant: true,
                variantId: v.id,
                productRef: p,
            }));
        });
    }, [filteredProducts, categories, locale]);

    useEffect(() => {
        if (selectAllCheckboxRef.current) {
            const allSelected = flattenedProducts.length > 0 && selectedItems.size === flattenedProducts.length;
            selectAllCheckboxRef.current.checked = allSelected;
            selectAllCheckboxRef.current.indeterminate = !allSelected && selectedItems.size > 0;
        }
    }, [selectedItems, flattenedProducts]);

    const handleSelectItem = (uniqueId: string) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(uniqueId)) {
                newSet.delete(uniqueId);
            } else {
                newSet.add(uniqueId);
            }
            return newSet;
        });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedItems(new Set(flattenedProducts.map(p => p.uniqueId)));
        } else {
            setSelectedItems(new Set());
        }
    };
    
    const handleApplyBulkUpdate = () => {
        const newStock = parseInt(bulkStock, 10);
        if (isNaN(newStock) || newStock < 0) {
            showToast('Please enter a valid stock quantity.', 'error');
            return;
        }
        const updates = Array.from(selectedItems).map(uniqueId => {
            const item = flattenedProducts.find(p => p.uniqueId === uniqueId);
            return {
                productId: item!.productId,
                variantId: item!.isVariant ? item!.variantId : undefined,
                newStock,
            };
        });
        onBulkStockUpdate(updates as any);
        setSelectedItems(new Set());
        setBulkStock('');
    };
    
    const handleConfirmBulkDelete = () => {
        const deletions = Array.from(selectedItems).map(uniqueId => {
            const item = flattenedProducts.find(p => p.uniqueId === uniqueId);
            return {
                productId: item!.productId,
                variantId: item!.isVariant ? item!.variantId : undefined,
            };
        });
        onBulkDeleteProducts(deletions as any);
        setBulkDeleteModalOpen(false);
        setSelectedItems(new Set());
    };

  const parseCSVAndAddProducts = (csvText: string) => {
    try {
      const rows = [];
      let currentRow: string[] = [];
      let currentField = '';
      let inQuotes = false;
      const text = csvText.trim() + '\n';

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        if (inQuotes) {
          if (char === '"') {
            if (i + 1 < text.length && text[i+1] === '"') {
              currentField += '"';
              i++;
            } else {
              inQuotes = false;
            }
          } else {
            currentField += char;
          }
        } else {
          if (char === '"') {
            inQuotes = true;
          } else if (char === ',') {
            currentRow.push(currentField);
            currentField = '';
          } else if (char === '\n' || char === '\r') {
             if (char === '\r' && i + 1 < text.length && text[i+1] === '\n') {
                i++;
             }
            currentRow.push(currentField);
            if(currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
               rows.push(currentRow);
            }
            currentRow = [];
            currentField = '';
          } else {
            currentField += char;
          }
        }
      }

      if (rows.length < 2) {
        showToast(t('toasts.invalidCSV', { headers: '' }), 'error');
        return;
      }

      const header = rows[0].map(h => h.replace(/^"|"$/g, '').trim());
      const requiredHeaders = ['Name', 'cents', 'Department', 'Upc'];
      
      if (!requiredHeaders.every(h => header.includes(h))) {
        showToast(t('toasts.invalidCSV', { headers: requiredHeaders.join(', ') }), 'error');
        return;
      }

      const nameIndex = header.indexOf('Name');
      const priceIndex = header.indexOf('cents');
      const categoryIndex = header.indexOf('Department');
      const upcIndex = header.indexOf('Upc');

      const newProducts: Omit<Product, 'id'>[] = [];
      const newIds: number[] = [];
      const existingIds = new Set(products.map(p => p.id));

      for (let i = 1; i < rows.length; i++) {
        const data = rows[i];
        if (data.length < header.length) continue;

        const upcString = data[upcIndex]?.replace(/="|=/g, '').replace(/"/g, '').trim();
        const id = parseInt(upcString, 10);
        
        const name = data[nameIndex]?.replace(/^"|"$/g, '').trim();
        const priceInCents = parseInt(data[priceIndex]?.trim(), 10);
        const basePrice = priceInCents / 100;
        const categoryKey = data[categoryIndex]?.replace(/^"|"$/g, '').trim().toLowerCase().replace(/\s+/g, '_');
        
        if (!name || isNaN(basePrice) || basePrice < 0 || !categoryKey || isNaN(id) || existingIds.has(id)) {
          console.warn(`Skipping invalid or duplicate row: ${data.join(',')}`);
          continue;
        }
        
        newProducts.push({
          id,
          name: { en: name, ar: name }, // Default arabic to english name
          basePrice,
          category: categoryKey,
          imageUrl: `https://picsum.photos/seed/${id}/400`,
          stock: 99, // Default stock for CSV imported items
          variants: [],
        } as any);
        existingIds.add(id);
      }

      if (newProducts.length > 0) {
        onAddProduct(newProducts as any);
        showToast(t('toasts.csvProductsAdded', {count: newProducts.length}), 'success');
      } else {
        showToast(t('toasts.csvNoNewProducts'), 'error');
      }

    } catch (error) {
      console.error("Error parsing CSV:", error);
      showToast(t('toasts.csvParseError'), 'error');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSVAndAddProducts(text);
    };
    reader.onerror = () => {
        showToast(t('toasts.csvReadError'), 'error');
    };
    reader.readAsText(file);
  };

    const handleEditClick = (product: Product) => {
        setSelectedProduct(product);
        setEditModalOpen(true);
    }
    
    const handleDeleteClick = (product: Product) => {
        setSelectedProduct(product);
        setDeleteModalOpen(true);
    }

    const confirmDelete = () => {
        if(selectedProduct) {
            onDeleteProduct(selectedProduct.id);
            setDeleteModalOpen(false);
            setSelectedProduct(null);
        }
    }
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.storeInfo.currency, currencyDisplay: 'symbol' }).format(amount);
    };

    const handleExportCSV = () => {
        const headers = ['ProductID', 'ProductName', 'Category', 'BasePrice', 'VariantID', 'VariantName', 'PriceModifier', 'FinalPrice', 'Stock', 'LowStockThreshold'];
        const rows = products.flatMap(p => {
            const categoryName = categories.find(c => c.key === p.category)?.name.en || p.category;
            if (!p.variants || p.variants.length === 0) {
                return [[p.id, p.name.en, categoryName, p.basePrice, '', '', '', p.basePrice, p.stock, p.lowStockThreshold || '']];
            } else {
                return p.variants.map(v => [
                    p.id, p.name.en, categoryName, p.basePrice, v.id, v.name.en, v.priceModifier, p.basePrice + v.priceModifier, v.stock, v.lowStockThreshold || ''
                ]);
            }
        });

        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        link.setAttribute("download", `products_export_${timestamp}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const getLowStockInfo = (product: Product, variant?: Variant): { isLow: boolean; message: string } => {
        if (variant) {
            if (typeof variant.lowStockThreshold !== 'undefined' && variant.stock <= variant.lowStockThreshold) {
                return { isLow: true, message: t('dashboard.productManagement.stock_low_warning', { count: variant.stock }) };
            }
        } else {
             if (product.variants?.length > 0) {
                const lowVariant = product.variants.find(v => typeof v.lowStockThreshold !== 'undefined' && v.stock > 0 && v.stock <= v.lowStockThreshold);
                if(lowVariant) return { isLow: true, message: t('dashboard.productManagement.variant_stock_low_warning', {variantName: lowVariant.name[locale], count: lowVariant.stock})};
             } else {
                if (typeof product.lowStockThreshold !== 'undefined' && product.stock <= product.lowStockThreshold) {
                    return { isLow: true, message: t('dashboard.productManagement.stock_low_warning', { count: product.stock }) };
                }
            }
        }
        return { isLow: false, message: '' };
    };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <LowStockAlert notifications={lowStockNotifications} />
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">{t('dashboard.productManagement.title')}</h1>
        <div className="flex items-center gap-2">
            <input
                id="csv-upload-dashboard"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
            />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">
                <UploadIcon className="w-5 h-5 me-2" />
                {t('dashboard.productManagement.import_csv')}
            </button>
            <button onClick={handleExportCSV} className="flex items-center bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700">
                <DownloadIcon className="w-5 h-5 me-2" />
                {t('dashboard.productManagement.export')}
            </button>
            <button onClick={() => setAddModalOpen(true)} className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                <PlusIcon className="w-5 h-5 me-2" />
                {t('dashboard.productManagement.add_product')}
            </button>
        </div>
      </div>

       <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <div className="relative flex-grow w-full md:w-auto">
                <input
                    type="text"
                    placeholder={t('dashboard.productManagement.search_placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <SearchIcon className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full md:w-auto border-gray-300 rounded-lg shadow-sm">
                <option value="All">{t('dashboard.productManagement.all_categories')}</option>
                {categories.map(cat => <option key={cat.key} value={cat.key}>{cat.name[locale]}</option>)}
            </select>
            <select value={stockFilter} onChange={e => setStockFilter(e.target.value as any)} className="w-full md:w-auto border-gray-300 rounded-lg shadow-sm">
                <option value="All">{t('dashboard.productManagement.all_stock_statuses')}</option>
                <option value="In Stock">{t('dashboard.productManagement.in_stock')}</option>
                <option value="Low Stock">{t('dashboard.productManagement.low_stock')}</option>
                <option value="Out of Stock">{t('dashboard.productManagement.out_of_stock')}</option>
            </select>
        </div>
        
        {selectedItems.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm font-semibold text-blue-800">
                    {t('dashboard.productManagement.selected_items', { count: selectedItems.size })}
                </p>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label htmlFor="bulkStock" className="text-sm font-medium">{t('dashboard.productManagement.update_stock')}</label>
                        <input 
                            type="number"
                            id="bulkStock"
                            value={bulkStock}
                            onChange={(e) => setBulkStock(e.target.value)}
                            placeholder={t('dashboard.productManagement.new_quantity')}
                            className="w-28 border-gray-300 rounded-md text-sm py-1"
                            min="0"
                        />
                        <button onClick={handleApplyBulkUpdate} className="bg-blue-600 text-white text-sm font-bold py-1 px-3 rounded-lg hover:bg-blue-700">
                            {t('dashboard.productManagement.apply')}
                        </button>
                    </div>
                    <button 
                        onClick={() => setBulkDeleteModalOpen(true)}
                        className="bg-red-600 text-white text-sm font-bold py-1 px-3 rounded-lg hover:bg-red-700 flex items-center gap-1.5"
                    >
                       <TrashIcon className="w-4 h-4" />
                        {t('dashboard.productManagement.delete_selected')}
                    </button>
                </div>
            </div>
        )}

      <div className="overflow-x-auto">
        <table className="w-full text-start">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-start">
                 <input
                    ref={selectAllCheckboxRef}
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
                    onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-start">{t('dashboard.productManagement.product_variant')}</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-start">{t('dashboard.productManagement.category')}</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-start">{t('dashboard.productManagement.price')}</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-start">{t('dashboard.productManagement.stock')}</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-start">{t('dashboard.productManagement.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {flattenedProducts.map(item => {
              const lowStockInfo = getLowStockInfo(item.productRef, item.isVariant ? item.productRef.variants?.find(v => v.id === item.variantId) : undefined);
              const isSelected = selectedItems.has(item.uniqueId);

              return (
              <tr key={item.uniqueId} className={isSelected ? 'bg-blue-50' : ''}>
                <td className="px-4 py-4 whitespace-nowrap">
                    <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
                        checked={isSelected}
                        onChange={() => handleSelectItem(item.uniqueId)}
                    />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full object-cover" src={item.imageUrl} alt={item.productName} />
                        </div>
                        <div className="ms-4">
                            <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                            {item.isVariant && <div className="text-xs text-gray-500">{item.variantName}</div>}
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{formatCurrency(item.price)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                     <span>{`${item.stock} ${t('dashboard.productManagement.stock_unit')}`}</span>
                    {lowStockInfo.isLow && (
                        <div className="relative group">
                            <ExclamationIcon className="w-5 h-5 text-yellow-500" />
                            <div className="absolute bottom-full z-10 mb-2 w-max bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {lowStockInfo.message}
                            </div>
                        </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button onClick={() => handleEditClick(item.productRef)} className="text-blue-600 hover:text-blue-900 p-1"><EditIcon className="w-5 h-5"/></button>
                  <button onClick={() => handleDeleteClick(item.productRef)} className="text-red-600 hover:text-red-900 p-1"><TrashIcon className="w-5 h-5"/></button>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

       <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title={t('dashboard.productManagement.add_new_product')}>
           <ProductForm categories={categories} onSubmit={(data) => { onAddProduct(data as any); setAddModalOpen(false); }} onCancel={() => setAddModalOpen(false)} />
       </Modal>
       
       <Modal isOpen={isEditModalOpen} onClose={() => { setEditModalOpen(false); setSelectedProduct(null); }} title={t('dashboard.productManagement.edit_product')}>
           <ProductForm product={selectedProduct} categories={categories} onSubmit={(data) => { onUpdateProduct(data as Product); setEditModalOpen(false); setSelectedProduct(null); }} onCancel={() => { setEditModalOpen(false); setSelectedProduct(null); }} />
       </Modal>
       
       <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title={t('dashboard.productManagement.confirm_delete_title')}>
           <p>{t('dashboard.productManagement.confirm_delete_body', { productName: selectedProduct?.name[locale] })}</p>
           <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setDeleteModalOpen(false)} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">{t('general.cancel')}</button>
                <button type="button" onClick={confirmDelete} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">{t('general.delete')}</button>
            </div>
       </Modal>
       
        <Modal isOpen={isBulkDeleteModalOpen} onClose={() => setBulkDeleteModalOpen(false)} title={t('dashboard.productManagement.confirm_bulk_delete_title')}>
           <p>{t('dashboard.productManagement.confirm_bulk_delete_body', { count: selectedItems.size })}</p>
           <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setBulkDeleteModalOpen(false)} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">{t('general.cancel')}</button>
                <button type="button" onClick={handleConfirmBulkDelete} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">{t('dashboard.productManagement.delete_all')}</button>
            </div>
       </Modal>
    </div>
  );
};

export default ProductManagement;