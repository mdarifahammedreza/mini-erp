import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCustomers, useCustomer, CustomerForm } from '../../features/customers';
import { Loader2 } from 'lucide-react';

export const CustomerEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateCustomer, isUpdating } = useCustomers();
  const { data: customerResponse, isLoading: isCustomerLoading } = useCustomer(id);

  const handleSubmit = async (data: any) => {
    try {
      if (id) {
        await updateCustomer({ id, data });
        navigate('/customers');
      }
    } catch (_) {
    }
  };

  if (isCustomerLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm text-slate-500">Loading customer details...</p>
      </div>
    );
  }

  const customer = customerResponse?.data;

  return (
    <div className="space-y-6 max-w-xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Edit Customer</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Modify existing customer account profile</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        {customer ? (
          <CustomerForm
            initialData={customer}
            onSubmit={handleSubmit}
            isSubmitting={isUpdating}
            onCancel={() => navigate('/customers')}
          />
        ) : (
          <div className="p-8 text-center text-red-500">Customer not found.</div>
        )}
      </div>
    </div>
  );
};

export default CustomerEditPage;
