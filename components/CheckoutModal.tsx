



import React, { useState, useMemo, useEffect } from 'react';
// FIX: Add .ts extension to import path.
import { CartItem, AppSettings, ShippingInfo, ShippingMethod, OrderPaymentMethod, Customer } from '../types.ts';
import XIcon from './icons/XIcon.tsx';
import PaypalIcon from './icons/PaypalIcon.tsx';
import StripeIcon from './icons/StripeIcon.tsx';
import SpinnerIcon from './icons/SpinnerIcon.tsx';
import CreditCardIcon from './icons/CreditCardIcon.tsx';
import CashIcon from './icons/CashIcon.tsx';
import StarIcon from './icons/StarIcon.tsx';
import { useTranslation } from '../i18n/index.tsx';

interface CheckoutModalProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  settings: AppSettings;
  currentUser: Customer | null;
  onClose: () => void;
  onPlaceOrder: (shippingInfo: ShippingInfo, shippingCost: number, paymentMethod: OrderPaymentMethod, pointsToRedeem: number) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ items, subtotal, tax, settings, currentUser, onClose, onPlaceOrder }) => {
  const { t, locale } = useTranslation();
  const [step, setStep] = useState(1);
  const [paymentView, setPaymentView] = useState<'options' | 'stripe'>('options');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '', address: '', city: '', state: '', zip: ''
  });
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod | null>(null);
  const [redeemPoints, setRedeemPoints] = useState(false);

  useEffect(() => {
    if (currentUser?.shippingInfo) {
      setShippingInfo(currentUser.shippingInfo);
    }
  }, [currentUser]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };
  
  const isShippingFormValid = useMemo(() => {
    // Fix: Add type check for field before calling trim()
    return Object.values(shippingInfo).every(field => typeof field === 'string' && field.trim() !== '');
  }, [shippingInfo]);
  
  const availableShippingMethods = useMemo(() => {
    return settings.shippingMethods.filter(method => {
      if (method.enabled === false) {
          return false;
      }
      if (method.threshold) {
        return subtotal >= method.threshold;
      }
      return true;
    }).sort((a,b) => a.cost - b.cost);
  }, [settings.shippingMethods, subtotal]);

  const shippingCost = selectedShippingMethod?.cost || 0;
  
  const totalBeforePoints = subtotal + tax + shippingCost;

  const { pointsToRedeem, pointsDiscount } = useMemo(() => {
    if (!redeemPoints || !currentUser || currentUser.loyaltyPoints <= 0) {
      return { pointsToRedeem: 0, pointsDiscount: 0 };
    }
    const maxDiscount = totalBeforePoints;
    const maxPointsToUseForDiscount = Math.floor(maxDiscount / settings.loyaltySettings.dollarsPerPoint);
    const pointsToRedeem = Math.min(currentUser.loyaltyPoints, maxPointsToUseForDiscount);
    const pointsDiscount = pointsToRedeem * settings.loyaltySettings.dollarsPerPoint;
    return { pointsToRedeem, pointsDiscount };
  }, [redeemPoints, currentUser, totalBeforePoints, settings.loyaltySettings]);

  const finalTotal = totalBeforePoints - pointsDiscount;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.storeInfo.currency, currencyDisplay: 'symbol' }).format(amount);
  };
  
  const handleNextStep = () => {
    if (step === 1 && isShippingFormValid) {
        setSelectedShippingMethod(availableShippingMethods[0] || null);
        setStep(2);
    } else if (step === 2 && selectedShippingMethod) {
        setStep(3);
    }
  };

  const processOrder = (paymentMethod: OrderPaymentMethod) => {
    if (selectedShippingMethod) {
      setIsProcessing(true);
      setTimeout(() => {
        onPlaceOrder(shippingInfo, selectedShippingMethod.cost, paymentMethod, pointsToRedeem);
        // No need to set isProcessing(false) as the modal will close.
      }, 2000);
    }
  };
  
  const handleBack = () => {
    if (step === 3 && paymentView !== 'options') {
      setPaymentView('options');
    } else if (step > 1) {
      setStep(s => s - 1);
    }
  };

  const renderStep = () => {
    if (isProcessing) {
      return (
        <div className="flex flex-col items-center justify-center h-48">
            <SpinnerIcon className="w-12 h-12 text-blue-600" />
            <p className="mt-4 text-lg font-semibold text-gray-700">{t('checkoutModal.processing_payment')}</p>
        </div>
      );
    }

    switch (step) {
      case 1: // Shipping Info
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('checkoutModal.shipping_info')}</h3>
            <div className="space-y-3">
                <input type="text" name="name" placeholder={t('checkoutModal.full_name')} value={shippingInfo.name} onChange={handleInputChange} className="w-full border-gray-300 rounded-md" />
                <input type="text" name="address" placeholder={t('checkoutModal.address')} value={shippingInfo.address} onChange={handleInputChange} className="w-full border-gray-300 rounded-md" />
                <div className="grid grid-cols-3 gap-2">
                    <input type="text" name="city" placeholder={t('checkoutModal.city')} value={shippingInfo.city} onChange={handleInputChange} className="w-full border-gray-300 rounded-md" />
                    <input type="text" name="state" placeholder={t('checkoutModal.state')} value={shippingInfo.state} onChange={handleInputChange} className="w-full border-gray-300 rounded-md" />
                    <input type="text" name="zip" placeholder={t('checkoutModal.zip')} value={shippingInfo.zip} onChange={handleInputChange} className="w-full border-gray-300 rounded-md" />
                </div>
            </div>
            <button onClick={handleNextStep} disabled={!isShippingFormValid} className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                {t('checkoutModal.next')}
            </button>
          </div>
        );
      case 2: // Shipping Method
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('checkoutModal.shipping_method')}</h3>
            <div className="space-y-3">
              {availableShippingMethods.map(method => (
                <div key={method.id} onClick={() => setSelectedShippingMethod(method)}
                  className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer ${selectedShippingMethod?.id === method.id ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'}`}>
                  <span className="font-semibold text-gray-700">{method.label}</span>
                  <span className="font-bold text-gray-800">{formatCurrency(method.cost)}</span>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mt-6">
                <div className="flex justify-between text-sm"><span className="text-gray-600">{t('cart.subtotal')}:</span><span className="font-medium">{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">{t('cart.tax')}:</span><span className="font-medium">{formatCurrency(tax)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">{t('receipt.shipping')}:</span><span className="font-medium">{formatCurrency(shippingCost)}</span></div>
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t"><span className="text-gray-800">{t('cart.total')}:</span><span>{formatCurrency(totalBeforePoints)}</span></div>
            </div>
             <button onClick={handleNextStep} disabled={!selectedShippingMethod} className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                {t('checkoutModal.continue_to_payment')}
            </button>
          </div>
        );
      case 3: // Payment
        if (paymentView === 'stripe') {
            return (
                 <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><CreditCardIcon className="w-6 h-6"/> {t('checkoutModal.card_info')}</h3>
                    <form onSubmit={(e) => { e.preventDefault(); processOrder('Credit Card'); }} className="space-y-3">
                         <div className="p-3 border rounded-lg">
                           <label className="text-xs text-gray-500">{t('checkoutModal.card_number')}</label>
                           <input type="text" placeholder="•••• •••• •••• ••••" className="w-full border-0 p-0 text-lg focus:ring-0" required />
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 border rounded-lg">
                                <label className="text-xs text-gray-500">{t('checkoutModal.expiry_date')}</label>
                                <input type="text" placeholder="MM / YY" className="w-full border-0 p-0 focus:ring-0" required />
                            </div>
                            <div className="p-3 border rounded-lg">
                                <label className="text-xs text-gray-500">CVC</label>
                                <input type="text" placeholder="•••" className="w-full border-0 p-0 focus:ring-0" required />
                            </div>
                         </div>
                         <button type="submit" className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">
                           {t('checkoutModal.pay')} {formatCurrency(finalTotal)}
                        </button>
                    </form>
                </div>
            );
        }
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">{t('checkoutModal.payment')}</h3>

            {currentUser && currentUser.loyaltyPoints > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-yellow-800 flex items-center gap-2">
                      <StarIcon className="w-5 h-5 text-yellow-500"/>
                      {t('checkoutModal.loyalty_points')}
                    </p>
                    <p className="text-sm text-yellow-700">
                      {t('checkoutModal.you_have_points', { count: currentUser.loyaltyPoints.toLocaleString('en-US') })}
                    </p>
                  </div>
                   <input 
                    type="checkbox"
                    id="redeemPoints"
                    checked={redeemPoints}
                    onChange={(e) => setRedeemPoints(e.target.checked)}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between text-sm"><span className="text-gray-600">{t('cart.subtotal')}:</span><span className="font-medium">{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">{t('receipt.shipping')}:</span><span className="font-medium">{formatCurrency(shippingCost)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">{t('cart.tax')}:</span><span className="font-medium">{formatCurrency(tax)}</span></div>
                {pointsDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                        <span className="font-medium">{t('checkoutModal.points_discount')}:</span>
                        <span className="font-medium">-{formatCurrency(pointsDiscount)}</span>
                    </div>
                )}
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t"><span className="text-gray-800">{t('cart.total')}:</span><span>{formatCurrency(finalTotal)}</span></div>
            </div>

            <div className="space-y-3">
                {settings.paymentSettings.stripe.enabled && (
                    <button onClick={() => setPaymentView('stripe')} className="w-full flex items-center justify-center gap-3 bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800">
                        <StripeIcon className="w-12" /> {t('checkoutModal.pay_with_card')}
                    </button>
                )}
                {settings.paymentSettings.paypal.enabled && (
                    <button onClick={() => processOrder('PayPal')} className="w-full flex items-center justify-center gap-3 bg-[#00457C] text-white font-bold py-3 rounded-lg hover:bg-[#003057]">
                        <PaypalIcon className="w-16" />
                    </button>
                )}
                <button onClick={() => processOrder('Cash on Delivery')} className="w-full flex items-center justify-center gap-3 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">
                    <CashIcon className="w-6 h-6" />
                    {t('checkoutModal.cod')}
                </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
          {(step > 1 || paymentView !== 'options') && <button onClick={handleBack} className="text-sm font-semibold text-blue-600">{t('checkoutModal.back')}</button>}
          <div className="flex-grow"></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        {renderStep()}
      </div>
      <style>{`
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CheckoutModal;