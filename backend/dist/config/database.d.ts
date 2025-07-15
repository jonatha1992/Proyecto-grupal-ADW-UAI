import { Pool } from 'pg';
declare const pool: Pool;
export declare const testConnection: () => Promise<boolean>;
export declare const connectDatabase: () => Promise<void>;
export declare const query: (text: string, params?: any[]) => Promise<any>;
export declare const transaction: (callback: (client: any) => Promise<any>) => Promise<any>;
export default pool;
//# sourceMappingURL=database.d.ts.map