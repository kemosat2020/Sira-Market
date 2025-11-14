
import React, { useRef } from 'react';
// FIX: Add .ts extension to import path.
import { Order, AppSettings } from '../types.ts';
// FIX: Add .tsx extension to import path.
import Modal from './Modal.tsx';
// FIX: Add .tsx extension to import path.
import Receipt from './Receipt.tsx';
// FIX: Add .tsx extension to import path.
import PrintIcon from './icons/PrintIcon.tsx';
import { useTranslation } from '../i18n/index.tsx';

interface PrintPreviewModalProps {
  order: Order | null;
  onClose: () => void;
  settings: AppSettings;
}

const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({ order, onClose, settings }) => {
  const { t } = useTranslation();
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!receiptRef.current) return;
    
    const printWindow = window.open('', '_blank', 'height=600,width=400');
    if (printWindow) {
      const receiptContent = receiptRef.current.innerHTML;
      printWindow.document.write('<html><head><title>Receipt</title>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(receiptContent);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  if (!order) return null;

  return (
    <Modal isOpen={true} onClose={onClose} title={t('printPreview.title', { orderId: order.id })}>
      <div className="max-h-[60vh] overflow-y-auto bg-gray-100 p-4">
        <div ref={receiptRef}>
          <Receipt order={order} settings={settings.printerSettings.receipt} storeInfo={settings.storeInfo} />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PrintIcon className="w-5 h-5" />
          {t('printPreview.print')}
        </button>
      </div>
    </Modal>
  );
};

export default PrintPreviewModal;