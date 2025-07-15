import { Request, Response, NextFunction } from 'express';
import { ValidationChain } from 'express-validator';
export declare const handleValidationErrors: (req: Request, res: Response, next: NextFunction) => void;
export declare const validate: (validations: ValidationChain[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const validateUser: (((req: Request, res: Response, next: NextFunction) => void) | ValidationChain)[];
export declare const validateUserUpdate: (((req: Request, res: Response, next: NextFunction) => void) | ValidationChain)[];
export declare const validateTurno: (((req: Request, res: Response, next: NextFunction) => void) | ValidationChain)[];
export declare const validateTurnoUpdate: (((req: Request, res: Response, next: NextFunction) => void) | ValidationChain)[];
export declare const validateLogin: (((req: Request, res: Response, next: NextFunction) => void) | ValidationChain)[];
export declare const validateRegister: (((req: Request, res: Response, next: NextFunction) => void) | ValidationChain)[];
//# sourceMappingURL=validation.d.ts.map