import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../../features/customers';
import { useAuthStore } from '../../store/auth.store';
import { Loader2, Plus, Trash2, ChevronLeft, ChevronRight, Users, Search } from 'lucide-react';

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

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Customers Directory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">View and manage accounts details</p>
        </div>

        {hasPermission('customers.create') && (
          <button
            onClick={() => navigate('/customers/create')}
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-md shadow-blue-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        )}
      </div>

      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition"
        />
      </div>

      {isLoading ? (
        <div className="h-96 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm text-slate-500">Loading customers...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-16 text-center space-y-4 shadow-sm">
          <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-full w-fit mx-auto text-slate-400">
            <Users className="w-12 h-12" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-slate-950 dark:text-white text-lg">No Customers Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              There are no customer records matching your query. Click "Add Customer" to register a new one.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/40 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Phone</th>
                  <th className="px-6 py-3.5">Address</th>
                  {hasPermission('customers.delete') && <th className="px-6 py-3.5 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                {customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{customer.name}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{customer.email}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{customer.phone || '-'}</td>
                    <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{customer.address || '-'}</td>
                    {hasPermission('customers.delete') && (
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDelete(customer._id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-slate-500 hover:text-red-600 transition"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
              <span className="text-sm text-slate-500">
                Page {pagination.page} of {pagination.pages} ({pagination.total} total customers)
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

export default CustomersPage;
