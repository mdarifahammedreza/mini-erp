import React, { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useUIStore } from '../../store/ui.store';
import { useAuthStore } from '../../store/auth.store';
import { authService } from '../../features/auth';
import { Menu, LogOut, Bell, ChevronRight, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/products': 'Products',
  '/products/create': 'Add Product',
  '/customers': 'Customers',
  '/customers/create': 'Add Customer',
  '/sales': 'Sales Orders',
  '/sales/create': 'Record Sale',
  '/users': 'Staff Users',
  '/users/create': 'Create User',
  '/settings/roles': 'Roles & Permissions',
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const avatarColors = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-amber-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
];

export const Header: React.FC = () => {
  const { toggleSidebar } = useUIStore();
  const { user, clearUser } = useAuthStore();
  const location = useLocation();

  const [darkMode, setDarkMode] = React.useState<boolean>(() =>
    document.documentElement.classList.contains('dark')
  );

  const toggleDark = useCallback(() => {
    document.documentElement.classList.toggle('dark');
    setDarkMode((prev) => !prev);
  }, []);

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

  const currentLabel = routeLabels[location.pathname] ?? 'Page';
  const isEditRoute = location.pathname.includes('/edit/');
  const displayLabel = isEditRoute
    ? `Edit ${currentLabel.split(' ')[0] || 'Record'}`
    : currentLabel;

  const avatarGradient = user
    ? avatarColors[(user.firstName?.charCodeAt(0) ?? 0) % avatarColors.length]
    : avatarColors[0];

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '??';

  const roleName = user
    ? typeof user.role === 'string'
      ? user.role
      : user.role?.name ?? ''
    : '';

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center justify-between px-5 md:px-7 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/[0.06] shadow-sm shadow-slate-900/[0.03]">

      {/* ── Left: hamburger + breadcrumb ────── */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={toggleSidebar}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all duration-200"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-1.5 text-sm">
          <span className="text-slate-400 dark:text-slate-600 font-medium">Mini ERP</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
          <span className="font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
            {displayLabel}
          </span>
        </nav>

        {/* Mobile: just page title */}
        <span className="sm:hidden font-semibold text-slate-800 dark:text-slate-100 text-[15px] tracking-tight">
          {displayLabel}
        </span>
      </div>

      {/* ── Right: controls + user ──────────── */}
      <div className="flex items-center gap-2">

        {/* Greeting — desktop only */}
        {user && (
          <span className="hidden lg:block text-[13px] font-medium text-slate-500 dark:text-slate-400 mr-1">
            {getGreeting()},{' '}
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              {user.firstName}
            </span>
          </span>
        )}

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification bell */}
        <button
          title="Notifications"
          className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
        >
          <Bell className="w-4 h-4" />
          {/* Unread dot */}
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-500 ring-1 ring-white dark:ring-slate-950" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* User avatar + role + logout */}
        {user && (
          <div className="flex items-center gap-2.5">
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-sm font-bold ring-1 ring-black/10 dark:ring-white/15 shadow-md cursor-default select-none shrink-0`}
              title={user.fullName}
            >
              {initials}
            </div>

            {/* Name + role — hidden on small screens */}
            <div className="hidden md:flex flex-col min-w-0 max-w-[120px]">
              <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 truncate leading-tight">
                {user.fullName}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate capitalize leading-tight mt-0.5">
                {roleName}
              </p>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              title="Sign out"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-500/30 transition-all duration-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
