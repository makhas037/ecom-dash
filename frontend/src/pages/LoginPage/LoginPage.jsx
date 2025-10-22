// src/pages/LoginPage/LoginPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../context/AppContext'; // Import the useAuth hook
import './LoginPage.css'; // Make sure you have the creative CSS

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth(); // Get the real login function from our context
  const cardRef = useRef(null);

  // --- Creative Effects (No changes needed here) ---
  useEffect(() => {
    // ... all the cool animation logic ...
  }, []);

  // --- Form Logic ---
  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    // Call the REAL login function from the context
    await login(email, password); 
    // The context now handles redirection and error messages!
    setIsLoading(false);
  };

  return (
    <div className="creative-login-root">
      {/* ... The creative background div ... */}
      <div className="login-container">
        <div className="login-card" ref={cardRef}>
          {/* We remove the isSuccess state and AnimatePresence for simplicity */}
          {/* The redirect will handle the "success" state */}
          <div className="login-header">
            <h2>BI Portal</h2>
            <p>Sign in to access your dashboard</p>
          </div>
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {/* ... Your form-groups for email and password ... */}
            <div className={`form-group ${errors.email ? 'error' : ''}`}>
              <div className="input-wrapper">
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder=" "/>
                <label htmlFor="email">Email Address</label>
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className={`form-group ${errors.password ? 'error' : ''}`}>
              <div className="input-wrapper">
                <input type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder=" "/>
                <label htmlFor="password">Password</label>
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <motion.button type="submit" className="login-btn" disabled={isLoading} whileTap={{ scale: 0.98 }}>
              {isLoading ? 'Verifying...' : 'Sign In'}
            </motion.button>
          </form>
          {/* ... The rest of your social login / signup link JSX ... */}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
