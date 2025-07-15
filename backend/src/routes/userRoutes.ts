import { Router } from 'express';
import { UserController } from '@/controllers/userController';
import { authenticateToken } from '@/middlewares/auth';
import { validateUserUpdate } from '@/middlewares/validation';

const router = Router();

// Ruta para actualizar perfil del usuario autenticado
router.put('/profile', authenticateToken, validateUserUpdate, UserController.updateProfile);

// Ruta para eliminar cuenta del usuario autenticado
router.delete('/account', authenticateToken, UserController.deleteAccount);

export default router;
