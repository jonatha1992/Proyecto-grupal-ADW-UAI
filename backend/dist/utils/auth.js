"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.comparePassword = exports.hashPassword = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return decoded;
    }
    catch (error) {
        console.error('Error verificando token JWT:', error);
        return null;
    }
};
exports.verifyToken = verifyToken;
const hashPassword = async (password) => {
    const saltRounds = 12;
    return await bcryptjs_1.default.hash(password, saltRounds);
};
exports.hashPassword = hashPassword;
const comparePassword = async (password, hash) => {
    return await bcryptjs_1.default.compare(password, hash);
};
exports.comparePassword = comparePassword;
const validatePassword = (password) => {
    const errors = [];
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
exports.validatePassword = validatePassword;
//# sourceMappingURL=auth.js.map