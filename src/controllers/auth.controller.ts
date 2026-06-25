import { NextFunction, Request, Response } from 'express';
import { createResponse, successResponse } from '../utils/api.response';
import * as authService from '../services/auth.service';
import { asyncHandler } from '../utils/async.handler';

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const data = await authService.register(req.body);

  const response = createResponse(data, 'User registered successfully');
  res.status(response.statusCode).json(response);
})

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const data = await authService.login(req.body);

  const response = successResponse(data, 'Login successful');
  res.status(response.statusCode).json(response);
})

export const refresh = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;

  const tokens = await authService.refreshAuthTokens(refreshToken);

  const response = successResponse(tokens, 'Tokens refreshed successfully');
  res.status(response.statusCode).json(response);
})