import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductInput } from '../schemas/product.schema';
import type { Product, Category } from '../types/product.types';
import { Loader2, Upload } from 'lucide-react';
import { API_BASE_URL } from '../../../constants/config';

interface ProductFormProps {
  initialData?: Product;
  categories: Category[];
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(initialData?.imageUrl || null);

  const defaultCategory = initialData?.category
    ? typeof initialData.category === 'string'
      ? initialData.category
      : initialData.category.id || (initialData.category as any)._id
    : '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      sku: initialData?.sku || '',
      description: initialData?.description || '',
      category: defaultCategory,
      unitPrice: initialData?.unitPrice || 0,
      stockQuantity: initialData?.stockQuantity || 0,
      minStockThreshold: initialData?.minStockThreshold || 5,
      isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = (values: ProductInput) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      formData.append(key, String(val));
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit((values) => handleFormSubmit(values as ProductInput))} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Product Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">SKU</label>
          <input
            type="text"
            {...register('sku')}
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Category</label>
          <select
            {...register('category')}
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id || cat._id} value={cat.id || cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Unit Price ($)</label>
          <input
            type="number"
            step="0.01"
            {...register('unitPrice')}
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {errors.unitPrice && <p className="text-xs text-red-500 mt-1">{errors.unitPrice.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Stock Quantity</label>
          <input
            type="number"
            {...register('stockQuantity')}
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {errors.stockQuantity && <p className="text-xs text-red-500 mt-1">{errors.stockQuantity.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Minimum Stock Threshold</label>
          <input
            type="number"
            {...register('minStockThreshold')}
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {errors.minStockThreshold && <p className="text-xs text-red-500 mt-1">{errors.minStockThreshold.message}</p>}
        </div>

        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Description</label>
          <textarea
            rows={3}
            {...register('description')}
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
        </div>

        <div className="col-span-1 md:col-span-2 flex items-center space-x-3 pt-2">
          <input
            type="checkbox"
            id="isActive"
            {...register('isActive')}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Product is Active
          </label>
        </div>

        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Product Image</label>
          <div className="flex items-center space-x-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50/50 dark:bg-slate-950/20">
            <div className="relative w-24 h-24 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
              {imagePreview ? (
                <img
                  src={imagePreview.startsWith('blob:') ? imagePreview : `${API_BASE_URL.replace('/api/v1', '')}${imagePreview}`}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Upload className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <div className="space-y-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="product-image-upload"
              />
              <label
                htmlFor="product-image-upload"
                className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-50 transition"
              >
                Choose Image File
              </label>
              <p className="text-xs text-slate-400">JPEG, PNG, or WEBP. Max 2MB.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{initialData ? 'Update Product' : 'Create Product'}</span>
        </button>
      </div>
    </form>
  );
};
