// src/components/forms/LoginForm.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../services/validationSchemas';
import { useAuth } from '../../context/AppContext';
import { FcGoogle } from 'react-icons/fc';
import './Forms.css';

function LoginForm({ onToggle }) {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    await auth.login(data.email, data.password);
    setIsLoading(false);
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Welcome Back</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <input type="email" placeholder="Email Address" {...register("email")} />
          {errors.email && <p className="form-error-popup">{errors.email.message}</p>}
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" {...register("password")} />
          {errors.password && <p className="form-error-popup">{errors.password.message}</p>}
        </div>
        <motion.button type="submit" className="form-button primary" disabled={isLoading} whileTap={{ scale: 0.98 }}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </motion.button>
      </form>
      <div className="form-divider"><span>or continue with</span></div>
      <motion.button onClick={auth.googleLogin} className="form-button google" whileTap={{ scale: 0.98 }}>
        <FcGoogle /> Google
      </motion.button>
      <p className="form-toggle">
        Don't have an account? <span onClick={onToggle}>Sign Up</span>
      </p>
    </div>
  );
}

export default LoginForm;
