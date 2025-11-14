import React from 'react';
import { useTranslation } from '../i18n/index.tsx';
import BillIcon from './icons/BillIcon.tsx';

const ServiceCard: React.FC<{ serviceName: string; onClick?: () => void }> = ({ serviceName, onClick }) => (
    <button
        onClick={onClick}
        className="w-full text-center bg-white rounded-xl shadow-md p-6 hover:shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-1"
    >
        <h3 className="text-lg font-bold text-gray-800">{serviceName}</h3>
    </button>
);

const BillPayments: React.FC = () => {
    const { t } = useTranslation();

    const services = [
        t('billPayments.att'),
        t('billPayments.verizon'),
        t('billPayments.tmobile'),
        t('billPayments.xfinityMobile'),
        t('billPayments.boostMobile'),
        t('billPayments.totalWireless'),
        t('billPayments.h2o'),
        t('billPayments.comcast'),
        t('billPayments.powerAndGas'),
    ];

    const handleServiceClick = (service: string) => {
        // In a real application, this would navigate to a specific payment flow for the service
        alert(`Navigating to payment for: ${service}`);
    };

    return (
        <div className="container mx-auto max-w-4xl py-8">
            <div className="text-center mb-8">
                <BillIcon className="w-16 h-16 mx-auto text-blue-500" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">{t('billPayments.title')}</h1>
                <p className="text-gray-500 mt-2">{t('billPayments.subtitle')}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {services.map((service) => (
                    <ServiceCard key={service} serviceName={service} onClick={() => handleServiceClick(service)} />
                ))}
            </div>
        </div>
    );
};

export default BillPayments;
