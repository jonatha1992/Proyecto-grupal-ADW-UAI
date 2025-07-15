"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnoController = void 0;
const Turno_1 = require("@/models/Turno");
const User_1 = require("@/models/User");
const types_1 = require("@/types");
const express_validator_1 = require("express-validator");
class TurnoController {
    static async create(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
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
            const user = await User_1.UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado. Debe registrarse primero.'
                });
            }
            const { fecha, hora, servicio, precio, notas } = req.body;
            const existingTurno = await Turno_1.TurnoModel.findByFechaHora(fecha, hora);
            if (existingTurno && existingTurno.estado !== types_1.TurnoEstado.CANCELADO) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe un turno reservado para esa fecha y hora'
                });
            }
            const turnoData = {
                fecha,
                hora,
                servicio,
                precio,
                notas
            };
            const turno = await Turno_1.TurnoModel.create(user.id, turnoData);
            res.status(201).json({
                success: true,
                message: 'Turno creado exitosamente',
                data: turno
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getUserTurnos(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                });
            }
            const user = await User_1.UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const estado = req.query.estado;
            const offset = (page - 1) * limit;
            const turnos = await Turno_1.TurnoModel.findByUserId(user.id, estado, limit, offset);
            const total = await Turno_1.TurnoModel.countByUserId(user.id, estado);
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
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                });
            }
            const user = await User_1.UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }
            const turno = await Turno_1.TurnoModel.findById(id);
            if (!turno) {
                return res.status(404).json({
                    success: false,
                    message: 'Turno no encontrado'
                });
            }
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
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
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
            const user = await User_1.UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }
            const turno = await Turno_1.TurnoModel.findById(id);
            if (!turno) {
                return res.status(404).json({
                    success: false,
                    message: 'Turno no encontrado'
                });
            }
            if (turno.user_id !== user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para modificar este turno'
                });
            }
            const { fecha, hora, servicio, precio, estado, notas } = req.body;
            if (fecha || hora) {
                const newFecha = fecha || turno.fecha;
                const newHora = hora || turno.hora;
                const existingTurno = await Turno_1.TurnoModel.findByFechaHora(newFecha, newHora);
                if (existingTurno && existingTurno.id !== id && existingTurno.estado !== types_1.TurnoEstado.CANCELADO) {
                    return res.status(400).json({
                        success: false,
                        message: 'Ya existe un turno reservado para esa fecha y hora'
                    });
                }
            }
            const updateData = {};
            if (fecha !== undefined)
                updateData.fecha = fecha;
            if (hora !== undefined)
                updateData.hora = hora;
            if (servicio !== undefined)
                updateData.servicio = servicio;
            if (precio !== undefined)
                updateData.precio = precio;
            if (estado !== undefined)
                updateData.estado = estado;
            if (notas !== undefined)
                updateData.notas = notas;
            const updatedTurno = await Turno_1.TurnoModel.update(id, updateData);
            res.json({
                success: true,
                message: 'Turno actualizado exitosamente',
                data: updatedTurno
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async cancel(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                });
            }
            const user = await User_1.UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }
            const turno = await Turno_1.TurnoModel.findById(id);
            if (!turno) {
                return res.status(404).json({
                    success: false,
                    message: 'Turno no encontrado'
                });
            }
            if (turno.user_id !== user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para cancelar este turno'
                });
            }
            if (turno.estado === types_1.TurnoEstado.CANCELADO) {
                return res.status(400).json({
                    success: false,
                    message: 'El turno ya está cancelado'
                });
            }
            const updatedTurno = await Turno_1.TurnoModel.update(id, { estado: types_1.TurnoEstado.CANCELADO });
            res.json({
                success: true,
                message: 'Turno cancelado exitosamente',
                data: updatedTurno
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAvailableSlots(req, res, next) {
        try {
            const { fecha } = req.query;
            if (!fecha) {
                return res.status(400).json({
                    success: false,
                    message: 'La fecha es requerida'
                });
            }
            const availableSlots = await Turno_1.TurnoModel.getAvailableSlots(fecha);
            res.json({
                success: true,
                data: availableSlots
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TurnoController = TurnoController;
//# sourceMappingURL=turnoController.js.map