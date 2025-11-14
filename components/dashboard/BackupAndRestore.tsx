
import React, { useRef, useState } from 'react';
import { AppSettings, Product, Order, Employee, Customer, Category } from '../../types.ts';
import { useTranslation } from '../../i18n/index.tsx';
import DownloadIcon from '../icons/DownloadIcon.tsx';
import UploadIcon from '../icons/UploadIcon.tsx';
import ArchiveBoxIcon from '../icons/ArchiveBoxIcon.tsx';
import Modal from '../Modal.tsx';

interface BackupData {
    products: Product[];
    categories: Category[];
    orders: Order[];
    employees: Employee[];
    customers: Customer[];
    settings: AppSettings;
}

interface BackupAndRestoreProps {
    backupData: BackupData;
    onRestore: (data: BackupData) => void;
    showToast: (message: string, type?: 'success' | 'error') => void;
}

const BackupAndRestore: React.FC<BackupAndRestoreProps> = ({ backupData, onRestore, showToast }) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isRestoreModalOpen, setRestoreModalOpen] = useState(false);
    const [fileToRestore, setFileToRestore] = useState<File | null>(null);

    const handleDownloadBackup = () => {
        const fullBackup = {
            version: 1,
            timestamp: new Date().toISOString(),
            data: backupData,
        };
        const jsonString = JSON.stringify(fullBackup, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const date = new Date().toISOString().split('T')[0];
        a.download = `pos-backup-${date}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileToRestore(file);
            setRestoreModalOpen(true);
        }
    };
    
    const handleConfirmRestore = () => {
        if (!fileToRestore) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const parsedData = JSON.parse(text);

                // Basic validation
                if (parsedData && parsedData.data && parsedData.data.products && parsedData.data.settings) {
                    onRestore(parsedData.data);
                } else {
                    throw new Error("Invalid backup file structure.");
                }
            } catch (error) {
                console.error("Restore error:", error);
                showToast(t('toasts.restoreError'), 'error');
            } finally {
                setRestoreModalOpen(false);
                setFileToRestore(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };
        reader.onerror = () => {
             showToast(t('toasts.restoreError'), 'error');
             if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };
        reader.readAsText(fileToRestore);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                <ArchiveBoxIcon className="w-6 h-6 me-3 text-gray-500" />
                {t('dashboard.settings.backup_restore_title')}
            </h2>
            <p className="text-sm text-gray-500 mb-6">{t('dashboard.settings.backup_restore_desc')}</p>
            <div className="flex flex-wrap gap-4">
                <button
                    onClick={handleDownloadBackup}
                    className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <DownloadIcon className="w-5 h-5 me-2" />
                    {t('dashboard.settings.download_backup')}
                </button>
                <input
                    type="file"
                    accept=".json"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                    <UploadIcon className="w-5 h-5 me-2" />
                    {t('dashboard.settings.restore_backup')}
                </button>
            </div>
             <Modal isOpen={isRestoreModalOpen} onClose={() => setRestoreModalOpen(false)} title={t('dashboard.settings.restore_confirm_title')}>
               <p>{t('dashboard.settings.restore_confirm_body')}</p>
               <div className="flex justify-end space-x-3 mt-6">
                    <button type="button" onClick={() => setRestoreModalOpen(false)} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">{t('general.cancel')}</button>
                    <button type="button" onClick={handleConfirmRestore} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">{t('dashboard.settings.restore_backup')}</button>
                </div>
           </Modal>
        </div>
    );
};

export default BackupAndRestore;
