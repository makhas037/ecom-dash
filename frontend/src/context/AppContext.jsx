// src/context/AppContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Auth Context ---
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user-profile')));
  const [notification, setNotification] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const login = async (email, password) => {
    // Check for the special 'admin' credentials
    if (email === 'admin' && password === 'admin') {
      const adminUser = { name: 'Admin', email: 'admin@system.io' };
      setUser(adminUser);
      localStorage.setItem('user-profile', JSON.stringify(adminUser));
      // Redirect to the dashboard page on successful login
      navigate('/dashboard'); 
      return { success: true };
    }
    
    // Here you would check your real database for other users
    // For now, we'll just show an error for anything else.
    showNotification('Invalid email or password.');
    return { success: false };
  };
  
  const logout = () => {
    localStorage.removeItem('user-profile');
    setUser(null);
    navigate('/login');
  };

  const value = { user, login, logout, notification, showNotification, clearNotification: () => setNotification({ message: '', type: '' }) };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

// --- Theme Context (if you have it) ---
// ... your ThemeProvider and useTheme code ...
