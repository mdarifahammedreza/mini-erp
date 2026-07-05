import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts, useProduct, ProductForm } from '../../features/products';
import { Loader2 } from 'lucide-react';

export const ProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories, updateProduct, isUpdating } = useProducts();
  const { data: productResponse, isLoading: isProductLoading } = useProduct(id);

  const handleSubmit = async (formData: FormData) => {
    try {
      if (id) {
        await updateProduct({ id, formData });
        navigate('/products');
      }
    } catch (_) {
    }
  };

  if (isProductLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm text-slate-500">Loading product details...</p>
      </div>
    );
  }

  const product = productResponse?.data;

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Edit Product</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Modify existing product inventory details</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        {product ? (
          <ProductForm
            initialData={product}
            categories={categories}
            onSubmit={handleSubmit}
            isSubmitting={isUpdating}
            onCancel={() => navigate('/products')}
          />
        ) : (
          <div className="p-8 text-center text-red-500">Product not found.</div>
        )}
      </div>
    </div>
  );
};

export default ProductEditPage;
