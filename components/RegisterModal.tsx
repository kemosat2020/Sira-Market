
import React, { useState } from 'react';
import Modal from './Modal.tsx';
import { useTranslation } from '../i18n/index.tsx';

interface RegisterModalProps {
  onClose: () => void;
  onRegister: (name: string, email: string, pass: string) => boolean;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onRegister, onSwitchToLogin }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onRegister(name, email, password);
    if (!success) {
      setError(t('toasts.emailExists'));
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={t('header.register')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('checkoutModal.full_name')}</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700">{t('loginModal.email')}</label>
          <input
            type="email"
            id="reg-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="reg-password">{t('loginModal.password')}</label>
          <input
            type="password"
            id="reg-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
          {t('header.register')}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        {t('registerModal.has_account')}
        <button onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:text-blue-500 ms-1">
          {t('header.login')}
        </button>
      </p>
    </Modal>
  );
};

export default RegisterModal;
