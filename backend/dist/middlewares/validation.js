"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = exports.validateLogin = exports.validateTurnoUpdate = exports.validateTurno = exports.validateUserUpdate = exports.validateUser = exports.validate = exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const response = {
            success: false,
            message: 'Errores de validación',
            error: 'VALIDATION_ERROR',
            data: errors.array()
        };
        res.status(400).json(response);
        return;
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        (0, exports.handleValidationErrors)(req, res, next);
    };
};
exports.validate = validate;
exports.validateUser = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Debe proporcionar un email válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('name')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres')
        .trim(),
    (0, express_validator_1.body)('phone')
        .optional()
        .isLength({ min: 8, max: 20 })
        .withMessage('El teléfono debe tener entre 8 y 20 caracteres'),
    exports.handleValidationErrors
];
exports.validateUserUpdate = [
    (0, express_validator_1.body)('name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres')
        .trim(),
    (0, express_validator_1.body)('phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('Debe proporcionar un número de teléfono válido'),
    exports.handleValidationErrors
];
exports.validateTurno = [
    (0, express_validator_1.body)('fecha')
        .isISO8601()
        .withMessage('La fecha debe estar en formato válido (YYYY-MM-DD)')
        .toDate(),
    (0, express_validator_1.body)('hora')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('La hora debe estar en formato HH:MM'),
    (0, express_validator_1.body)('servicio')
        .isLength({ min: 1, max: 100 })
        .withMessage('El servicio es requerido y debe tener máximo 100 caracteres')
        .trim(),
    (0, express_validator_1.body)('precio')
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número positivo'),
    (0, express_validator_1.body)('notas')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Las notas no pueden exceder 500 caracteres')
        .trim(),
    exports.handleValidationErrors
];
exports.validateTurnoUpdate = [
    (0, express_validator_1.body)('fecha')
        .optional()
        .isISO8601()
        .withMessage('La fecha debe estar en formato válido (YYYY-MM-DD)')
        .toDate(),
    (0, express_validator_1.body)('hora')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('La hora debe estar en formato HH:MM'),
    (0, express_validator_1.body)('servicio')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('El servicio debe tener máximo 100 caracteres')
        .trim(),
    (0, express_validator_1.body)('precio')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número positivo'),
    (0, express_validator_1.body)('estado')
        .optional()
        .isIn(['confirmado', 'cancelado', 'completado', 'reprogramado'])
        .withMessage('El estado debe ser válido'),
    (0, express_validator_1.body)('notas')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Las notas no pueden exceder 500 caracteres')
        .trim(),
    exports.handleValidationErrors
];
exports.validateLogin = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Debe proporcionar un email válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('La contraseña es requerida'),
    exports.handleValidationErrors
];
exports.validateRegister = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Debe proporcionar un email válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('name')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres')
        .trim(),
    (0, express_validator_1.body)('phone')
        .optional()
        .isLength({ min: 8, max: 20 })
        .withMessage('El teléfono debe tener entre 8 y 20 caracteres'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La contraseña debe contener al menos: una minúscula, una mayúscula y un número'),
    exports.handleValidationErrors
];
//# sourceMappingURL=validation.js.map