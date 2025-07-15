import { Request } from 'express';
export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
}
export interface CreateUserDto {
    email: string;
    name: string;
    phone?: string;
    password_hash: string;
}
export interface UpdateUserDto {
    name?: string;
    phone?: string;
}
export interface LoginDto {
    email: string;
    password: string;
}
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string;
        phone?: string;
    };
    token: string;
}
export interface JwtPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}
export interface Turno {
    id: string;
    user_id: string;
    fecha: Date;
    hora: string;
    servicio: string;
    precio: number;
    estado: TurnoEstado;
    notas?: string;
    created_at: Date;
    updated_at: Date;
}
export declare enum TurnoEstado {
    CONFIRMADO = "confirmado",
    CANCELADO = "cancelado",
    COMPLETADO = "completado",
    REPROGRAMADO = "reprogramado"
}
export interface CreateTurnoDto {
    fecha: string;
    hora: string;
    servicio: string;
    precio: number;
    notas?: string;
}
export interface UpdateTurnoDto {
    fecha?: string;
    hora?: string;
    servicio?: string;
    precio?: number;
    estado?: TurnoEstado;
    notas?: string;
}
export interface Servicio {
    id: string;
    nombre: string;
    precio: number;
    duracion: number;
    descripcion?: string;
    activo: boolean;
    created_at: Date;
    updated_at: Date;
}
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
            };
        }
    }
}
//# sourceMappingURL=index.d.ts.map