import { Request, Response, NextFunction } from 'express';
import { UserModel } from '@/models/User';
import { CreateUserDto, LoginDto, AuthResponse } from '@/types';
import { validationResult } from 'express-validator';
import { hashPassword, comparePassword, generateToken, validatePassword } from '@/utils/auth';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Errores de validación',
          error: 'VALIDATION_ERROR',
          data: errors.array()
        });
      }

      const { email, name, phone, password } = req.body;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está registrado'
        });
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña no cumple con los requisitos de seguridad',
          errors: passwordValidation.errors
        });
      }

      const hashedPassword = await hashPassword(password);

      const userData: CreateUserDto = {
        email,
        name,
        phone,
        password_hash: hashedPassword
      };

      const user = await UserModel.create(userData);

      const token = generateToken({
        userId: user.id,
        email: user.email
      });

      const authResponse: AuthResponse = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone
        },
        token
      };

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: authResponse
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Errores de validación',
          error: 'VALIDATION_ERROR',
          data: errors.array()
        });
      }

      const { email, password }: LoginDto = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Verificar contraseña
      const isValidPassword = await comparePassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Generar token JWT
      const token = generateToken({
        userId: user.id,
        email: user.email
      });

      // Respuesta de autenticación
      const authResponse: AuthResponse = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone
        },
        token
      };

      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: authResponse
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const email = req.user?.email;

      if (!userId || !email) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      // Generar nuevo token
      const token = generateToken({
        userId,
        email
      });

      res.json({
        success: true,
        message: 'Token renovado exitosamente',
        data: { token }
      });
    } catch (error) {
      next(error);
    }
  }
}
