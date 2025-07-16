import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { connectDatabase } from '@/config/database';
import routes from '@/routes';
import { errorHandler } from '@/middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/v1', routes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Turnos Backend API',
    version: '1.0.0',
    documentation: '/api/v1/health',
    authentication: 'JWT Bearer Token'
  });
});

app.use(errorHandler);

async function startServer() {
  try {
    console.log('🔌 Conectando a la base de datos...');

    // Verificar si existe el archivo de la base de datos
    const dbPath = path.join(__dirname, '../database/turnosmed.sqlite');

    // Siempre inicializar la base de datos para asegurarnos que todas las tablas existan
    console.log('💾 Inicializando base de datos SQLite...');
    // Importar e inicializar la base de datos
    const initDb = await import('./utils/initDb');
    await initDb.default;

    await connectDatabase();
    console.log('✅ Base de datos conectada exitosamente');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📚 API documentación: http://localhost:${PORT}/api/v1/health`);
      console.log(`🔐 Autenticación: JWT Bearer Token`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    });

  } catch (error) {
    console.error('❌ Error al inicializar el servidor:', error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recibido, cerrando servidor...');
  process.exit(0);
});

startServer();
