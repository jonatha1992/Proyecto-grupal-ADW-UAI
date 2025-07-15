import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, body } from 'express-validator';
import { ApiResponse } from '@/types';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const response: ApiResponse = {
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

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await Promise.all(validations.map(validation => validation.run(req)));
    handleValidationErrors(req, res, next);
  };
};

// Validaciones para usuario
export const validateUser = [
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .trim(),
  body('phone')
    .optional()
    .isLength({ min: 8, max: 20 })
    .withMessage('El teléfono debe tener entre 8 y 20 caracteres'),
  handleValidationErrors
];

export const validateUserUpdate = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .trim(),
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Debe proporcionar un número de teléfono válido'),
  handleValidationErrors
];

// Validaciones para turno
export const validateTurno = [
  body('fecha')
    .isISO8601()
    .withMessage('La fecha debe estar en formato válido (YYYY-MM-DD)')
    .toDate(),
  body('hora')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('La hora debe estar en formato HH:MM'),
  body('servicio')
    .isLength({ min: 1, max: 100 })
    .withMessage('El servicio es requerido y debe tener máximo 100 caracteres')
    .trim(),
  body('precio')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  body('notas')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Las notas no pueden exceder 500 caracteres')
    .trim(),
  handleValidationErrors
];

export const validateTurnoUpdate = [
  body('fecha')
    .optional()
    .isISO8601()
    .withMessage('La fecha debe estar en formato válido (YYYY-MM-DD)')
    .toDate(),
  body('hora')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('La hora debe estar en formato HH:MM'),
  body('servicio')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('El servicio debe tener máximo 100 caracteres')
    .trim(),
  body('precio')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  body('estado')
    .optional()
    .isIn(['confirmado', 'cancelado', 'completado', 'reprogramado'])
    .withMessage('El estado debe ser válido'),
  body('notas')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Las notas no pueden exceder 500 caracteres')
    .trim(),
  handleValidationErrors
];

// Validaciones para autenticación
export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
  handleValidationErrors
];

export const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .trim(),
  body('phone')
    .optional()
    .isLength({ min: 8, max: 20 })
    .withMessage('El teléfono debe tener entre 8 y 20 caracteres'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos: una minúscula, una mayúscula y un número'),
  handleValidationErrors
];
