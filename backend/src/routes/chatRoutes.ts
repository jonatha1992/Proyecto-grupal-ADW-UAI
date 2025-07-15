import { Router } from 'express';
import { chatController } from '../controllers/chatController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

/**
 * @route POST /api/v1/chat/message
 * @desc Enviar mensaje al chatbot
 * @access Public (pero puede detectar autenticación)
 */
router.post('/message', async (req, res) => {
  // Middleware opcional de autenticación - no requerido pero útil para personalización
  const authHeader = req.headers.authorization;
  let isAuthenticated = false;
  let userName = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      // Usar el middleware de auth para obtener datos del usuario si está autenticado
      const token = authHeader.substring(7);
      // Aquí podrías decodificar el token para obtener info del usuario
      // Por simplicidad, asumimos que si hay token válido, está autenticado
      req.body.isAuthenticated = true;
      // En una implementación real, decodificarías el JWT para obtener el nombre
    } catch (error) {
      // Si el token es inválido, continúa como no autenticado
      req.body.isAuthenticated = false;
    }
  }

  await chatController.sendMessage(req, res);
});

/**
 * @route GET /api/v1/chat/history
 * @desc Obtener historial de chat (requiere autenticación)
 * @access Private
 */
router.get('/history', authenticateToken, chatController.getChatHistory);

export default router;
