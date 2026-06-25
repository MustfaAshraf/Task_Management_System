import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';

export const asyncHandler = (fn: Function) => {
  return (req: Request | AuthRequest, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};