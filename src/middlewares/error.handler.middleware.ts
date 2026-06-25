import { Request, Response, NextFunction } from 'express';
import { ApiError, createNotFoundError } from '../utils/api.errors';
import { HTTP_STATUS } from '../config/constants';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(createNotFoundError(`Not Found - ${req.originalUrl}`));
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Resource not found',
    });
  }

  console.error(err);
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};