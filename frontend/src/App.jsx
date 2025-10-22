import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import ChatInterface from './components/gemini-chat/ChatInterface';
import { MessageCircle } from 'lucide-react';

// Public Pages
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import AuthCallback from './pages/AuthCallback';

// Protected Pages
import Dashboard from './pages/Dashboard/index';
import Analytics from './pages/Dashboard/Analytics';
import Explore from './pages/Dashboard/Explore';
import Customers from './pages/Dashboard/Customers';
import Integration from './pages/Dashboard/Integration';
import Messages from './pages/Dashboard/Messages';
import Reviews from './pages/Dashboard/Reviews';
import Settings from './pages/Dashboard/Settings';
import HelpCenter from './pages/Dashboard/HelpCenter';
import About from './pages/Dashboard/About';
import FickAIPage from './pages/FickAIPage';
import DatasetsPage from './pages/DatasetsPage';

// Dashboard Layout Wrapper
const DashboardLayout = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 ml-56 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* AI Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40 hover:scale-110"
        aria-label="Open AI Chat"
      >
        <MessageCircle size={24} />
      </button>

      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Protected Routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/analytics"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Analytics />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/explore"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Explore />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/customers"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Customers />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/integration"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Integration />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/messages"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Messages />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/reviews"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Reviews />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/settings"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Settings />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/help"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <HelpCenter />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <About />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/fick-ai"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <FickAIPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/datasets"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <DatasetsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
