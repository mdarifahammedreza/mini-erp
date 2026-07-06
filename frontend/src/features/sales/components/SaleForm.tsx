import React from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { saleSchema, type SaleInput } from '../schemas/sale.schema';
import type { Customer } from '../../customers/types/customer.types';
import type { Product } from '../../products/types/product.types';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface SaleFormProps {
  customers: Customer[];
  products: Product[];
  onSubmit: (data: SaleInput) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const SaleForm: React.FC<SaleFormProps> = ({
  customers,
  products,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      customer: '',
      items: [{ product: '', quantity: 1 }],
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = useWatch({
    control,
    name: 'items',
  });

  const calculation = React.useMemo(() => {
    let total = 0;
    const computedItems = (watchedItems || []).map((item) => {
      const prod = products.find((p) => (p.id || p._id) === item?.product);
      const price = prod ? prod.unitPrice : 0;
      const qty = Number(item?.quantity) || 0;
      const subtotal = price * qty;
      total += subtotal;
      return { price, subtotal };
    });

    return { total, computedItems };
  }, [watchedItems, products]);

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values as SaleInput))} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Select Customer</label>
          <select
            {...register('customer')}
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Select a customer...</option>
            {customers.map((cust) => (
              <option key={cust.id || cust._id} value={cust.id || cust._id}>
                {cust.name} ({cust.email})
              </option>
            ))}
          </select>
          {errors.customer && <p className="text-xs text-red-500 mt-1">{errors.customer.message}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <h3 className="font-semibold text-slate-800 dark:text-white">Sale Products</h3>
          <button
            type="button"
            onClick={() => append({ product: '', quantity: 1 })}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item Row</span>
          </button>
        </div>

        {fields.map((field, index) => {
          const computed = calculation.computedItems[index] || { price: 0, subtotal: 0 };

          return (
            <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-slate-50/50 dark:bg-slate-950/10 p-4 border border-slate-100 dark:border-slate-900 rounded-xl relative group">
              <div className="flex-1 space-y-1 w-full">
                <select
                  {...register(`items.${index}.product` as const)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Choose product...</option>
                  {products.map((prod) => (
                    <option key={prod.id || prod._id} value={prod.id || prod._id} disabled={prod.stockQuantity <= 0}>
                      {prod.name} (SKU: {prod.sku}) — In Stock: {prod.stockQuantity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-24 text-sm font-medium text-slate-500 text-right sm:text-center self-center">
                ${computed.price.toFixed(2)}
              </div>

              <div className="w-32 space-y-1">
                <input
                  type="number"
                  placeholder="Qty"
                  {...register(`items.${index}.quantity` as const)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="w-28 text-right font-semibold text-slate-900 dark:text-white self-center">
                ${computed.subtotal.toFixed(2)}
              </div>

              <button
                type="button"
                disabled={fields.length === 1}
                onClick={() => remove(index)}
                className="p-2 text-slate-400 hover:text-red-500 rounded-lg disabled:opacity-30 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
        {errors.items && <p className="text-xs text-red-500">{errors.items.root?.message || errors.items.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Sale Notes / Remarks</label>
        <textarea
          rows={2}
          {...register('notes')}
          placeholder="Enter payment reference or special instructions..."
          className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        {errors.notes && <p className="text-xs text-red-500 mt-1">{errors.notes.message}</p>}
      </div>

      <div className="bg-slate-100 dark:bg-slate-900/50 p-6 rounded-xl flex items-center justify-between">
        <span className="text-lg font-semibold text-slate-600 dark:text-slate-400">Total Transaction Amount</span>
        <span className="text-3xl font-black text-blue-600 dark:text-blue-400">${calculation.total.toFixed(2)}</span>
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
          className="flex items-center space-x-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Record Sale Transaction</span>
        </button>
      </div>
    </form>
  );
};
