import { Request, Response, NextFunction } from 'express';
import { UserModel } from '@/models/User';
import { UpdateUserDto } from '@/types';
import { validationResult } from 'express-validator';

export class UserController {
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de validación incorrectos',
          errors: errors.array()
        });
      }

      const userId = req.user?.userId;
      const { name, phone } = req.body;

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

      const updateData: UpdateUserDto = {};
      if (name !== undefined) updateData.name = name;
      if (phone !== undefined) updateData.phone = phone;

      const updatedUser = await UserModel.update(user.id, updateData);

      res.json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: {
          id: updatedUser?.id,
          email: updatedUser?.email,
          name: updatedUser?.name,
          phone: updatedUser?.phone,
          updated_at: updatedUser?.updated_at
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteAccount(req: Request, res: Response, next: NextFunction) {
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

      await UserModel.delete(user.id);

      res.json({
        success: true,
        message: 'Cuenta eliminada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
}
