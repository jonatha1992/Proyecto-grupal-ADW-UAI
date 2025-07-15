import { Request, Response, NextFunction } from 'express';
import { ServicioModel } from '@/models/Servicio';

export class ServicioController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const activo = req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined;
      const offset = (page - 1) * limit;

      const servicios = await ServicioModel.findAll(activo, limit, offset);
      const total = await ServicioModel.count(activo);

      res.json({
        success: true,
        data: servicios,
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

      const servicio = await ServicioModel.findById(id);
      if (!servicio) {
        return res.status(404).json({
          success: false,
          message: 'Servicio no encontrado'
        });
      }

      res.json({
        success: true,
        data: servicio
      });
    } catch (error) {
      next(error);
    }
  }

  static async getActive(req: Request, res: Response, next: NextFunction) {
    try {
      const servicios = await ServicioModel.findActive();

      res.json({
        success: true,
        data: servicios
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByPriceRange(req: Request, res: Response, next: NextFunction) {
    try {
      const minPrice = parseFloat(req.query.min as string) || 0;
      const maxPrice = parseFloat(req.query.max as string) || 999999;

      const servicios = await ServicioModel.findByPriceRange(minPrice, maxPrice);

      res.json({
        success: true,
        data: servicios
      });
    } catch (error) {
      next(error);
    }
  }
}
