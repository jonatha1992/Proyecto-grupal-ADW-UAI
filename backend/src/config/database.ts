import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'turnosmed',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // máximo número de clientes en el pool
  idleTimeoutMillis: 30000, // cerrar conexiones inactivas después de 30 segundos
  connectionTimeoutMillis: 2000, // tiempo de espera para obtener conexión
});

// Manejar errores del pool
pool.on('error', (err, client) => {
  console.error('Error inesperado en cliente inactivo', err);
  process.exit(-1);
});

// Función para probar la conexión
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Conexión a PostgreSQL exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error);
    return false;
  }
};

// Función para conectar a la base de datos
export const connectDatabase = async (): Promise<void> => {
  const isConnected = await testConnection();
  if (!isConnected) {
    throw new Error('No se pudo conectar a la base de datos');
  }
};

// Función para ejecutar queries
export const query = async (text: string, params?: any[]): Promise<any> => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error('Error en query:', { text, error });
    throw error;
  }
};

// Función para transacciones
export const transaction = async (callback: (client: any) => Promise<any>): Promise<any> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export default pool;
