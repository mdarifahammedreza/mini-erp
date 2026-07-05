import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers, CustomerForm } from '../../features/customers';

export const CustomerCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { createCustomer, isCreating } = useCustomers();

  const handleSubmit = async (data: any) => {
    try {
      await createCustomer(data);
      navigate('/customers');
    } catch (_) {
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Add Customer</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Register a new customer account profile</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <CustomerForm
          onSubmit={handleSubmit}
          isSubmitting={isCreating}
          onCancel={() => navigate('/customers')}
        />
      </div>
    </div>
  );
};

export default CustomerCreatePage;
