import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts, ProductForm } from '../../features/products';

export const ProductCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { categories, createProduct, isCreating } = useProducts();

  const handleSubmit = async (formData: FormData) => {
    try {
      await createProduct(formData);
      navigate('/products');
    } catch (_) {
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Create New Product</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Add a new item to your inventory catalog</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <ProductForm
          categories={categories}
          onSubmit={handleSubmit}
          isSubmitting={isCreating}
          onCancel={() => navigate('/products')}
        />
      </div>
    </div>
  );
};

export default ProductCreatePage;
