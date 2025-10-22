import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
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
import ChatInterface from './components/gemini-chat/ChatInterface';
import { MessageCircle } from 'lucide-react';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Sidebar />
            <div className="flex-1 ml-56 flex flex-col">
              <Navbar />
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/analytics" element={<Analytics />} />
                  <Route path="/dashboard/explore" element={<Explore />} />
                  <Route path="/dashboard/customers" element={<Customers />} />
                  <Route path="/dashboard/integration" element={<Integration />} />
                  <Route path="/dashboard/messages" element={<Messages />} />
                  <Route path="/dashboard/reviews" element={<Reviews />} />
                  <Route path="/dashboard/settings" element={<Settings />} />
                  <Route path="/help" element={<HelpCenter />} />
                  <Route path="/about" element={<About />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
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

            {/* AI Chat Interface */}
            <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
