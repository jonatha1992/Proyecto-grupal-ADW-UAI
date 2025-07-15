import jsonwebtoken from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { JwtPayload } from '@/types';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

// Funciones para manejo de JWT
export const generateToken = (payload: { userId: string; email: string }): string => {
  return jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jsonwebtoken.SignOptions);
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jsonwebtoken.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error('Error verificando token JWT:', error);
    return null;
  }
};

// Funciones para manejo de contraseñas
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcryptjs.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcryptjs.compare(password, hash);
};

// Validación de contraseña segura
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
