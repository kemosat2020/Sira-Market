

import React, { useRef } from 'react';
import { StoreInfo } from '../../types.ts';
import { useTranslation } from '../../i18n/index.tsx';
import UploadIcon from '../icons/UploadIcon.tsx';
import InfoIcon from '../icons/InfoIcon.tsx';

interface StoreSettingsProps {
    settings: StoreInfo;
    onChange: (settings: StoreInfo) => void;
}

const StoreSettings: React.FC<StoreSettingsProps> = ({ settings, onChange }) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange({ ...settings, [e.target.name]: e.target.value });
    };

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange({ ...settings, logoUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <InfoIcon className="w-6 h-6 me-3 text-gray-500" />
                {t('dashboard.settings.store_info_title')}
            </h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">{t('dashboard.settings.store_name')}</label>
                    <input 
                        type="text" 
                        id="storeName"
                        name="name"
                        value={settings.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                 <div>
                    <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700">{t('dashboard.settings.store_address')}</label>
                    <textarea 
                        id="storeAddress"
                        name="address"
                        value={settings.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('dashboard.settings.store_logo')}</label>
                    <div className="mt-1 flex items-center gap-4">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleLogoChange}
                            className="hidden" 
                            accept="image/*" 
                        />
                        <div 
                            className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {settings.logoUrl ? (
                                <img src={settings.logoUrl} alt="Store Logo Preview" className="w-full h-full object-contain p-1 rounded-md" />
                            ) : (
                                <div className="text-xs text-gray-500 text-center p-2">
                                    <UploadIcon className="w-6 h-6 mx-auto text-gray-400"/>
                                    <span>{t('dashboard.productManagement.click_to_upload')}</span>
                                </div>
                            )}
                        </div>
                        {settings.logoUrl && (
                          <button type="button" onClick={() => onChange({ ...settings, logoUrl: '' })} className="text-sm text-red-600 font-semibold hover:text-red-800">{t('dashboard.productManagement.remove_image')}</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreSettings;