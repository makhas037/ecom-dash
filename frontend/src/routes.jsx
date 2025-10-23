import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Pages
import HomePage from './pages/HomePage/HomePage';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage';
import Customers from './pages/Customers';

// Marketing
import CampaignPerformance from './pages/Marketing/CampaignPerformance';
import ROIAnalysis from './pages/Marketing/ROIAnalysis';

// Products
import InventoryManagement from './pages/Products/InventoryManagement';
import ProductCatalog from './pages/Products/ProductCatalog';

// Sales
import SalesOverview from './pages/Sales/SalesOverview';
import SalesReports from './pages/Sales/SalesReports';

// Organized folders
import FickAIPage from './pages/FickAI';
import DatasetsPage from './pages/Datasets';
import SettingsPage from './pages/Settings';
import AuthCallback from './pages/Auth';

// Error pages
import NotFound from './pages/ErrorPage/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'customers', element: <Customers /> },
      
      // Marketing
      { path: 'marketing/campaigns', element: <CampaignPerformance /> },
      { path: 'marketing/roi', element: <ROIAnalysis /> },
      
      // Products
      { path: 'products/inventory', element: <InventoryManagement /> },
      { path: 'products/catalog', element: <ProductCatalog /> },
      
      // Sales
      { path: 'sales/overview', element: <SalesOverview /> },
      { path: 'sales/reports', element: <SalesReports /> },
      
      // Organized pages
      { path: 'fickai', element: <FickAIPage /> },
      { path: 'datasets', element: <DatasetsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ]
  },
  // Auth routes (no layout)
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/auth/callback', element: <AuthCallback /> },
  { path: '*', element: <NotFound /> }
]);

export default router;
