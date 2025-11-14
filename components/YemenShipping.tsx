
import React, { useState, useMemo } from 'react';
import { useTranslation } from '../i18n/index.tsx';
import TruckIcon from './icons/TruckIcon.tsx';

export interface YemenShippingInfo {
    name: string;
    phone: string;
    city: string;
    address: string;
    weight: number;
    totalCost: number;
}

interface YemenShippingProps {
  onSubmit: (data: YemenShippingInfo) => void;
}

const YemenShipping: React.FC<YemenShippingProps> = ({ onSubmit }) => {
    const { t, locale } = useTranslation();
    const [info, setInfo] = useState({
        name: '',
        phone: '',
        city: '',
        address: '',
        weight: '',
    });

    const FIXED_FEE = 25;
    const PER_POUND_RATE = 1.5;

    const { weightFee, totalCost } = useMemo(() => {
        const weightValue = parseFloat(info.weight) || 0;
        if (weightValue > 0) {
            const calculatedWeightFee = weightValue * PER_POUND_RATE;
            return {
                weightFee: calculatedWeightFee,
                totalCost: FIXED_FEE + calculatedWeightFee
            };
        }
        return { weightFee: 0, totalCost: FIXED_FEE };
    }, [info.weight]);

    const yemenCities = [
        { en: 'Sana\'a', ar: 'صنعاء' },
        { en: 'Aden', ar: 'عدن' },
        { en: 'Taiz', ar: 'تعز' },
        { en: 'Hodeidah', ar: 'الحديدة' },
        { en: 'Ibb', ar: 'إب' },
        { en: 'Dhamar', ar: 'ذمار' },
        { en: 'Mukalla', ar: 'المكلا' },
        { en: 'Say\'un', ar: 'سيئون' },
        { en: 'Zinjibar', ar: 'زنجبار' },
        { en: 'Al Hudaydah', ar: 'البيضاء' },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInfo(prev => ({...prev, [name]: value}));
    };

    const isFormValid = useMemo(() => {
        const weightValue = parseFloat(info.weight) || 0;
        return info.name.trim() !== '' && info.phone.trim() !== '' && info.city.trim() !== '' && info.address.trim() !== '' && weightValue > 0;
    }, [info]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            onSubmit({
                name: info.name,
                phone: info.phone,
                city: info.city,
                address: info.address,
                weight: parseFloat(info.weight) || 0,
                totalCost: totalCost
            });
        }
    };

    return (
        <div className="container mx-auto max-w-2xl py-8">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <div className="text-center mb-6">
                    <TruckIcon className="w-12 h-12 mx-auto text-blue-500"/>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">{t('yemenShipping.title')}</h1>
                    <p className="text-gray-500">{t('yemenShipping.subtitle')}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('yemenShipping.fullName')}</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={info.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t('yemenShipping.phone')}</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={info.phone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">{t('yemenShipping.city')}</label>
                        <select
                            id="city"
                            name="city"
                            value={info.city}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="" disabled>{t('yemenShipping.selectCity')}</option>
                            {yemenCities.map(city => (
                                <option key={city.en} value={locale === 'ar' ? city.ar : city.en}>
                                    {locale === 'ar' ? city.ar : city.en}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">{t('yemenShipping.address')}</label>
                        <textarea
                            id="address"
                            name="address"
                            value={info.address}
                            onChange={handleInputChange}
                            rows={3}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700">{t('yemenShipping.weight_lbs')}</label>
                        <input
                            type="number"
                            id="weight"
                            name="weight"
                            value={info.weight}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 12.5"
                            min="0.1"
                            step="0.1"
                            required
                        />
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('yemenShipping.shipping_cost_calculation')}</h3>
                        <p className="text-sm text-gray-500 mb-3">{t('yemenShipping.cost_note')}</p>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">{t('yemenShipping.fixed_fee')}:</span>
                                <span className="font-medium text-gray-800">${FIXED_FEE.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">{t('yemenShipping.weight_fee')}:</span>
                                <span className="font-medium text-gray-800">${weightFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                                <span className="text-gray-800">{t('yemenShipping.total_cost')}:</span>
                                <span>${totalCost.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                     <button
                        type="submit"
                        disabled={!isFormValid}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
                     >
                        {t('yemenShipping.submit')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default YemenShipping;
