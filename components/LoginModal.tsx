
import React, { useState } from 'react';
import Modal from './Modal.tsx';
import { useTranslation } from '../i18n/index.tsx';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (email: string, pass: string) => boolean;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin, onSwitchToRegister }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(email, password);
    if (!success) {
      setError(t('toasts.loginFailure'));
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={t('header.login')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('loginModal.email')}</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password">{t('loginModal.password')}</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
          {t('header.login')}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        {t('loginModal.no_account')}
        <button onClick={onSwitchToRegister} className="font-medium text-blue-600 hover:text-blue-500 ms-1">
          {t('header.register')}
        </button>
      </p>
    </Modal>
  );
};

export default LoginModal;
