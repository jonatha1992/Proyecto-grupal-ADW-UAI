import { Router } from 'express';
import { ServicioController } from '@/controllers/servicioController';

const router = Router();

// Ruta para obtener todos los servicios con paginación
router.get('/', ServicioController.getAll);

// Ruta para obtener solo servicios activos
router.get('/active', ServicioController.getActive);

// Ruta para obtener servicios por rango de precio
router.get('/price-range', ServicioController.getByPriceRange);

// Ruta para obtener un servicio específico por ID
router.get('/:id', ServicioController.getById);

export default router;
