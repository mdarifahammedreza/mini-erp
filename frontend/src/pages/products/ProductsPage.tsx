import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../features/products';
import { useAuthStore } from '../../store/auth.store';
import { ProductFilters } from '../../features/products';
import { Loader2, Plus, Edit, Trash2, ChevronLeft, ChevronRight, PackageOpen } from 'lucide-react';
import { API_BASE_URL } from '../../constants/config';

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuthStore();
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [page, setPage] = React.useState(1);

  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const { products, pagination, categories, isLoading, deleteProduct } = useProducts({
    page,
    limit: 10,
    search: debouncedSearch,
    category,
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Products Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">View and manage inventory stocks</p>
        </div>

        {hasPermission('products.create') && (
          <button
            onClick={() => navigate('/products/create')}
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-md shadow-blue-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        )}
      </div>

      <ProductFilters
        categories={categories}
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={(val) => {
          setCategory(val);
          setPage(1);
        }}
      />

      {isLoading ? (
        <div className="h-96 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm text-slate-500">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-16 text-center space-y-4 shadow-sm">
          <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-full w-fit mx-auto text-slate-400">
            <PackageOpen className="w-12 h-12" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-slate-950 dark:text-white text-lg">No Products Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              There are no products matching your search criteria. Try modifying your filters or add a new product.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/40 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Product</th>
                  <th className="px-6 py-3.5">SKU</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5 text-right">Price</th>
                  <th className="px-6 py-3.5 text-right">Stock</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  {(hasPermission('products.update') || hasPermission('products.delete')) && (
                    <th className="px-6 py-3.5 text-center">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                {products.map((product) => {
                  const isLowStock = product.stockQuantity <= product.minStockThreshold;
                  return (
                    <tr key={product._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700">
                            {product.imageUrl ? (
                              <img
                                src={`${API_BASE_URL.replace('/api/v1', '')}${product.imageUrl}`}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold bg-slate-100 text-xs">
                                N/A
                              </div>
                            )}
                          </div>
                          <span className="truncate max-w-xs">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">{product.sku}</td>
                      <td className="px-6 py-4">
                        {product.category ? (typeof product.category === 'string' ? product.category : product.category.name) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold">
                        ${product.unitPrice.toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 text-right font-semibold ${isLowStock ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                        {product.stockQuantity}
                        {isLowStock && <span className="text-[10px] ml-1 text-red-500 font-medium block">Low Stock</span>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            product.isActive
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      {(hasPermission('products.update') || hasPermission('products.delete')) && (
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            {hasPermission('products.update') && (
                              <button
                                onClick={() => navigate(`/products/edit/${product._id}`)}
                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
                                title="Edit Product"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            {hasPermission('products.delete') && (
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-slate-500 hover:text-red-600 transition"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
              <span className="text-sm text-slate-500">
                Page {pagination.page} of {pagination.pages} ({pagination.total} total items)
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
                  disabled={page === pagination.pages}
                  className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
