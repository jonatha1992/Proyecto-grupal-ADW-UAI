import { Turno, CreateTurnoDto, UpdateTurnoDto, TurnoEstado } from '@/types';
export declare class TurnoModel {
    static findById(id: string): Promise<Turno | null>;
    static findByUserId(user_id: string, estado?: TurnoEstado, limit?: number, offset?: number): Promise<Turno[]>;
    static findByDateRange(startDate: Date, endDate: Date, estado?: TurnoEstado): Promise<Turno[]>;
    static create(user_id: string, turnoData: CreateTurnoDto): Promise<Turno>;
    static update(id: string, turnoData: UpdateTurnoDto): Promise<Turno | null>;
    static cancel(id: string, user_id: string): Promise<Turno | null>;
    static delete(id: string): Promise<boolean>;
    static findAvailableSlots(fecha: string, servicio: string): Promise<string[]>;
    static countByUser(user_id: string, estado?: TurnoEstado): Promise<number>;
    static findByFechaHora(fecha: string, hora: string): Promise<Turno | null>;
    static countByUserId(user_id: string, estado?: TurnoEstado): Promise<number>;
    static getAvailableSlots(fecha: string): Promise<string[]>;
}
//# sourceMappingURL=Turno.d.ts.map