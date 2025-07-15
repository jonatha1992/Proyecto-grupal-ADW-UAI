import { Router } from 'express';
import { TurnoController } from '@/controllers/turnoController';
import { authenticateToken } from '@/middlewares/auth';
import { validateTurno, validateTurnoUpdate } from '@/middlewares/validation';

const router = Router();

// Ruta para crear un nuevo turno
router.post('/', authenticateToken, validateTurno, TurnoController.create);

// Ruta para obtener turnos del usuario autenticado
router.get('/', authenticateToken, TurnoController.getUserTurnos);

// Ruta para obtener un turno específico por ID
router.get('/:id', authenticateToken, TurnoController.getById);

// Ruta para actualizar un turno
router.put('/:id', authenticateToken, validateTurnoUpdate, TurnoController.update);

// Ruta para cancelar un turno
router.patch('/:id/cancel', authenticateToken, TurnoController.cancel);

// Ruta para obtener horarios disponibles por fecha
router.get('/availability/slots', TurnoController.getAvailableSlots);

export default router;
