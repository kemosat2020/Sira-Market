
import React from 'react';
// FIX: Add .ts extension to import path.
import { ShippingMethod } from '../../types.ts';
import TruckIcon from '../icons/TruckIcon.tsx';
import { useTranslation } from '../../i18n/index.tsx';

interface ShippingSettingsProps {
    settings: ShippingMethod[];
    onChange: (settings: ShippingMethod[]) => void;
}

const Toggle: React.FC<{ enabled: boolean; onChange: () => void; label: string }> = ({ enabled, onChange, label }) => (
    <div className="flex items-center">
        <button
            type="button"
            onClick={onChange}
            className={`${enabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
            role="switch"
            aria-checked={enabled}
        >
            <span className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}/>
        </button>
        <label className="ms-3 text-sm font-medium text-gray-900">{label}</label>
    </div>
);


const ShippingSettings: React.FC<ShippingSettingsProps> = ({ settings, onChange }) => {
    const { t } = useTranslation();
    const standardShipping = settings.find(s => s.id === 'standard');
    const freeShipping = settings.find(s => s.id === 'free');
    const customShipping = settings.find(s => s.id === 'custom');

    const handleFieldChange = (id: 'standard' | 'free' | 'custom', field: keyof ShippingMethod, value: any) => {
        onChange(settings.map(s => s.id === id ? { ...s, [field]: value } : s));
    };
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <TruckIcon className="w-6 h-6 me-3 text-gray-500" />
                {t('dashboard.settings.shipping_settings')}
            </h2>
            <div className="space-y-6">
                
                {/* Standard Shipping */}
                <div className="space-y-4 p-4 border rounded-lg">
                    <Toggle 
                        enabled={standardShipping?.enabled ?? true}
                        onChange={() => handleFieldChange('standard', 'enabled', !(standardShipping?.enabled ?? true))}
                        label={t('dashboard.settings.standard_shipping')}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div>
                            <label htmlFor="standardCost" className="block text-sm font-medium text-gray-700">{t('dashboard.settings.standard_cost')}</label>
                            <input 
                                type="number" 
                                id="standardCost"
                                value={standardShipping?.cost || 0} 
                                onChange={(e) => handleFieldChange('standard', 'cost', parseFloat(e.target.value) || 0)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
                                disabled={!(standardShipping?.enabled ?? true)}
                            />
                        </div>
                    </div>
                </div>

                {/* Free Shipping */}
                 <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700">{t('dashboard.settings.free_shipping')}</h3>
                    <div>
                        <label htmlFor="freeThreshold" className="block text-sm font-medium text-gray-700">{t('dashboard.settings.free_shipping_threshold')}</label>
                        <input 
                            type="number" 
                            id="freeThreshold"
                            value={freeShipping?.threshold || 0} 
                            onChange={(e) => handleFieldChange('free', 'threshold', parseFloat(e.target.value) || 0)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                </div>

                {/* Custom Shipping */}
                <div className="space-y-4 p-4 border rounded-lg">
                    <Toggle 
                        enabled={customShipping?.enabled ?? true}
                        onChange={() => handleFieldChange('custom', 'enabled', !(customShipping?.enabled ?? true))}
                        label={t('dashboard.settings.custom_shipping')}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div>
                            <label htmlFor="customLabel" className="block text-sm font-medium text-gray-700">{t('dashboard.settings.custom_shipping_label')}</label>
                            <input 
                                type="text" 
                                id="customLabel"
                                placeholder={t('dashboard.settings.custom_shipping_placeholder')}
                                value={customShipping?.label || ''} 
                                onChange={(e) => handleFieldChange('custom', 'label', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
                                disabled={!(customShipping?.enabled ?? true)}
                            />
                        </div>
                        <div>
                            <label htmlFor="customCost" className="block text-sm font-medium text-gray-700">{t('dashboard.settings.custom_shipping_cost')}</label>
                            <input 
                                type="number" 
                                id="customCost"
                                value={customShipping?.cost || 0} 
                                onChange={(e) => handleFieldChange('custom', 'cost', parseFloat(e.target.value) || 0)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
                                disabled={!(customShipping?.enabled ?? true)}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ShippingSettings;