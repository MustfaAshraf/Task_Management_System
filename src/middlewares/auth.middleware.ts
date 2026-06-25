import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { createUnauthorizedError, createForbiddenError } from '../utils/api.errors';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(createUnauthorizedError('Not authorized, no token provided'));
    }

    const decoded: any = verifyToken(token);

    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    next(error)
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(createForbiddenError('Forbidden: You do not have permission to perform this action'));
    }
    next();
  };
};