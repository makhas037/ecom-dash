import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Share2, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  const notifications = [
    { id: 1, type: 'success', message: 'New order received', time: '5 min ago', unread: true },
    { id: 2, type: 'info', message: 'Sales report generated', time: '1 hour ago', unread: true },
    { id: 3, type: 'warning', message: 'Low stock alert', time: '2 hours ago', unread: false },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search customers, products, orders..."
            role="search"
            aria-label="Global search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            className={`w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm transition-all duration-200 
              ${searchFocus ? 'border-purple-500 ring-2 ring-purple-100 bg-white' : 'border-gray-200'} 
              focus:outline-none placeholder-gray-500`}
          />
        </form>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4 ml-6">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} strokeWidth={2} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <p className="text-xs text-gray-500">You have 2 unread messages</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      notif.unread ? 'bg-purple-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notif.unread ? 'bg-purple-600' : 'bg-gray-300'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-200">
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Share/Export Icon */}
        <button 
          onClick={() => window.print()}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Share"
          title="Export Dashboard"
        >
          <Share2 size={20} strokeWidth={2} />
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200"></div>
        
        {/* User Profile */}
        <div className="relative" ref={userMenuRef}>
          <div 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
          >
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">Alex Jerome</p>
              <p className="text-xs text-gray-500">alexjerome@gmail.com</p>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100">
              <img 
                src="https://i.pravatar.cc/150?img=12" 
                alt="Alex Jerome"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="font-semibold text-gray-900">Alex Jerome</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/dashboard/profile');
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User size={16} />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/dashboard/settings');
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
              </div>
              <div className="border-t border-gray-200 py-1">
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to logout?')) {
                      localStorage.removeItem('authToken');
                      navigate('/login');
                    }
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
