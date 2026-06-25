import jwt from 'jsonwebtoken';
import { createUnauthorizedError } from './api.errors';

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

export const generateRefreshToken = (payload: object) => {
  const secret = (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET) as string;
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const verifyToken = (token: string, isRefresh = false) => {
  try {
    const secret = isRefresh 
        ? (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET) as string 
        : process.env.JWT_SECRET as string;
        
    return jwt.verify(token, secret);
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw createUnauthorizedError('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw createUnauthorizedError('Invalid token');
    }
    throw createUnauthorizedError('Token verification failed');
  }
};