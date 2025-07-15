"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transaction = exports.query = exports.connectDatabase = exports.testConnection = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'turnosmed',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
pool.on('error', (err, client) => {
    console.error('Error inesperado en cliente inactivo', err);
    process.exit(-1);
});
const testConnection = async () => {
    try {
        const client = await pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        console.log('✅ Conexión a PostgreSQL exitosa');
        return true;
    }
    catch (error) {
        console.error('❌ Error conectando a PostgreSQL:', error);
        return false;
    }
};
exports.testConnection = testConnection;
const connectDatabase = async () => {
    const isConnected = await (0, exports.testConnection)();
    if (!isConnected) {
        throw new Error('No se pudo conectar a la base de datos');
    }
};
exports.connectDatabase = connectDatabase;
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        return res;
    }
    catch (error) {
        console.error('Error en query:', { text, error });
        throw error;
    }
};
exports.query = query;
const transaction = async (callback) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    }
    catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }
    finally {
        client.release();
    }
};
exports.transaction = transaction;
exports.default = pool;
//# sourceMappingURL=database.js.map