import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/auth';
import { ApiResponse } from '@/types';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response: ApiResponse = {
        success: false,
        message: 'Token de acceso requerido',
        error: 'MISSING_TOKEN'
      };
      res.status(401).json(response);
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      const response: ApiResponse = {
        success: false,
        message: 'Token inválido o expirado',
        error: 'INVALID_TOKEN'
      };
      res.status(401).json(response);
      return;
    }

    // Agregar información del usuario a la request
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR'
    };
    res.status(500).json(response);
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      
      if (decoded) {
        req.user = {
          userId: decoded.userId,
          email: decoded.email
        };
      }
    }
    
    next();
  } catch (error) {
    // En auth opcional, continuamos sin error
    next();
  }
};
