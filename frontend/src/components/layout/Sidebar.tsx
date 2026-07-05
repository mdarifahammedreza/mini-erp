import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUIStore } from '../../store/ui.store';
import { useAuthStore } from '../../store/auth.store';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { user, hasPermission } = useAuthStore();

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      to: '/dashboard',
      show: true,
    },
    {
      label: 'Products',
      icon: Package,
      to: '/products',
      show: hasPermission('products.read'),
    },
    {
      label: 'Customers',
      icon: Users,
      to: '/customers',
      show: hasPermission('customers.read'),
    },
    {
      label: 'Sales',
      icon: ShoppingCart,
      to: '/sales',
      show: hasPermission('sales.read'),
    },
    {
      label: 'Settings',
      icon: Settings,
      to: '/settings/roles',
      show: hasPermission('roles.manage'),
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950/40">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-600 rounded-lg text-white">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">Mini ERP</span>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="p-1.5 bg-blue-600 rounded-lg text-white mx-auto">
            <TrendingUp className="w-5 h-5" />
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="hidden md:flex p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition duration-200"
        >
          {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems
          .filter((item) => item.show)
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                } ${sidebarCollapsed ? 'justify-center' : ''}`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
      </nav>

      {!sidebarCollapsed && user && (
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
              <p className="text-xs text-slate-500 capitalize truncate">
                {typeof user.role === 'string' ? user.role : user.role?.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
