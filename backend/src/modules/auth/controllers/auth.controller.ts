import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { LoginDTO, AuthResponseDTO } from '../models/auth.model';

export class AuthController {
  /**
   * Maneja la autenticación de usuarios
   */
  async login(req: Request, res: Response) {
    try {
      const loginData: LoginDTO = {
        username: req.body.username,
        password: req.body.password
      };

      console.log("Received login request for:", loginData.username);

      const token = await authService.authenticateUser(loginData);

      const response: AuthResponseDTO = {
        token: token
      };

      res.json(response);
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: (error as Error).message });
    }
  }

  /**
   * Ruta protegida de ejemplo
   */
  async protectedRoute(req: Request, res: Response) {
    res.send('Acceso protegido exitoso');
  }
}

// Exportar instancia singleton del controlador
export const authController = new AuthController();