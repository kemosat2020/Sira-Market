
import React, { useState } from 'react';
import Modal from './Modal.tsx';
import { useTranslation } from '../i18n/index.tsx';

interface DashboardLoginModalProps {
  onClose: () => void;
  onLogin: (username: string, pass: string) => boolean;
}

const DashboardLoginModal: React.FC<DashboardLoginModalProps> = ({ onClose, onLogin }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(username, password);
    if (!success) {
      setError(t('dashboardLogin.loginFailure'));
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={t('dashboardLogin.title')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">{t('dashboardLogin.username')}</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          {t('dashboardLogin.login')}
        </button>
      </form>
    </Modal>
  );
};

export default DashboardLoginModal;
