import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSales, SaleForm } from '../../features/sales';
import { useCustomers } from '../../features/customers';
import { useProducts } from '../../features/products';
import { Loader2 } from 'lucide-react';

export const SaleCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { createSale, isCreating } = useSales();

  const { customers, isLoading: isCustomersLoading } = useCustomers({ limit: 100 });
  const { products, isLoading: isProductsLoading } = useProducts({ limit: 100 });

  const handleSubmit = async (data: any) => {
    try {
      await createSale(data);
      navigate('/sales');
    } catch (_) {
    }
  };

  const isLoading = isCustomersLoading || isProductsLoading;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Record Sale Transaction</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Deduct product stock and create a customer invoice receipt</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        {isLoading ? (
          <div className="h-48 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm text-slate-500">Loading catalog references...</p>
          </div>
        ) : (
          <SaleForm
            customers={customers}
            products={products}
            onSubmit={handleSubmit}
            isSubmitting={isCreating}
            onCancel={() => navigate('/sales')}
          />
        )}
      </div>
    </div>
  );
};

export default SaleCreatePage;
