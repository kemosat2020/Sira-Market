

import React, { useState, useEffect } from 'react';
// FIX: Add .ts extension to import path.
import { Employee, LocalizedString, AppSettings } from '../../types.ts';
import Modal from '../Modal.tsx';
import PlusIcon from '../icons/PlusIcon.tsx';
import EditIcon from '../icons/EditIcon.tsx';
import TrashIcon from '../icons/TrashIcon.tsx';
import { useTranslation } from '../../i18n/index.tsx';

interface EmployeeFormProps {
  employee?: Employee | null;
  onSubmit: (data: Omit<Employee, 'id'> | Employee) => void;
  onCancel: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSubmit, onCancel }) => {
  const { t, locale } = useTranslation();
  const [name, setName] = useState<LocalizedString>({ en: '', ar: '' });
  const [role, setRole] = useState<LocalizedString>({ en: '', ar: '' });
  const [salary, setSalary] = useState('');

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setRole(employee.role);
      setSalary(employee.salary.toString());
    } else {
      setName({ en: '', ar: '' });
      setRole({ en: '', ar: '' });
      setSalary('');
    }
  }, [employee]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const salaryValue = parseFloat(salary);
    if (!name.en || !name.ar || !role.en || !role.ar || isNaN(salaryValue) || salaryValue < 0) {
      alert('Please fill all fields correctly.');
      return;
    }
    const employeeData = { 
        name, 
        role, 
        salary: salaryValue, 
        startDate: employee?.startDate || new Date() 
    };

    if (employee) {
      onSubmit({ ...employee, ...employeeData });
    } else {
      onSubmit(employeeData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" placeholder={`${t('dashboard.employeeManagement.name')} (EN)`} value={name.en} onChange={e => setName(p => ({...p, en: e.target.value}))} className="w-full border-gray-300 rounded-md" required />
      <input type="text" placeholder={`${t('dashboard.employeeManagement.name')} (AR)`} value={name.ar} onChange={e => setName(p => ({...p, ar: e.target.value}))} className="w-full border-gray-300 rounded-md" required />
      <input type="text" placeholder={`${t('dashboard.employeeManagement.role')} (EN)`} value={role.en} onChange={e => setRole(p => ({...p, en: e.target.value}))} className="w-full border-gray-300 rounded-md" required />
      <input type="text" placeholder={`${t('dashboard.employeeManagement.role')} (AR)`} value={role.ar} onChange={e => setRole(p => ({...p, ar: e.target.value}))} className="w-full border-gray-300 rounded-md" required />
      <input type="number" placeholder={t('dashboard.employeeManagement.salary')} value={salary} onChange={e => setSalary(e.target.value)} min="0" className="w-full border-gray-300 rounded-md" required />
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">{t('general.cancel')}</button>
        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">{employee ? t('general.save') : t('dashboard.employeeManagement.add_employee')}</button>
      </div>
    </form>
  );
}


interface EmployeeManagementProps {
  employees: Employee[];
  settings: AppSettings;
  onAdd: (data: Omit<Employee, 'id'>) => void;
  onUpdate: (data: Employee) => void;
  onDelete: (id: number) => void;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ employees, settings, onAdd, onUpdate, onDelete }) => {
  const { t, locale } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.storeInfo.currency, currencyDisplay: 'symbol' }).format(amount);

  const handleAddClick = () => {
    setSelectedEmployee(null);
    setModalOpen(true);
  };
  
  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleDeleteClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteModalOpen(true);
  };
  
  const handleFormSubmit = (data: Omit<Employee, 'id'> | Employee) => {
    if ('id' in data) {
      onUpdate(data);
    } else {
      onAdd(data);
    }
    setModalOpen(false);
    setSelectedEmployee(null);
  };

  const confirmDelete = () => {
    if (selectedEmployee) {
      onDelete(selectedEmployee.id);
      setDeleteModalOpen(false);
      setSelectedEmployee(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('dashboard.employeeManagement.title')}</h1>
        <button onClick={handleAddClick} className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
          <PlusIcon className="w-5 h-5 me-2" />
          {t('dashboard.employeeManagement.add_employee')}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-start">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.employeeManagement.name')}</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.employeeManagement.role')}</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.employeeManagement.salary')}</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.employeeManagement.start_date')}</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.employeeManagement.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map(emp => (
              <tr key={emp.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.name[locale]}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.role[locale]}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">{formatCurrency(emp.salary)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(emp.startDate).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button onClick={() => handleEditClick(emp)} className="text-blue-600 hover:text-blue-900 p-1"><EditIcon className="w-5 h-5"/></button>
                  <button onClick={() => handleDeleteClick(emp)} className="text-red-600 hover:text-red-900 p-1"><TrashIcon className="w-5 h-5"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={selectedEmployee ? t('dashboard.employeeManagement.edit_employee') : t('dashboard.employeeManagement.add_employee')}>
        <EmployeeForm employee={selectedEmployee} onSubmit={handleFormSubmit} onCancel={() => setModalOpen(false)} />
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title={t('dashboard.employeeManagement.confirm_delete_title')}>
        <p>{t('dashboard.employeeManagement.confirm_delete_body', { employeeName: selectedEmployee?.name[locale] })}</p>
        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={() => setDeleteModalOpen(false)} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg">{t('general.cancel')}</button>
          <button onClick={confirmDelete} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg">{t('general.delete')}</button>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeManagement;