import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../features/products';
import { useAuthStore } from '../../store/auth.store';
import { ProductFilters } from '../../features/products';
import {
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  Package,
  Tag,
  Hash,
  DollarSign,
  Boxes,
  Activity,
  Settings2,
} from 'lucide-react';
import { API_BASE_URL } from '../../constants/config';

// ─── Skeleton Row ─────────────────────────────────────────────────────────────
const SkeletonRow: React.FC<{ index: number }> = ({ index }) => (
  <tr
    className="border-b border-slate-100 dark:border-slate-800/60"
    style={{ animationDelay: `${index * 0.07}s` }}
  >
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse flex-shrink-0" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-36 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-2.5 w-20 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
    </td>
    <td className="px-6 py-4 text-right">
      <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-700 animate-pulse ml-auto" />
    </td>
    <td className="px-6 py-4 text-right">
      <div className="h-3 w-12 rounded bg-slate-200 dark:bg-slate-700 animate-pulse ml-auto" />
    </td>
    <td className="px-6 py-4 text-center">
      <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse mx-auto" />
    </td>
    <td className="px-6 py-4 text-center">
      <div className="flex items-center justify-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-7 w-7 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>
    </td>
  </tr>
);

// ─── Table Header ─────────────────────────────────────────────────────────────
const TableHeader: React.FC<{ showActions: boolean }> = ({ showActions }) => (
  <thead>
    <tr className="bg-slate-900 dark:bg-slate-950 text-slate-400 text-xs uppercase tracking-widest">
      <th className="px-6 py-4 font-semibold">
        <span className="flex items-center gap-2"><Package className="w-3.5 h-3.5" />Product</span>
      </th>
      <th className="px-6 py-4 font-semibold">
        <span className="flex items-center gap-2"><Hash className="w-3.5 h-3.5" />SKU</span>
      </th>
      <th className="px-6 py-4 font-semibold">
        <span className="flex items-center gap-2"><Tag className="w-3.5 h-3.5" />Category</span>
      </th>
      <th className="px-6 py-4 font-semibold text-right">
        <span className="flex items-center gap-2 justify-end"><DollarSign className="w-3.5 h-3.5" />Price</span>
      </th>
      <th className="px-6 py-4 font-semibold text-right">
        <span className="flex items-center gap-2 justify-end"><Boxes className="w-3.5 h-3.5" />Stock</span>
      </th>
      <th className="px-6 py-4 font-semibold text-center">
        <span className="flex items-center gap-2 justify-center"><Activity className="w-3.5 h-3.5" />Status</span>
      </th>
      {showActions && (
        <th className="px-6 py-4 font-semibold text-center">
          <span className="flex items-center gap-2 justify-center"><Settings2 className="w-3.5 h-3.5" />Actions</span>
        </th>
      )}
    </tr>
  </thead>
);

// ─── Main Component ───────────────────────────────────────────────────────────
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

  const handleDelete = React.useCallback(
    async (id: string) => {
      if (window.confirm('Are you sure you want to delete this product?')) {
        await deleteProduct(id);
      }
    },
    [deleteProduct],
  );

  const handleCategoryChange = React.useCallback((val: string) => {
    setCategory(val);
    setPage(1);
  }, []);

  const pageNumbers = React.useMemo(() => {
    if (!pagination) return [];
    // Handle both old types (if any) and actual backend payload
    const total = (pagination as any).totalPages || pagination.pages || 1;
    const current = pagination.page || 1;
    const delta = 2;
    const range: number[] = [];
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      range.push(i);
    }
    return range;
  }, [pagination]);

  const canActOnProducts =
    hasPermission('products.update') || hasPermission('products.delete');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent leading-tight">
              Products
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage your inventory catalog &amp; stock levels
            </p>
          </div>
        </div>

        {hasPermission('products.create') && (
          <button
            onClick={() => navigate('/products/create')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        )}
      </div>

      {/* ── Search & Filters ── */}
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <ProductFilters
          categories={categories}
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* ── Content Area ── */}
      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <TableHeader showActions={true} />
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {Array.from({ length: 10 }).map((_, i) => (
                  <SkeletonRow key={i} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-20 text-center shadow-sm">
          <div className="flex flex-col items-center gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <PackageOpen className="w-16 h-16 text-slate-300 dark:text-slate-600" />
            </div>
            <div className="space-y-2 max-w-xs">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                No Products Found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {search || category
                  ? 'No products match your current filters. Try adjusting your search or category.'
                  : 'Your catalog is empty. Start by adding your first product to the inventory.'}
              </p>
            </div>
            {hasPermission('products.create') && (
              <button
                onClick={() => navigate('/products/create')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-blue-500/20 hover:scale-[1.02] mt-1"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <TableHeader showActions={canActOnProducts} />
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                {products.map((product, index) => {
                  const isLowStock = product.stockQuantity <= product.minStockThreshold;
                  const initials = product.name
                    .split(' ')
                    .slice(0, 2)
                    .map((w: string) => w[0])
                    .join('')
                    .toUpperCase();

                  return (
                    <tr
                      key={product.id || product._id}
                      className="group animate-in fade-in transition-colors duration-150 hover:bg-blue-50/40 dark:hover:bg-blue-950/20"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                            {product.imageUrl ? (
                              <img
                                src={`${API_BASE_URL.replace('/api/v1', '')}${product.imageUrl}`}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
                                {initials || 'N/A'}
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                          {product.sku}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {product.category
                          ? typeof product.category === 'string'
                            ? product.category
                            : product.category.name
                          : <span className="text-slate-400">—</span>}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-slate-900 dark:text-white">
                          ${product.unitPrice.toFixed(2)}
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={`font-bold tabular-nums ${
                              isLowStock
                                ? 'text-red-500 dark:text-red-400'
                                : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {product.stockQuantity}
                          </span>
                          {isLowStock && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-500 dark:text-red-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                              Low Stock
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            product.isActive
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              product.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                            }`}
                          />
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Actions */}
                      {canActOnProducts && (
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                            {hasPermission('products.update') && (
                              <button
                                onClick={() =>
                                  navigate(`/products/edit/${product.id || product._id}`)
                                }
                                title="Edit Product"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-150 hover:scale-110"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            {hasPermission('products.delete') && (
                              <button
                                onClick={() => handleDelete(product.id || product._id)}
                                title="Delete Product"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-150 hover:scale-110"
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

          {/* ── Pagination ── */}
          {pagination && ((pagination as any).totalPages > 1 || pagination.pages > 1) && (
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/30">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Showing page{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-200">{pagination.page}</span>
                {' '}of{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-200">{(pagination as any).totalPages || pagination.pages}</span>
                {' '}&mdash;{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-200">{(pagination as any).totalDocs || (pagination as any).total}</span>
                {' '}total items
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white transition-all duration-150"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {pageNumbers.map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`min-w-[36px] h-9 px-2 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                      num === page
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md shadow-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, (pagination as any).totalPages || pagination.pages || 1))}
                  disabled={page === ((pagination as any).totalPages || pagination.pages || 1)}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white transition-all duration-150"
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
