import { Request, Response, NextFunction } from 'express';
export declare class UserController {
    static updateProfile(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteAccount(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=userController.d.ts.map