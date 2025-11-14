
import React from 'react';
// FIX: Add .ts extension to import path.
import { PaymentSettings as PaymentSettingsType } from '../../types.ts';
import PaypalIcon from '../icons/PaypalIcon.tsx';
import StripeIcon from '../icons/StripeIcon.tsx';
import CreditCardIcon from '../icons/CreditCardIcon.tsx';
import { useTranslation } from '../../i18n/index.tsx';

interface PaymentSettingsProps {
    settings: PaymentSettingsType;
    onChange: (settings: PaymentSettingsType) => void;
}

const PaymentSettings: React.FC<PaymentSettingsProps> = ({ settings, onChange }) => {
    const { t } = useTranslation();
    
    const handleToggle = (gateway: 'paypal' | 'stripe') => {
        onChange({
            ...settings,
            [gateway]: { ...settings[gateway], enabled: !settings[gateway].enabled }
        });
    };

    const handleKeyChange = (gateway: 'paypal' | 'stripe', key: string) => {
        onChange({
            ...settings,
            [gateway]: { ...settings[gateway], apiKey: key }
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <CreditCardIcon className="w-6 h-6 me-3 text-gray-500" />
                {t('dashboard.settings.payment_settings')}
            </h2>
            <div className="space-y-6">
                {/* PayPal Settings */}
                <div className="flex flex-wrap items-start gap-4">
                    <PaypalIcon className="w-24 text-[#00457C]" />
                    <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-700">{t('dashboard.settings.paypal_api_key')}</label>
                        <input 
                            type="text" 
                            value={settings.paypal.apiKey}
                            onChange={(e) => handleKeyChange('paypal', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" 
                        />
                    </div>
                    <div className="flex items-center pt-7">
                        <label htmlFor="paypalToggle" className="ms-3 text-sm font-medium text-gray-900">
                           {settings.paypal.enabled ? t('dashboard.settings.enabled') : t('dashboard.settings.disabled')}
                        </label>
                        <button
                            type="button"
                            onClick={() => handleToggle('paypal')}
                            className={`${settings.paypal.enabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ms-4`}
                            role="switch"
                            aria-checked={settings.paypal.enabled}
                        >
                            <span className={`${settings.paypal.enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}/>
                        </button>
                    </div>
                </div>
                {/* Stripe Settings */}
                <div className="flex flex-wrap items-start gap-4">
                    <StripeIcon className="w-24 text-[#635BFF]" />
                    <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-700">{t('dashboard.settings.stripe_api_key')}</label>
                        <input 
                            type="text" 
                            value={settings.stripe.apiKey}
                            onChange={(e) => handleKeyChange('stripe', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" 
                        />
                    </div>
                    <div className="flex items-center pt-7">
                        <label htmlFor="stripeToggle" className="ms-3 text-sm font-medium text-gray-900">
                           {settings.stripe.enabled ? t('dashboard.settings.enabled') : t('dashboard.settings.disabled')}
                        </label>
                         <button
                            type="button"
                            onClick={() => handleToggle('stripe')}
                            className={`${settings.stripe.enabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ms-4`}
                            role="switch"
                            aria-checked={settings.stripe.enabled}
                        >
                            <span className={`${settings.stripe.enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSettings;