import { Servicio } from '@/types';
export declare class ServicioModel {
    static findAll(activeOnly?: boolean, limit?: number, offset?: number): Promise<Servicio[]>;
    static findById(id: string): Promise<Servicio | null>;
    static findByName(nombre: string): Promise<Servicio | null>;
    static create(servicioData: Omit<Servicio, 'id' | 'created_at' | 'updated_at'>): Promise<Servicio>;
    static update(id: string, servicioData: Partial<Omit<Servicio, 'id' | 'created_at' | 'updated_at'>>): Promise<Servicio | null>;
    static delete(id: string): Promise<boolean>;
    static toggleActive(id: string): Promise<Servicio | null>;
    static findActive(): Promise<Servicio[]>;
    static findByPriceRange(minPrice: number, maxPrice: number): Promise<Servicio[]>;
    static count(activeOnly?: boolean): Promise<number>;
}
//# sourceMappingURL=Servicio.d.ts.map