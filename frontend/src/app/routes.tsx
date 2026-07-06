import { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { RoleGuard } from '../routes/RoleGuard';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Loader2 } from 'lucide-react';

const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const ProductsPage = lazy(() => import('../pages/products/ProductsPage'));
const ProductCreatePage = lazy(() => import('../pages/products/ProductCreatePage'));
const ProductEditPage = lazy(() => import('../pages/products/ProductEditPage'));
const CustomersPage = lazy(() => import('../pages/customers/CustomersPage'));
const CustomerCreatePage = lazy(() => import('../pages/customers/CustomerCreatePage'));
const CustomerEditPage = lazy(() => import('../pages/customers/CustomerEditPage'));
const SalesPage = lazy(() => import('../pages/sales/SalesPage'));
const SaleCreatePage = lazy(() => import('../pages/sales/SaleCreatePage'));
const RolesPage = lazy(() => import('../pages/settings/RolesPage'));
const UsersPage = lazy(() => import('../pages/users/UsersPage'));
const UserCreatePage = lazy(() => import('../pages/users/UserCreatePage'));
const UserEditPage = lazy(() => import('../pages/users/UserEditPage'));
const UnauthorizedPage = lazy(() => import('../pages/error/UnauthorizedPage'));
import ErrorPage from '../pages/error/ErrorPage';

const PageLoader = () => (
  <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    <p className="text-sm text-slate-500">Loading page view...</p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/unauthorized',
    element: (
      <Suspense fallback={<PageLoader />}>
        <UnauthorizedPage />
      </Suspense>
    ),
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: '/',
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: '/dashboard',
            element: (
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            element: <RoleGuard requiredPermission="products.read" />,
            children: [
              {
                path: '/products',
                element: (
                  <Suspense fallback={<PageLoader />}>
                    <ProductsPage />
                  </Suspense>
                ),
              },
            ],
          },
          {
            element: <RoleGuard requiredPermission="products.create" />,
            children: [
              {
                path: '/products/create',
                element: (
                  <Suspense fallback={<PageLoader />}>
                    <ProductCreatePage />
                  </Suspense>
                ),
              },
            ],
          },
          {
            element: <RoleGuard requiredPermission="products.update" />,
            children: [
              {
                path: '/products/edit/:id',
                element: (
                  <Suspense fallback={<PageLoader />}>
                    <ProductEditPage />
                  </Suspense>
                ),
              },
            ],
          },
          {
            element: <RoleGuard requiredPermission="customers.read" />,
            children: [
              {
                path: '/customers',
                element: (
                  <Suspense fallback={<PageLoader />}>
                    <CustomersPage />
                  </Suspense>
                ),
              },
            ],
          },
          {
            element: <RoleGuard requiredPermission="customers.create" />,
            children: [
              {
                path: '/customers/create',
                element: (
                  <Suspense fallback={<PageLoader />}>
                    <CustomerCreatePage />
                  </Suspense>
                ),
              },
            ],
          },
          {
            element: <RoleGuard requiredPermission="customers.update" />,
            children: [
              {
                path: '/customers/edit/:id',
                element: (
                  <Suspense fallback={<PageLoader />}>
                    <CustomerEditPage />
                  </Suspense>
                ),
              },
            ],
          },
          {
            element: <RoleGuard requiredPermission="sales.read" />,
            children: [
              {
                path: '/sales',
                element: (
                  <Suspense fallback={<PageLoader />}>
                    <SalesPage />
                  </Suspense>
                ),
              },
            ],
          },
          {
            element: <RoleGuard requiredPermission="sales.create" />,
            children: [
              {
                path: '/sales/create',
                element: (
                  <Suspense fallback={<PageLoader />}>
                    <SaleCreatePage />
                  </Suspense>
                ),
              },
            ],
          },
          {
            element: <RoleGuard requiredPermission="users.read" />,
            children: [
              {
                path: '/users',
                element: (
                  <Suspense fallback={<PageLoader />}>
                    <UsersPage />
                  </Suspense>
                ),
              },
            ],
          },
          {
            element: <RoleGuard requiredPermission="users.create" />,
            children: [
              {
                path: '/users/create',
                element: (
                  <Suspense fallback={<PageLoader />}>
                    <UserCreatePage />
                  </Suspense>
                ),
              },
            ],
          },
          {
            element: <RoleGuard requiredPermission="users.update" />,
            children: [
              {
                path: '/users/edit/:id',
                element: (
                  <Suspense fallback={<PageLoader />}>
                    <UserEditPage />
                  </Suspense>
                ),
              },
            ],
          },
          {
            element: <RoleGuard requiredPermission="roles.manage" />,
            children: [
              {
                path: '/settings/roles',
                element: (
                  <Suspense fallback={<PageLoader />}>
                    <RolesPage />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
