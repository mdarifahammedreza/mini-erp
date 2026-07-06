import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../../features/customers';
import { useAuthStore } from '../../store/auth.store';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// ─── Avatar helpers ───────────────────────────────────────────────────────────

const AVATAR_PALETTES = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-amber-500',
  'from-rose-500 to-pink-500',
  'from-indigo-500 to-blue-500',
  'from-fuchsia-500 to-violet-500',
  'from-sky-500 to-indigo-500',
];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }
  return h;
}

function getAvatarGradient(name: string): string {
  return AVATAR_PALETTES[hashName(name) % AVATAR_PALETTES.length];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────

const SkeletonRow: React.FC<{ index: number }> = ({ index }) => (
  <tr
    className="border-b border-slate-100 dark:border-slate-800/60"
    style={{ animationDelay: `${index * 60}ms` }}
  >
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse shrink-0" />
        <div className="h-3.5 w-32 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="h-3 w-40 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="h-3 w-24 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="h-3 w-48 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
    </td>
    <td className="px-6 py-4 text-center">
      <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse mx-auto" />
    </td>
    <td className="px-6 py-4 text-center">
      <div className="flex items-center justify-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>
    </td>
  </tr>
);

// ─── Main page ────────────────────────────────────────────────────────────────

export const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuthStore();
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const { customers, pagination, isLoading, deleteCustomer } = useCustomers({
    page,
    limit: 10,
    search: debouncedSearch,
  });

  const handleDelete = React.useCallback(
    async (id: string) => {
      if (window.confirm('Are you sure you want to delete this customer?')) {
        await deleteCustomer(id);
      }
    },
    [deleteCustomer],
  );

  const handleEdit = React.useCallback(
    (id: string) => {
      navigate(`/customers/edit/${id}`);
    },
    [navigate],
  );

  const handlePrev = React.useCallback(
    () => setPage((p) => Math.max(p - 1, 1)),
    [],
  );

  const handleNext = React.useCallback(
    () => setPage((p) => Math.min(p + 1, pagination?.pages ?? 1)),
    [pagination?.pages],
  );

  const showActions =
    hasPermission('customers.update') || hasPermission('customers.delete');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Customers
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              View and manage customer accounts
            </p>
          </div>
        </div>

        {hasPermission('customers.create') && (
          <button
            onClick={() => navigate('/customers/create')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        )}
      </div>

      {/* ── Search bar ── */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name, email, phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-200 shadow-sm"
        />
      </div>

      {/* ── Content card ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Table head */}
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-3.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    Name
                  </span>
                </th>
                <th className="px-6 py-3.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </span>
                </th>
                <th className="px-6 py-3.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    Phone
                  </span>
                </th>
                <th className="px-6 py-3.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Address
                  </span>
                </th>
                <th className="px-6 py-3.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">
                  Status
                </th>
                {showActions && (
                  <th className="px-6 py-3.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            {/* Table body */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {isLoading ? (
                <>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonRow key={i} index={i} />
                  ))}
                </>
              ) : customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={showActions ? 6 : 5}
                    className="px-6 py-20 text-center"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                        <Users className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">
                          No Customers Found
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                          {search
                            ? 'No records match your search. Try a different query.'
                            : 'There are no customer records yet. Click "Add Customer" to create the first one.'}
                        </p>
                      </div>
                      {!search && hasPermission('customers.create') && (
                        <button
                          onClick={() => navigate('/customers/create')}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-md shadow-emerald-500/20 mt-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add Customer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((customer, index) => {
                  const id = customer.id || customer._id;
                  const gradient = getAvatarGradient(customer.name ?? '');
                  const initials = getInitials(customer.name ?? '?');

                  return (
                    <tr
                      key={id}
                      className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-150"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: 'fadeSlideIn 0.35s ease both',
                      }}
                    >
                      {/* Name + Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-sm`}
                          >
                            <span className="text-[11px] font-bold text-white tracking-wide">
                              {initials}
                            </span>
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-150">
                            {customer.name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          {customer.email}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-mono text-xs">
                          <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400 font-sans" />
                          {customer.phone || (
                            <span className="text-slate-300 dark:text-slate-600 not-italic font-sans">
                              —
                            </span>
                          )}
                        </span>
                      </td>

                      {/* Address */}
                      <td className="px-6 py-4 max-w-[200px]">
                        <span
                          className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 truncate"
                          title={customer.address || undefined}
                        >
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          <span className="truncate">
                            {customer.address || (
                              <span className="text-slate-300 dark:text-slate-600">
                                —
                              </span>
                            )}
                          </span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            customer.isActive
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              customer.isActive
                                ? 'bg-emerald-500 shadow-[0_0_4px_1px_rgba(16,185,129,0.5)]'
                                : 'bg-red-500 shadow-[0_0_4px_1px_rgba(239,68,68,0.5)]'
                            }`}
                          />
                          {customer.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Actions */}
                      {showActions && (
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {hasPermission('customers.update') && (
                              <button
                                onClick={() => handleEdit(id)}
                                title="Edit Customer"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-150 hover:scale-110"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                            {hasPermission('customers.delete') && (
                              <button
                                onClick={() => handleDelete(id)}
                                title="Delete Customer"
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
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {pagination && pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-950/30">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Page{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {pagination.page}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {pagination.pages}
              </span>
              {' · '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {pagination.total}
              </span>{' '}
              customers total
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 hover:scale-[1.02] disabled:hover:scale-100 shadow-sm"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Prev
              </button>

              {/* Page number pills */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                  const half = 2;
                  let start = Math.max(1, page - half);
                  const end = Math.min(pagination.pages, start + 4);
                  start = Math.max(1, end - 4);
                  const p = start + i;
                  if (p > pagination.pages) return null;
                  const isActive = p === page;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 text-xs font-semibold rounded-lg transition-all duration-150 ${
                        isActive
                          ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 scale-110'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNext}
                disabled={page === pagination.pages}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 hover:scale-[1.02] disabled:hover:scale-100 shadow-sm"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

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

export default CustomersPage;
