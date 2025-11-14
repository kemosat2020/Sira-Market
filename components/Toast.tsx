import React, { useEffect, useState } from 'react';
import CheckCircleIcon from './icons/CheckCircleIcon';
import ExclamationIcon from './icons/ExclamationIcon';
import XIcon from './icons/XIcon';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  show: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, show, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for fade-out animation
  };

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const Icon = type === 'success' ? CheckCircleIcon : ExclamationIcon;

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 transform transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
      } ${bgColor} text-white py-3 px-5 rounded-lg shadow-lg z-50 flex items-center space-x-3`}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      <Icon className="w-6 h-6" />
      <span>{message}</span>
      <button onClick={handleClose} className="ms-auto -me-2 p-1">
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast;
