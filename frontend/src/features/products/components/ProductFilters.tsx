import React from 'react';
import type { Category } from '../types/product.types';
import { Search } from 'lucide-react';

interface ProductFiltersProps {
  categories: Category[];
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  search,
  onSearchChange,
  category,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search products by name or SKU..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition"
        />
      </div>

      <div className="w-full sm:w-64">
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition text-slate-700 dark:text-slate-300"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
