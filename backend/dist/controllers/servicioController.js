"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioController = void 0;
const Servicio_1 = require("@/models/Servicio");
class ServicioController {
    static async getAll(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const activo = req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined;
            const offset = (page - 1) * limit;
            const servicios = await Servicio_1.ServicioModel.findAll(activo, limit, offset);
            const total = await Servicio_1.ServicioModel.count(activo);
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
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const servicio = await Servicio_1.ServicioModel.findById(id);
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
        }
        catch (error) {
            next(error);
        }
    }
    static async getActive(req, res, next) {
        try {
            const servicios = await Servicio_1.ServicioModel.findActive();
            res.json({
                success: true,
                data: servicios
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getByPriceRange(req, res, next) {
        try {
            const minPrice = parseFloat(req.query.min) || 0;
            const maxPrice = parseFloat(req.query.max) || 999999;
            const servicios = await Servicio_1.ServicioModel.findByPriceRange(minPrice, maxPrice);
            res.json({
                success: true,
                data: servicios
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ServicioController = ServicioController;
//# sourceMappingURL=servicioController.js.map