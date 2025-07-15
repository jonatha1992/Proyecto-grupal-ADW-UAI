import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@/types';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Error interno del servidor';
  
  console.error('Error capturado:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  const response: ApiResponse = {
    success: false,
    message: message,
    error: process.env.NODE_ENV === 'development' ? error.stack : 'INTERNAL_ERROR'
  };

  res.status(statusCode).json(response);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const response: ApiResponse = {
    success: false,
    message: `Ruta ${req.originalUrl} no encontrada`,
    error: 'NOT_FOUND'
  };
  
  res.status(404).json(response);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
