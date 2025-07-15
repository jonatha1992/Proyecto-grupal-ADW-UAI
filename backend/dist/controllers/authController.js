"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = require("@/models/User");
const express_validator_1 = require("express-validator");
const auth_1 = require("@/utils/auth");
class AuthController {
    static async register(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    error: 'VALIDATION_ERROR',
                    data: errors.array()
                });
            }
            const { email, name, phone, password } = req.body;
            const existingUser = await User_1.UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'El email ya está registrado'
                });
            }
            const passwordValidation = (0, auth_1.validatePassword)(password);
            if (!passwordValidation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'La contraseña no cumple con los requisitos de seguridad',
                    errors: passwordValidation.errors
                });
            }
            const hashedPassword = await (0, auth_1.hashPassword)(password);
            const userData = {
                email,
                name,
                phone,
                password_hash: hashedPassword
            };
            const user = await User_1.UserModel.create(userData);
            const token = (0, auth_1.generateToken)({
                userId: user.id,
                email: user.email
            });
            const authResponse = {
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
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    error: 'VALIDATION_ERROR',
                    data: errors.array()
                });
            }
            const { email, password } = req.body;
            const user = await User_1.UserModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }
            const isValidPassword = await (0, auth_1.comparePassword)(password, user.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }
            const token = (0, auth_1.generateToken)({
                userId: user.id,
                email: user.email
            });
            const authResponse = {
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
        }
        catch (error) {
            next(error);
        }
    }
    static async getProfile(req, res, next) {
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
        }
        catch (error) {
            next(error);
        }
    }
    static async refreshToken(req, res, next) {
        try {
            const userId = req.user?.userId;
            const email = req.user?.email;
            if (!userId || !email) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                });
            }
            const token = (0, auth_1.generateToken)({
                userId,
                email
            });
            res.json({
                success: true,
                message: 'Token renovado exitosamente',
                data: { token }
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map