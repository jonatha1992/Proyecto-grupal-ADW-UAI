import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

// Asegurarse de que exista el directorio para la base de datos
const dbDir = path.join(__dirname, '../../database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Configurar la base de datos SQLite
const dbPath = process.env.DB_PATH || path.join(dbDir, 'turnosmed.sqlite');
const verbose = sqlite3.verbose();
const db = new verbose.Database(dbPath);

interface SQLiteRunResult {
    lastID: number;
    changes: number;
}

// Función para probar la conexión
export const testConnection = async (): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        db.get('SELECT 1', (err: Error | null) => {
            if (err) {
                console.error('❌ Error conectando a SQLite:', err);
                resolve(false);
            } else {
                console.log('✅ Conexión a SQLite exitosa');
                resolve(true);
            }
        });
    });
};

// Función para conectar a la base de datos
export const connectDatabase = async (): Promise<void> => {
    const isConnected = await testConnection();
    if (!isConnected) {
        throw new Error('No se pudo conectar a la base de datos');
    }
};

// Función para ejecutar queries
export const query = async (text: string, params: any[] = []): Promise<any> => {
    return new Promise((resolve, reject) => {
        // Detectar si es un SELECT (lectura) u otra operación (escritura)
        const isSelect = text.trim().toLowerCase().startsWith('select');

        if (isSelect) {
            // Para consultas SELECT
            db.all(text, params, (err: Error | null, rows: any[]) => {
                if (err) {
                    console.error('Error en query:', { text, error: err });
                    return reject(err);
                }
                resolve({ rows, rowCount: rows.length });
            });
        } else {
            // Para consultas INSERT, UPDATE, DELETE
            db.run(text, params, function (this: SQLiteRunResult, err: Error | null) {
                if (err) {
                    console.error('Error en query:', { text, error: err });
                    return reject(err);
                }
                resolve({
                    rows: [],
                    rowCount: this.changes,
                    lastID: this.lastID
                });
            });
        }
    });
};

// Función para transacciones
export const transaction = async (callback: (client: any) => Promise<any>): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');

            try {
                // Pasar un cliente con funciones similares a las de PostgreSQL
                const client = {
                    query: (text: string, params: any[] = []) => {
                        return new Promise((resolveQuery, rejectQuery) => {
                            // Detectar si es un SELECT (lectura) u otra operación (escritura)
                            const isSelect = text.trim().toLowerCase().startsWith('select');

                            if (isSelect) {
                                db.all(text, params, (err: Error | null, rows: any[]) => {
                                    if (err) return rejectQuery(err);
                                    resolveQuery({ rows, rowCount: rows.length });
                                });
                            } else {
                                db.run(text, params, function (this: SQLiteRunResult, err: Error | null) {
                                    if (err) return rejectQuery(err);
                                    resolveQuery({
                                        rows: [],
                                        rowCount: this.changes,
                                        lastID: this.lastID
                                    });
                                });
                            }
                        });
                    }
                };

                // Ejecutar el callback
                callback(client)
                    .then((result) => {
                        db.run('COMMIT', (err: Error | null) => {
                            if (err) {
                                console.error('Error en COMMIT:', err);
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        });
                    })
                    .catch((error) => {
                        db.run('ROLLBACK', (err: Error | null) => {
                            if (err) {
                                console.error('Error en ROLLBACK:', err);
                            }
                            reject(error);
                        });
                    });
            } catch (error) {
                db.run('ROLLBACK', (err: Error | null) => {
                    if (err) {
                        console.error('Error en ROLLBACK:', err);
                    }
                    reject(error);
                });
            }
        });
    });
};

export default db;
