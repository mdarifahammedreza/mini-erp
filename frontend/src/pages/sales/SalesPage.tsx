import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSales } from '../../features/sales';
import { useAuthStore } from '../../store/auth.store';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Search,
  Eye,
  X,
  Receipt,
  Calendar,
  Package,
  User,
  CheckCircle2,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCustomerName(customer: any): string {
  if (!customer) return '-';
  if (typeof customer === 'string') return customer;
  return customer.name ?? '-';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

const SkeletonRow: React.FC<{ delay?: number }> = ({ delay = 0 }) => (
  <tr className="animate-pulse" style={{ animationDelay: `${delay}ms` }}>
    <td className="px-6 py-4">
      <div className="h-3.5 w-28 bg-slate-200 dark:bg-slate-700 rounded-md" />
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
        <div className="h-3.5 w-32 bg-slate-200 dark:bg-slate-700 rounded-md" />
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-700 rounded-md" />
    </td>
    <td className="px-6 py-4 text-right">
      <div className="h-3.5 w-8 bg-slate-200 dark:bg-slate-700 rounded-md ml-auto" />
    </td>
    <td className="px-6 py-4 text-right">
      <div className="h-3.5 w-20 bg-slate-200 dark:bg-slate-700 rounded-md ml-auto" />
    </td>
    <td className="px-6 py-4">
      <div className="h-5 w-14 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto" />
    </td>
    <td className="px-6 py-4">
      <div className="h-7 w-7 bg-slate-200 dark:bg-slate-700 rounded-lg mx-auto" />
    </td>
  </tr>
);

// ─── Main Component ───────────────────────────────────────────────────────────

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

  const handleOpenSale = React.useCallback((sale: any) => {
    setSelectedSale(sale);
  }, []);

  const handleCloseSale = React.useCallback(() => {
    setSelectedSale(null);
  }, []);

  // Build page number array for modern pagination
  const pageNumbers = React.useMemo(() => {
    if (!pagination || pagination.pages <= 1) return [];
    const total = pagination.pages;
    const current = pagination.page;
    const delta = 2;
    const range: number[] = [];
    for (
      let i = Math.max(1, current - delta);
      i <= Math.min(total, current + delta);
      i++
    ) {
      range.push(i);
    }
    if (range[0] > 1) {
      range.unshift(-1);
      range.unshift(1);
    }
    if (range[range.length - 1] < total) {
      range.push(-2);
      range.push(total);
    }
    return range;
  }, [pagination]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Sales Orders
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              View and track all closed sales transactions
            </p>
          </div>
        </div>

        {hasPermission('sales.create') && (
          <button
            onClick={() => navigate('/sales/create')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Record Sale
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by invoice number or customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-600 transition-all duration-200 shadow-sm"
        />
      </div>

      {/* Content Area */}
      {!isLoading && sales.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-16 flex flex-col items-center text-center space-y-4 shadow-sm">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-slate-300 dark:text-slate-600" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No transactions yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              {debouncedSearch
                ? `No results for "${debouncedSearch}". Try a different search term.`
                : 'There are no sales records here. Record a new sale to get started.'}
            </p>
          </div>
          {hasPermission('sales.create') && !debouncedSearch && (
            <button
              onClick={() => navigate('/sales/create')}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold transition-all hover:scale-[1.02] shadow-md shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              Record First Sale
            </button>
          )}
        </div>
      ) : (
        /* Table Card */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">
                    <span className="flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5" />
                      Invoice #
                    </span>
                  </th>
                  <th className="px-6 py-3.5">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      Customer
                    </span>
                  </th>
                  <th className="px-6 py-3.5">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Date
                    </span>
                  </th>
                  <th className="px-6 py-3.5 text-right">
                    <span className="flex items-center gap-1.5 justify-end">
                      <Package className="w-3.5 h-3.5" />
                      Items
                    </span>
                  </th>
                  <th className="px-6 py-3.5 text-right">
                    <span className="flex items-center gap-1.5 justify-end">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Amount
                    </span>
                  </th>
                  <th className="px-6 py-3.5 text-center">Payment</th>
                  <th className="px-6 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm text-slate-700 dark:text-slate-300">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonRow key={i} delay={i * 60} />
                    ))
                  : sales.map((sale, index) => {
                      const customerName = getCustomerName(sale.customer);
                      const initials = customerName !== '-' ? getInitials(customerName) : '?';
                      return (
                        <tr
                          key={sale._id}
                          className="group hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-all duration-150"
                          style={{
                            animationDelay: `${index * 50}ms`,
                            animation: 'fadeSlideIn 0.35s ease both',
                          }}
                        >
                          {/* Invoice # */}
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5">
                              <Receipt className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wide">
                                {sale.invoiceNumber}
                              </span>
                            </span>
                          </td>

                          {/* Customer */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                                {initials}
                              </div>
                              <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
                                {customerName}
                              </span>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4">
                            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                              <Calendar className="w-3.5 h-3.5 shrink-0" />
                              {formatDate(sale.createdAt)}
                            </span>
                          </td>

                          {/* Items Count */}
                          <td className="px-6 py-4 text-right">
                            <span className="inline-flex items-center gap-1 justify-end font-semibold text-slate-700 dark:text-slate-300">
                              <Package className="w-3.5 h-3.5 text-slate-400" />
                              {sale.items.length}
                            </span>
                          </td>

                          {/* Grand Total */}
                          <td className="px-6 py-4 text-right">
                            <span className="font-bold text-slate-900 dark:text-white">
                              <span className="text-base text-blue-500 mr-0.5">$</span>
                              {(sale.grandTotal || 0).toFixed(2)}
                            </span>
                          </td>

                          {/* Payment */}
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              Paid
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleOpenSale(sale)}
                              title="View Details"
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-all duration-150 hover:ring-1 hover:ring-blue-200 dark:hover:ring-blue-800"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-950/30">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Page{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {pagination.page}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {pagination.pages}
                </span>{' '}
                —{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {pagination.total}
                </span>{' '}
                total transactions
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {pageNumbers.map((num, i) =>
                  num < 0 ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="px-1 text-slate-400 text-sm select-none"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                        num === page
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                          : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {num}
                    </button>
                  )
                )}

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
                  disabled={page === pagination.pages}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sale Detail Modal */}
      {selectedSale && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => e.target === e.currentTarget && handleCloseSale()}
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl shadow-slate-900/30 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-950/60 dark:to-slate-900">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Receipt className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Invoice</p>
                  <h3 className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                    {selectedSale.invoiceNumber}
                  </h3>
                </div>
              </div>
              <button
                onClick={handleCloseSale}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">

              {/* Info Grid 2x2 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    <User className="w-3.5 h-3.5" />
                    Customer
                  </span>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {getCustomerName(selectedSale.customer)}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Transaction Date
                  </span>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {formatDateTime(selectedSale.createdAt)}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                    Status
                  </span>
                  <div className="font-bold text-sm">
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Paid
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    <User className="w-3.5 h-3.5" />
                    Recorded By
                  </span>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {selectedSale.soldBy || 'System User'}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" />
                    Line Items
                  </p>
                </div>
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 dark:bg-slate-950/30 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="px-4 py-2.5">Product</th>
                      <th className="px-4 py-2.5 text-right">Unit Price</th>
                      <th className="px-4 py-2.5 text-right">Qty</th>
                      <th className="px-4 py-2.5 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedSale.items.map((item: any, index: number) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0
                            ? 'bg-white dark:bg-slate-900'
                            : 'bg-slate-50/50 dark:bg-slate-800/20'
                        } transition-colors`}
                      >
                        <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">
                          {item.product
                            ? typeof item.product === 'string'
                              ? 'Product ID: ' + item.product
                              : item.product.name
                            : '-'}
                        </td>
                        <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-400">
                          <span className="text-blue-500 mr-0.5">$</span>
                          {item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-400 font-medium">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-2.5 text-right font-bold text-slate-900 dark:text-white">
                          <span className="text-blue-500 mr-0.5">$</span>
                          {(item.lineTotal || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Notes */}
              {selectedSale.notes && (
                <div className="bg-amber-50/60 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-800/40 rounded-xl p-4">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-500 mb-2">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Notes
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedSale.notes}
                  </p>
                </div>
              )}

              {/* Grand Total */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-slate-200 dark:border-slate-700">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Grand Total
                </span>
                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  <span className="text-lg">$</span>
                  {(selectedSale.grandTotal || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/30 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={handleCloseSale}
                className="px-5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold transition-all duration-150 hover:scale-[1.01] shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Row animation keyframes */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SalesPage;
