import { Router } from 'express';
import { AuthController } from '@/controllers/authController';
import { authenticateToken } from '@/middlewares/auth';
import { validateLogin, validateRegister } from '@/middlewares/validation';

const router = Router();

// Ruta para registro de usuario
router.post('/register', validateRegister, AuthController.register);

// Ruta para inicio de sesión
router.post('/login', validateLogin, AuthController.login);

// Ruta para obtener perfil (protegida)
router.get('/profile', authenticateToken, AuthController.getProfile);

// Ruta para renovar token (protegida)
router.post('/refresh', authenticateToken, AuthController.refreshToken);

export default router;
