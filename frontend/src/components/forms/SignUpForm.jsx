// src/components/forms/SignUpForm.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '../../services/validationSchemas';
import { useAuth } from '../../context/AppContext';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './Forms.css';

function SignUpForm({ onToggle }) {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { register, handleSubmit, formState: { errors }, setValue, trigger } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    await auth.signUp(data);
    setIsLoading(false);
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Create an Account</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <input type="text" placeholder="Full Name" {...register("name")} />
          {errors.name && <p className="form-error-popup">{errors.name.message}</p>}
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" {...register("email")} />
          {errors.email && <p className="form-error-popup">{errors.email.message}</p>}
        </div>
        <div className="form-group">
          <PhoneInput
            placeholder="Phone Number"
            defaultCountry="IN"
            className="phone-input"
            onChange={value => {
              setValue("phone", value);
              trigger("phone"); // Trigger validation on change
            }}
          />
          {errors.phone && <p className="form-error-popup">{errors.phone.message}</p>}
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" {...register("password")} />
          {errors.password && <p className="form-error-popup">{errors.password.message}</p>}
        </div>
        <motion.button type="submit" className="form-button primary" disabled={isLoading} whileTap={{ scale: 0.98 }}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </motion.button>
      </form>
      <p className="form-toggle">
        Already have an account? <span onClick={onToggle}>Sign In</span>
      </p>
    </div>
  );
}

export default SignUpForm;
