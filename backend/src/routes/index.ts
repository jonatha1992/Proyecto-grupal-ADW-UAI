import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import turnoRoutes from './turnoRoutes';
import servicioRoutes from './servicioRoutes';
import chatRoutes from './chatRoutes';

const router = Router();

// Rutas de la API
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/turnos', turnoRoutes);
router.use('/servicios', servicioRoutes);
router.use('/chat', chatRoutes);

// Ruta de salud del API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

export default router;
