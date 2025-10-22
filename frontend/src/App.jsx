import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './components/layout/Sidebar';
import ChatInterface from './components/gemini-chat/ChatInterface';

// Pages
import DashboardPage from './pages/DashboardPage';
import SalesPage from './pages/SalesPage';
import CustomersPage from './pages/CustomersPage';
import ProductsPage from './pages/ProductsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import FickAIPage from './pages/FickAIPage';
import DatasetsPage from './pages/DatasetsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Mobile Header */}
          <header className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">SalesRadar</h1>
            <div className="w-10" /> {/* Spacer */}
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/fick-ai" element={<FickAIPage />} />
              <Route path="/datasets" element={<DatasetsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>

        {/* Floating Chat Widget (on non-FickAI pages) */}
        <Routes>
          <Route path="/fick-ai" element={null} />
          <Route
            path="*"
            element={
              <>
                <ChatInterface isOpen={chatOpen} onClose={() => setChatOpen(false)} />
                {!chatOpen && (
                  <button
                    onClick={() => setChatOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all z-40 flex items-center justify-center"
                  >
                    <span className="text-2xl">🤖</span>
                  </button>
                )}
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
