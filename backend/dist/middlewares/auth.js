"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateToken = void 0;
const auth_1 = require("@/utils/auth");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const response = {
                success: false,
                message: 'Token de acceso requerido',
                error: 'MISSING_TOKEN'
            };
            res.status(401).json(response);
            return;
        }
        const token = authHeader.substring(7);
        const decoded = (0, auth_1.verifyToken)(token);
        if (!decoded) {
            const response = {
                success: false,
                message: 'Token inválido o expirado',
                error: 'INVALID_TOKEN'
            };
            res.status(401).json(response);
            return;
        }
        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };
        next();
    }
    catch (error) {
        console.error('Error en middleware de autenticación:', error);
        const response = {
            success: false,
            message: 'Error interno del servidor',
            error: 'INTERNAL_ERROR'
        };
        res.status(500).json(response);
    }
};
exports.authenticateToken = authenticateToken;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = (0, auth_1.verifyToken)(token);
            if (decoded) {
                req.user = {
                    userId: decoded.userId,
                    email: decoded.email
                };
            }
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map