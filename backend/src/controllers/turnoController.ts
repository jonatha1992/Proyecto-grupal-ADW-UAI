import { Request, Response, NextFunction } from 'express';
import { TurnoModel } from '@/models/Turno';
import { UserModel } from '@/models/User';
import { CreateTurnoDto, UpdateTurnoDto, TurnoEstado } from '@/types';
import { validationResult } from 'express-validator';

export class TurnoController {
  static async create(req: Request, res: Response, next: NextFunction) {
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
          message: 'Usuario no encontrado. Debe registrarse primero.'
        });
      }

      const { fecha, hora, servicio, precio, notas } = req.body;

      const existingTurno = await TurnoModel.findByFechaHora(fecha, hora);
      if (existingTurno && existingTurno.estado !== TurnoEstado.CANCELADO) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un turno reservado para esa fecha y hora'
        });
      }

      const turnoData: CreateTurnoDto = {
        fecha,
        hora,
        servicio,
        precio,
        notas
      };

      const turno = await TurnoModel.create(user.id, turnoData);

      res.status(201).json({
        success: true,
        message: 'Turno creado exitosamente',
        data: turno
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserTurnos(req: Request, res: Response, next: NextFunction) {
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

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const estado = req.query.estado as TurnoEstado;
      const offset = (page - 1) * limit;

      const turnos = await TurnoModel.findByUserId(user.id, estado, limit, offset);
      const total = await TurnoModel.countByUserId(user.id, estado);

      res.json({
        success: true,
        data: turnos,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
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

      const turno = await TurnoModel.findById(id);
      if (!turno) {
        return res.status(404).json({
          success: false,
          message: 'Turno no encontrado'
        });
      }

      // Verificar que el turno pertenece al usuario
      if (turno.user_id !== user.id) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para ver este turno'
        });
      }

      res.json({
        success: true,
        data: turno
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de validación incorrectos',
          errors: errors.array()
        });
      }

      const { id } = req.params;
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

      const turno = await TurnoModel.findById(id);
      if (!turno) {
        return res.status(404).json({
          success: false,
          message: 'Turno no encontrado'
        });
      }

      // Verificar que el turno pertenece al usuario
      if (turno.user_id !== user.id) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para modificar este turno'
        });
      }

      const { fecha, hora, servicio, precio, estado, notas } = req.body;

      // Si se está cambiando fecha/hora, verificar conflictos
      if (fecha || hora) {
        const newFecha = fecha || turno.fecha;
        const newHora = hora || turno.hora;
        
        const existingTurno = await TurnoModel.findByFechaHora(newFecha, newHora);
        if (existingTurno && existingTurno.id !== id && existingTurno.estado !== TurnoEstado.CANCELADO) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe un turno reservado para esa fecha y hora'
          });
        }
      }

      const updateData: UpdateTurnoDto = {};
      if (fecha !== undefined) updateData.fecha = fecha;
      if (hora !== undefined) updateData.hora = hora;
      if (servicio !== undefined) updateData.servicio = servicio;
      if (precio !== undefined) updateData.precio = precio;
      if (estado !== undefined) updateData.estado = estado;
      if (notas !== undefined) updateData.notas = notas;

      const updatedTurno = await TurnoModel.update(id, updateData);

      res.json({
        success: true,
        message: 'Turno actualizado exitosamente',
        data: updatedTurno
      });
    } catch (error) {
      next(error);
    }
  }

  static async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
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

      const turno = await TurnoModel.findById(id);
      if (!turno) {
        return res.status(404).json({
          success: false,
          message: 'Turno no encontrado'
        });
      }

      // Verificar que el turno pertenece al usuario
      if (turno.user_id !== user.id) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para cancelar este turno'
        });
      }

      // Verificar que el turno no esté ya cancelado
      if (turno.estado === TurnoEstado.CANCELADO) {
        return res.status(400).json({
          success: false,
          message: 'El turno ya está cancelado'
        });
      }

      const updatedTurno = await TurnoModel.update(id, { estado: TurnoEstado.CANCELADO });

      res.json({
        success: true,
        message: 'Turno cancelado exitosamente',
        data: updatedTurno
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAvailableSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const { fecha } = req.query;

      if (!fecha) {
        return res.status(400).json({
          success: false,
          message: 'La fecha es requerida'
        });
      }

      const availableSlots = await TurnoModel.getAvailableSlots(fecha as string);

      res.json({
        success: true,
        data: availableSlots
      });
    } catch (error) {
      next(error);
    }
  }
}
