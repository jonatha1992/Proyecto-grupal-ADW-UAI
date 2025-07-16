declare module 'sqlite3' {
    export interface Database {
        serialize(callback: () => void): void;
        run(sql: string, params?: any, callback?: (err: Error | null) => void): this;
        run(sql: string, callback?: (err: Error | null) => void): this;
        exec(sql: string, callback?: (err: Error | null) => void): this;
        all(sql: string, params: any[] | null, callback?: (err: Error | null, rows: any[]) => void): this;
        all(sql: string, callback?: (err: Error | null, rows: any[]) => void): this;
        get(sql: string, params: any[] | null, callback?: (err: Error | null, row: any) => void): this;
        get(sql: string, callback?: (err: Error | null, row: any) => void): this;
        close(callback?: (err: Error | null) => void): void;
    }

    export interface Statement {
        run(params: any, callback?: (err: Error | null) => void): this;
        run(callback?: (err: Error | null) => void): this;
        all(params: any, callback?: (err: Error | null, rows: any[]) => void): this;
        all(callback?: (err: Error | null, rows: any[]) => void): this;
        each(params: any, callback?: (err: Error | null, row: any) => void, complete?: (err: Error | null, count: number) => void): this;
        each(callback?: (err: Error | null, row: any) => void, complete?: (err: Error | null, count: number) => void): this;
        get(params: any, callback?: (err: Error | null, row: any) => void): this;
        get(callback?: (err: Error | null, row: any) => void): this;
        finalize(callback?: (err: Error | null) => void): void;
    }

    export interface RunResult {
        lastID: number;
        changes: number;
    }

    export function verbose(): {
        Database: new (filename: string, callback?: (err: Error | null) => void) => Database;
    };

    export class Database {
        constructor(filename: string, callback?: (err: Error | null) => void);
        serialize(callback: () => void): void;
        run(sql: string, params?: any, callback?: (err: Error | null) => void): this;
        run(sql: string, callback?: (err: Error | null) => void): this;
        exec(sql: string, callback?: (err: Error | null) => void): this;
        all(sql: string, params: any[] | null, callback?: (err: Error | null, rows: any[]) => void): this;
        all(sql: string, callback?: (err: Error | null, rows: any[]) => void): this;
        get(sql: string, params: any[] | null, callback?: (err: Error | null, row: any) => void): this;
        get(sql: string, callback?: (err: Error | null, row: any) => void): this;
        close(callback?: (err: Error | null) => void): void;
    }
}
