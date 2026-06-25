import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string({ message: 'Name must be a string' })
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters'),
      
    email: z.string({ message: 'Email is required' })
      .pipe(z.email('Invalid email address')),
      
    password: z.string({ message: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long'),
      
    role: z.enum(['Admin', 'Member']).optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ message: 'Email is required' })
    .pipe(z.email('Invalid email address')),
    password: z.string({ message: 'Password is required' })
    .min(1, 'Password cannot be empty')
  })
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string({ message: 'Refresh token is required' })
    .min(1, 'Refresh token cannot be empty')
  })
});