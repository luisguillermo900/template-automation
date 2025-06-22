import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Ruta de login (única ruta pública)
router.post('/auth/login', authController.login.bind(authController));
// router.get('/protected', authenticateToken, authController.protectedRoute.bind(authController));

export default router;