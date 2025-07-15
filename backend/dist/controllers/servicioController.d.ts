import { Request, Response, NextFunction } from 'express';
export declare class ServicioController {
    static getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getActive(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getByPriceRange(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=servicioController.d.ts.map