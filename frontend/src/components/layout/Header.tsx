import React from 'react';
import { useUIStore } from '../../store/ui.store';
import { useAuthStore } from '../../store/auth.store';
import { authService } from '../../features/auth';
import { Menu, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export const Header: React.FC = () => {
  const { toggleSidebar } = useUIStore();
  const { user, clearUser } = useAuthStore();

  const handleLogout = async () => {
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
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 md:hidden transition duration-200"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-semibold text-slate-800 dark:text-slate-100 text-lg hidden md:block">
          Management Portal
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:block">
              {user.fullName}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-300 font-medium transition duration-200"
            >
              <LogOut className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
