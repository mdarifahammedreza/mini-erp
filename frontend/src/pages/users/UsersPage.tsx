import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers, type User } from '../../features/users';
import { useAuthStore } from '../../store/auth.store';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  Edit2,
  Trash2,
  Shield,
  UserX,
  UserPlus,
} from 'lucide-react';

// ─── Avatar helpers ───────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-violet-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-indigo-500',
];

const getAvatarColor = (name: string): string => {
  const code = name ? name.charCodeAt(0) : 0;
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
};

const getInitials = (firstName: string, lastName: string): string => {
  const f = firstName ? firstName.charAt(0).toUpperCase() : '';
  const l = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${f}${l}`;
};

// ─── Skeleton row ─────────────────────────────────────────────────────────────

const SkeletonRow: React.FC<{ delay?: number }> = ({ delay = 0 }) => (
  <tr
    className="border-b border-slate-100 dark:border-slate-800"
    style={{ animationDelay: `${delay}ms` }}
  >
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse shrink-0" />
        <div className="space-y-1.5">
          <div className="h-3 w-32 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-2.5 w-44 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
    </td>
    <td className="px-6 py-4 text-center">
      <div className="h-3 w-16 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse mx-auto" />
    </td>
    <td className="px-6 py-4 text-center">
      <div className="flex items-center justify-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>
    </td>
  </tr>
);

// ─── Page number button ───────────────────────────────────────────────────────

const PageButton: React.FC<{
  pageNum: number;
  current: number;
  onClick: (p: number) => void;
}> = ({ pageNum, current, onClick }) => (
  <button
    onClick={() => onClick(pageNum)}
    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150 ${
      pageNum === current
        ? 'bg-gradient-to-br from-pink-600 to-rose-600 text-white shadow-md shadow-pink-500/25'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
    }`}
  >
    {pageNum}
  </button>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const UsersPage: React.FC = () => {
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

  const { users, pagination, isLoading, deleteUser } = useUsers({
    page,
    limit: 10,
    search: debouncedSearch,
  });

  const handleDelete = React.useCallback(
    (id: string, name: string) => {
      if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
        deleteUser.mutate(id);
      }
    },
    [deleteUser],
  );

  const handlePageChange = React.useCallback((p: number) => {
    setPage(p);
  }, []);

  // Build visible page numbers (max 7 around current)
  const pageNumbers = React.useMemo(() => {
    if (!pagination) return [];
    const total = pagination.pages;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const left = Math.max(1, page - 2);
    const right = Math.min(total, page + 2);
    const nums: (number | '…')[] = [];
    if (left > 1) { nums.push(1); if (left > 2) nums.push('…'); }
    for (let i = left; i <= right; i++) nums.push(i);
    if (right < total) { if (right < total - 1) nums.push('…'); nums.push(total); }
    return nums;
  }, [pagination, page]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Staff Users
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage user accounts, roles, and permissions
            </p>
          </div>
        </div>

        {hasPermission('users.create') && (
          <button
            onClick={() => navigate('/users/create')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-pink-500/20 hover:shadow-lg hover:shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create User</span>
          </button>
        )}
      </div>

      {/* ── Inline search bar ─────────────────────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200 shadow-sm"
        />
      </div>

      {/* ── Content area ─────────────────────────────────────────────────── */}
      {isLoading ? (
        /* Skeleton loading */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} delay={i * 60} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : users.length === 0 ? (
        /* Empty state */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm px-8 py-20 flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-5 rounded-full bg-slate-50 dark:bg-slate-800/60">
            <UserX className="w-16 h-16 text-slate-300 dark:text-slate-600" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
              No Users Found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              {search
                ? `No users match "${search}". Try a different search term.`
                : 'There are no users yet. Create one to get started.'}
            </p>
          </div>
          {hasPermission('users.create') && !search && (
            <button
              onClick={() => navigate('/users/create')}
              className="inline-flex items-center gap-2 mt-2 px-4 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-pink-500/20 hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              Create First User
            </button>
          )}
        </div>
      ) : (
        /* Data table */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((user: User, index: number) => {
                  const userId = user.id || user._id;
                  const fullName = `${user.firstName} ${user.lastName}`;
                  const initials = getInitials(user.firstName, user.lastName);
                  const avatarColor = getAvatarColor(user.firstName);
                  const roleName =
                    typeof user.role === 'string' ? user.role : user.role?.name ?? '—';

                  return (
                    <tr
                      key={userId}
                      className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors duration-150"
                      style={{
                        animationDelay: `${index * 40}ms`,
                        animation: 'fadeSlideIn 0.35s ease both',
                      }}
                    >
                      {/* Name + Email (combined cell) */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}
                            aria-label={fullName}
                          >
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white truncate text-sm">
                              {fullName}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role badge */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-700/40 capitalize">
                          {roleName}
                        </span>
                      </td>

                      {/* Status dot + text */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.isActive
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.isActive
                                ? 'bg-emerald-500 shadow-[0_0_4px_1px_rgba(16,185,129,0.5)]'
                                : 'bg-slate-400'
                            }`}
                          />
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          {hasPermission('users.update') && (
                            <button
                              onClick={() => navigate(`/users/edit/${userId}`)}
                              title="Edit User"
                              className="p-2 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-150 hover:scale-110"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {hasPermission('users.delete') && (
                            <button
                              onClick={() => handleDelete(userId, fullName)}
                              disabled={deleteUser.isPending}
                              title="Delete User"
                              className="p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ──────────────────────────────────────────────── */}
          {pagination && pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-950/20">
              <p className="text-xs text-slate-500 dark:text-slate-400 order-2 sm:order-1">
                Page{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {pagination.page}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {pagination.pages}
                </span>{' '}
                &mdash;{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {pagination.total}
                </span>{' '}
                total users
              </p>

              <div className="flex items-center gap-1 order-1 sm:order-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-150"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {pageNumbers.map((pn, i) =>
                  pn === '…' ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="w-8 h-8 flex items-center justify-center text-slate-400 text-sm select-none"
                    >
                      …
                    </span>
                  ) : (
                    <PageButton
                      key={pn}
                      pageNum={pn as number}
                      current={page}
                      onClick={handlePageChange}
                    />
                  ),
                )}

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
                  disabled={page === pagination.pages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-150"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stagger + entrance keyframe */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default UsersPage;
