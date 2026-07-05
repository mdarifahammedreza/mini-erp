import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

interface RoleGuardProps {
  requiredPermission?: string;
  allowedRoles?: string[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ requiredPermission, allowedRoles }) => {
  const { hasRole, hasPermission } = useAuthStore();

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
