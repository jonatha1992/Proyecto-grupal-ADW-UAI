"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_1 = require("@/models/User");
const express_validator_1 = require("express-validator");
class UserController {
    static async updateProfile(req, res, next) {
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
            const { name, phone } = req.body;
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
            const updateData = {};
            if (name !== undefined)
                updateData.name = name;
            if (phone !== undefined)
                updateData.phone = phone;
            const updatedUser = await User_1.UserModel.update(user.id, updateData);
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
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteAccount(req, res, next) {
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
            await User_1.UserModel.delete(user.id);
            res.json({
                success: true,
                message: 'Cuenta eliminada exitosamente'
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map