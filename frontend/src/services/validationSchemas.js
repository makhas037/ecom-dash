// src/services/validationSchemas.js
import { z } from 'zod';

// Schema for the Login Form
export const loginSchema = z.object({
  email: z.string().email({ message: "A valid email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Schema for the Sign-Up Form
export const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "A valid email is required" }),
  phone: z.string().min(10, { message: "A valid phone number is required" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});
