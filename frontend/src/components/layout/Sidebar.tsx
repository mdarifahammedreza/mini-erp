import React, { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useUIStore } from '../../store/ui.store';
import { useAuthStore } from '../../store/auth.store';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  UserCog,
  PanelLeftClose,
  PanelLeftOpen,
  TrendingUp,
  LogOut,
} from 'lucide-react';
import { authService } from '../../features/auth';
import { toast } from 'sonner';

const navItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/dashboard',
    permission: null,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    label: 'Products',
    icon: Package,
    to: '/products',
    permission: 'products.read',
    color: 'from-violet-500 to-purple-500',
  },
  {
    label: 'Customers',
    icon: Users,
    to: '/customers',
    permission: 'customers.read',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    label: 'Sales',
    icon: ShoppingCart,
    to: '/sales',
    permission: 'sales.read',
    color: 'from-orange-500 to-amber-500',
  },
  {
    label: 'Staff Users',
    icon: UserCog,
    to: '/users',
    permission: 'users.read',
    color: 'from-pink-500 to-rose-500',
  },
  {
    label: 'Settings',
    icon: Settings,
    to: '/settings/roles',
    permission: 'roles.manage',
    color: 'from-slate-400 to-slate-500',
  },
];

const avatarColors = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-amber-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
];

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { user, hasPermission, clearUser } = useAuthStore();

  const handleLogout = useCallback(async () => {
    try {
      const storedAuth = localStorage.getItem('mini-erp-auth');
      let parsedAuth: any = {};
      try {
        if (storedAuth) parsedAuth = JSON.parse(storedAuth);
      } catch (_) {}
      const refreshToken = parsedAuth?.state?.refreshToken || '';
      await authService.logout(refreshToken);
    } catch (_) {
    } finally {
      clearUser();
      localStorage.removeItem('mini-erp-auth');
      toast.success('Logged out successfully.');
    }
  }, [clearUser]);

  const visibleItems = navItems.filter(
    (item) => item.permission === null || hasPermission(item.permission)
  );

  const avatarGradient =
    user
      ? avatarColors[(user.firstName?.charCodeAt(0) ?? 0) % avatarColors.length]
      : avatarColors[0];

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '??';

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-[72px]' : 'w-64'
      }`}
      style={{
        background: 'linear-gradient(180deg, #0f1117 0%, #111827 50%, #0d1117 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* ── Logo / Header ─────────────────── */}
      <div
        className={`flex items-center h-16 px-4 shrink-0 ${
          sidebarCollapsed ? 'justify-center' : 'justify-between'
        }`}
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Logo mark */}
            <div className="relative shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <TrendingUp className="w-4 h-4 text-white" />
              <div className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-display font-bold text-base tracking-tight leading-none truncate">
                Mini ERP
              </p>
              <p className="text-[10px] text-slate-500 font-medium leading-none mt-0.5 tracking-widest uppercase">
                v2.0
              </p>
            </div>
          </div>
        )}

        {sidebarCollapsed && (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-1 ring-white/20">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/8 transition-all duration-200 shrink-0 ${
            sidebarCollapsed ? 'absolute right-2 top-4' : ''
          }`}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* ── Navigation ────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 scroll-thin">
        {!sidebarCollapsed && (
          <p className="px-4 mb-2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.12em]">
            Main Menu
          </p>
        )}

        <div className={`space-y-0.5 ${sidebarCollapsed ? 'px-2' : 'px-3'}`}>
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={sidebarCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl transition-all duration-200 ${
                  sidebarCollapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/6'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active glow bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-gradient-to-b from-blue-400 to-indigo-500" />
                  )}

                  {/* Icon container */}
                  <div
                    className={`relative shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-br ${item.color} shadow-lg`
                        : 'group-hover:bg-white/8'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {isActive && (
                      <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${item.color} opacity-30 blur-sm -z-10 scale-150`} />
                    )}
                  </div>

                  {/* Label */}
                  {!sidebarCollapsed && (
                    <span className={`text-[13.5px] font-semibold leading-none truncate tracking-[-0.01em] transition-colors duration-200 ${
                      isActive ? 'text-white' : ''
                    }`}>
                      {item.label}
                    </span>
                  )}

                  {/* Active dot for collapsed */}
                  {sidebarCollapsed && isActive && (
                    <span className="absolute right-1.5 top-1.5 w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ── User profile + logout ──────────── */}
      {user && (
        <div
          className={`shrink-0 p-3 ${sidebarCollapsed ? '' : ''}`}
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {sidebarCollapsed ? (
            /* Collapsed: just avatar + logout */
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-xs font-bold ring-1 ring-white/20 shrink-0`}
                title={user.fullName}
              >
                {initials}
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Expanded: full profile card */
            <div className="rounded-xl bg-white/5 border border-white/8 p-3 flex items-center gap-3">
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-sm font-bold ring-1 ring-white/20 shrink-0`}
              >
                {initials}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-white truncate leading-tight">
                  {user.fullName}
                </p>
                <p className="text-[11px] text-slate-500 truncate capitalize leading-tight mt-0.5">
                  {typeof user.role === 'string' ? user.role : user.role?.name}
                </p>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                title="Logout"
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
