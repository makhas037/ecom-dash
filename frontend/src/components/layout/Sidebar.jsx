import React from 'react';
import {
  LayoutGrid,
  TrendingUp,
  Search,
  User,
  Puzzle,
  MessageSquare,
  Star,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const mainMenuItems = [
    { icon: LayoutGrid, label: 'Business Overview', path: '/dashboard' },
    { icon: TrendingUp, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: Search, label: 'Business Explore', path: '/dashboard/explore' },
    { icon: User, label: 'Customers', path: '/dashboard/customers' },
    { icon: Puzzle, label: 'Integration', path: '/dashboard/integration' },
  ];

  const settingsItems = [
    { icon: MessageSquare, label: 'Messages', path: '/dashboard/messages' },
    { icon: Star, label: 'Customer Reviews', path: '/dashboard/reviews' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('authToken');
      navigate('/login');
    }
  };

  return (
    <div className="w-56 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed left-0 top-0 z-50 transition-colors duration-200">
      {/* Logo - NOW LINKS TO ABOUT PAGE */}
      <div className="h-16 px-4 flex items-center border-b border-gray-200 dark:border-gray-700">
        <Link 
          to="/about" 
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">FiberOps</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {/* Main Menu */}
        <div className="px-3 mb-6">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">Main Menu</p>
          <div className="space-y-0.5">
            {mainMenuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`
                  flex items-center space-x-2.5 px-3 py-2.5 rounded-lg 
                  transition-all duration-200 group relative overflow-hidden
                  ${isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                  }
                `}
              >
                {!isActive(item.path) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />
                )}
                
                <item.icon 
                  size={18} 
                  strokeWidth={2}
                  className="relative z-10"
                />
                <span className="text-sm font-medium relative z-10">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="px-3">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">Settings</p>
          <div className="space-y-0.5">
            {settingsItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`
                  flex items-center space-x-2.5 px-3 py-2.5 rounded-lg 
                  transition-all duration-200 group relative overflow-hidden
                  ${isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                  }
                `}
              >
                {!isActive(item.path) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />
                )}
                
                <item.icon 
                  size={18}
                  strokeWidth={2}
                  className="relative z-10"
                />
                <span className="text-sm font-medium relative z-10">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-0.5">
        <Link 
          to="/help"
          className="flex items-center space-x-2.5 px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 rounded-lg w-full transition-all duration-200 group"
        >
          <HelpCircle size={18} strokeWidth={2} className="relative z-10" />
          <span className="text-sm font-medium relative z-10">Help Center</span>
        </Link>
        
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2.5 px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-full transition-all duration-200 group"
        >
          <LogOut size={18} strokeWidth={2} className="relative z-10" />
          <span className="text-sm font-medium relative z-10">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
