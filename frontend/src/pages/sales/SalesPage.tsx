import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSales } from '../../features/sales';
import { useAuthStore } from '../../store/auth.store';
import { Loader2, Plus, ChevronLeft, ChevronRight, ShoppingCart, Search, Eye, X } from 'lucide-react';

export const SalesPage: React.FC = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuthStore();
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [selectedSale, setSelectedSale] = React.useState<any | null>(null);

  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const { sales, pagination, isLoading } = useSales({
    page,
    limit: 10,
    search: debouncedSearch,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Sales Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">View and track all closed sales transactions</p>
        </div>

        {hasPermission('sales.create') && (
          <button
            onClick={() => navigate('/sales/create')}
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-md shadow-blue-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>Record Sale</span>
          </button>
        )}
      </div>

      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by invoice number or customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition"
        />
      </div>

      {isLoading ? (
        <div className="h-96 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm text-slate-500">Loading sales records...</p>
        </div>
      ) : sales.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-16 text-center space-y-4 shadow-sm">
          <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-full w-fit mx-auto text-slate-400">
            <ShoppingCart className="w-12 h-12" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-slate-950 dark:text-white text-lg">No Sales Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              There are no transaction records matching your query. Record a new sale to get started.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/40 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Invoice #</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Items Count</th>
                  <th className="px-6 py-3.5 text-right">Total Amount</th>
                  <th className="px-6 py-3.5 text-center">Payment</th>
                  <th className="px-6 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                {sales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {sale.invoiceNumber}
                    </td>
                    <td className="px-6 py-4">
                      {sale.customer ? (typeof sale.customer === 'string' ? sale.customer : sale.customer.name) : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(sale.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">{sale.items.length}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">
                      ${sale.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 capitalize">
                        {sale.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedSale(sale)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
              <span className="text-sm text-slate-500">
                Page {pagination.page} of {pagination.pages} ({pagination.total} total transactions)
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

      {selectedSale && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Invoice: {selectedSale.invoiceNumber}
              </h3>
              <button
                onClick={() => setSelectedSale(null)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400 block text-xs uppercase font-semibold">Customer</span>
                  <span className="font-medium text-slate-950 dark:text-white">
                    {selectedSale.customer ? (typeof selectedSale.customer === 'string' ? selectedSale.customer : selectedSale.customer.name) : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs uppercase font-semibold">Transaction Date</span>
                  <span className="font-medium text-slate-950 dark:text-white">
                    {new Date(selectedSale.createdAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs uppercase font-semibold">Payment Method</span>
                  <span className="font-medium text-slate-950 dark:text-white capitalize">
                    {selectedSale.paymentMethod.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs uppercase font-semibold">Recorded By</span>
                  <span className="font-medium text-slate-950 dark:text-white">
                    {selectedSale.soldBy || 'System User'}
                  </span>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950/40 text-slate-500 font-semibold uppercase">
                      <th className="px-4 py-2">Item</th>
                      <th className="px-4 py-2 text-right">Price</th>
                      <th className="px-4 py-2 text-right">Qty</th>
                      <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-350">
                    {selectedSale.items.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-2.5 font-medium">
                          {item.product ? (typeof item.product === 'string' ? 'Product ID: ' + item.product : item.product.name) : '-'}
                        </td>
                        <td className="px-4 py-2.5 text-right">${item.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-right">{item.quantity}</td>
                        <td className="px-4 py-2.5 text-right font-semibold">${item.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedSale.notes && (
                <div className="bg-slate-50 dark:bg-slate-950/20 p-3 rounded-lg text-xs text-slate-500">
                  <span className="font-semibold block mb-1">Notes:</span>
                  {selectedSale.notes}
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800 text-lg">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Grand Total</span>
                <span className="font-black text-blue-600 dark:text-blue-400">${selectedSale.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/20 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedSale(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 rounded-lg text-sm font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPage;
