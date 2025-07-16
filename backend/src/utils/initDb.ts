import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Configuración de la base de datos
const dbDir = path.join(__dirname, '../database');
const dbPath = path.join(dbDir, 'turnosmed.sqlite');

// Asegurarse de que el directorio exista
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Crear/conectar a la base de datos SQLite
const db = new sqlite3.Database(dbPath);

// Leer el archivo SQL de inicialización
const sqlScript = fs.readFileSync(path.join(__dirname, '../../scripts/init-sqlite.sql'), 'utf8');

// Función para ejecutar el script SQL
function initializeDatabase() {
    return new Promise<void>((resolve, reject) => {
        console.log('Inicializando la base de datos SQLite...');

        // Forzar la inicialización de la base de datos
        console.log('Ejecutando script de inicialización...');
        db.exec(sqlScript, (err) => {
            if (err) {
                console.error('Error al inicializar la base de datos:', err);
                reject(err);
                return;
            }
            console.log('Base de datos inicializada correctamente');
            resolve();
        });
    });
}

// Función para generar un UUID compatible con SQLite (ya que no tiene UUID nativo)
export function generateUUID(): string {
    return crypto.randomUUID();
}

// Inicializar la base de datos
export default initializeDatabase();
