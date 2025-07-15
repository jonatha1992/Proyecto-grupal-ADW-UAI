import { JwtPayload } from '@/types';
export declare const generateToken: (payload: {
    userId: string;
    email: string;
}) => string;
export declare const verifyToken: (token: string) => JwtPayload | null;
export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (password: string, hash: string) => Promise<boolean>;
export declare const validatePassword: (password: string) => {
    isValid: boolean;
    errors: string[];
};
//# sourceMappingURL=auth.d.ts.map