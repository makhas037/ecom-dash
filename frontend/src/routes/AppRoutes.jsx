import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Spinner from '../components/common/Spinner';

// Lazy load pages
const HomePage = lazy(() => import('../pages/HomePage/HomePage'));
const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const SalesDeepDive = lazy(() => import('../pages/Dashboard/SalesDeepDive'));
const CustomersMarketing = lazy(() => import('../pages/Dashboard/CustomersMarketing'));
const ProductInventory = lazy(() => import('../pages/Dashboard/ProductInventory'));
const Executive = lazy(() => import('../pages/Dashboard/Executive'));
const Reports = lazy(() => import('../pages/Dashboard/Reports'));
const Settings = lazy(() => import('../pages/Dashboard/Settings'));
const NotFound = lazy(() => import('../pages/ErrorPage/NotFound'));

function AppRoutes() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/sales" element={<SalesDeepDive />} />
        <Route path="/dashboard/customers" element={<CustomersMarketing />} />
        <Route path="/dashboard/products" element={<ProductInventory />} />
        <Route path="/dashboard/executive" element={<Executive />} />
        <Route path="/dashboard/reports" element={<Reports />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
