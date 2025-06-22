import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authService } from '../services/auth.service'; 

const router = Router();

// Ruta de login (única ruta pública)
router.post('/auth/init-admin', async (req, res) => {
  try {
    const admin = await authService.createAdminUser();
    res.status(201).json({ message: 'Usuario admin inicializado', admin });
  } catch (error) {
    console.error('Error creando admin:', error);
    res.status(500).json({ message: 'Error creando admin' });
  }
});
// router.get('/protected', authenticateToken, authController.protectedRoute.bind(authController));

export default router;