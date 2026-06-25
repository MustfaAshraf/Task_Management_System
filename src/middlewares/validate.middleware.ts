import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';
import { createValidationError } from '../utils/api.errors';

export const validate = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => {
          const fieldName = String(issue.path[issue.path.length - 1]);
          return `${fieldName}: ${issue.message}`;
        }).join(', ');
        
        next(createValidationError(errorMessages));
      } else {
        next(error);
      }
    }
  };
};