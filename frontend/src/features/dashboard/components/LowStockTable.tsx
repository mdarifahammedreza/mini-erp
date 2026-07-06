import React from 'react';
import { AlertCircle } from 'lucide-react';

interface LowStockTableProps {
  products: any[];
}

export const LowStockTable: React.FC<LowStockTableProps> = ({ products }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center">
          <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
          Low Stock Warning
        </h3>
        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          {products.length} items
        </span>
      </div>

      {products.length === 0 ? (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
          No low stock products. All inventory levels are healthy!
        </div>
      ) : (
        <div className="overflow-auto max-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 shadow-sm">
              <tr className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3 text-right">In Stock</th>
                <th className="px-6 py-3 text-right">Min Threshold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition duration-150">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{product.name}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{product.sku}</td>
                  <td className="px-6 py-4">
                    {product.category ? (typeof product.category === 'string' ? product.category : product.category.name) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-red-600 dark:text-red-400">
                    {product.stockQuantity}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500">
                    5
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
