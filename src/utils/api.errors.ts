import { HTTP_STATUS } from '../config/constants';

export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public success: boolean;

  constructor(statusCode: number, message: string, isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const createBadRequestError = (message = "Bad request") => new ApiError(HTTP_STATUS.BAD_REQUEST, message);
export const createUnauthorizedError = (message = "Unauthorized - Please login") => new ApiError(HTTP_STATUS.UNAUTHORIZED, message);
export const createForbiddenError = (message = "Forbidden - You don't have permission") => new ApiError(HTTP_STATUS.FORBIDDEN, message);
export const createNotFoundError = (message = "Resource not found") => new ApiError(HTTP_STATUS.NOT_FOUND, message);
export const createConflictError = (message = "Resource already exists") => new ApiError(HTTP_STATUS.CONFLICT, message);
export const createValidationError = (message = "Validation error") => new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, message);
export const createInternalError = (message = "Internal server error") => new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message);