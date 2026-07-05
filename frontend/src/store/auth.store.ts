import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User, token: string) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  hasRole: (roles: string | string[]) => boolean;
  hasPermission: (permissions: string | string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user, token) => set({ user, accessToken: token, isAuthenticated: true }),
      clearUser: () => set({ user: null, accessToken: null, isAuthenticated: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      hasRole: (roles) => {
        const user = get().user;
        if (!user) return false;
        const userRole = typeof user.role === 'string' ? user.role : user.role?.slug;
        if (!userRole) return false;
        
        if (userRole === 'super-admin') return true;
        
        if (Array.isArray(roles)) {
          return roles.includes(userRole);
        }
        return userRole === roles;
      },
      hasPermission: (requiredPerms) => {
        const user = get().user;
        if (!user) return false;
        const userRole = typeof user.role === 'string' ? user.role : user.role?.slug;
        if (userRole === 'super-admin') return true;

        const permissions = user.permissions || [];
        if (Array.isArray(requiredPerms)) {
          return requiredPerms.every((p) => permissions.includes(p));
        }
        return permissions.includes(requiredPerms);
      },
    }),
    {
      name: 'mini-erp-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
