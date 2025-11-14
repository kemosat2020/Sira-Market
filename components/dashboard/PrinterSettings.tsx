
import React from 'react';
// FIX: Add .ts extension to import path.
import { PrinterSettings as PrinterSettingsType } from '../../types.ts';
import PrintIcon from '../icons/PrintIcon.tsx';
import { useTranslation } from '../../i18n/index.tsx';

interface PrinterSettingsProps {
    settings: PrinterSettingsType;
    onChange: (settings: PrinterSettingsType) => void;
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


const PrinterSettings: React.FC<PrinterSettingsProps> = ({ settings, onChange }) => {
    const { t } = useTranslation();

    const handleToggle = (field: keyof PrinterSettingsType['receipt'] | 'autoPrint') => {
        if (field === 'autoPrint') {
            onChange({ ...settings, autoPrint: !settings.autoPrint });
        } else {
             onChange({
                ...settings,
                receipt: {
                    ...settings.receipt,
                    [field]: !settings.receipt[field]
                }
            });
        }
    };

    const handleTextChange = (field: 'printerName' | 'customFooterText', value: string) => {
        if (field === 'printerName') {
            onChange({ ...settings, printerName: value });
        } else {
            onChange({
                ...settings,
                receipt: {
                    ...settings.receipt,
                    [field]: value,
                }
            });
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <PrintIcon className="w-6 h-6 me-3 text-gray-500" />
                    {t('dashboard.settings.printer_settings')}
                </h2>
                <div className="space-y-4">
                     <Toggle 
                        enabled={settings.autoPrint}
                        onChange={() => handleToggle('autoPrint')}
                        label={t('dashboard.settings.auto_print')}
                    />
                    <div>
                        <label htmlFor="printerName" className="block text-sm font-medium text-gray-700">{t('dashboard.settings.printer_name')}</label>
                        <input 
                            type="text" 
                            id="printerName"
                            value={settings.printerName}
                            onChange={(e) => handleTextChange('printerName', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                </div>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{t('dashboard.settings.receipt_customization')}</h2>
                 <div className="space-y-4">
                    <Toggle 
                        enabled={settings.receipt.showLogo}
                        onChange={() => handleToggle('showLogo')}
                        label={t('dashboard.settings.show_logo')}
                    />
                     <Toggle 
                        enabled={settings.receipt.showStoreAddress}
                        onChange={() => handleToggle('showStoreAddress')}
                        label={t('dashboard.settings.show_address')}
                    />
                     <Toggle 
                        enabled={settings.receipt.showBarcode}
                        onChange={() => handleToggle('showBarcode')}
                        label={t('dashboard.settings.show_barcode')}
                    />
                    <div>
                        <label htmlFor="customFooterText" className="block text-sm font-medium text-gray-700">{t('dashboard.settings.footer_text')}</label>
                        <textarea 
                            id="customFooterText"
                            value={settings.receipt.customFooterText}
                            onChange={(e) => handleTextChange('customFooterText', e.target.value)}
                            rows={3}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrinterSettings;