import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authRepository } from '../repositories/auth.repository';
import { LoginDTO, JwtPayload } from '../models/auth.model';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthService {
  private repository = authRepository;

  /**
   * Autentica un usuario y genera un token JWT
   */
  async authenticateUser(loginData: LoginDTO): Promise<string> {
    const user = await this.repository.findByUsername(loginData.username);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Contraseña incorrecta');
    }

    const payload: JwtPayload = {
      userId: user.id,
      username: user.username
    };

    const token = jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return token;
  }

  async createAdminUser() {
    // Verificar si el admin ya existe
    const existingAdmin = await this.repository.findByUsername('admin');

    if (existingAdmin) {
      console.log('El usuario admin ya existe.');
      return existingAdmin;
    }

    // Si llegamos aquí, significa que el admin no existe.
    // Esto no debería ocurrir según tu comentario de que 
    // ya tienes un único usuario, pero por completitud:
    console.log('No se encontró el usuario admin. Esto no debería ocurrir.');

    // Puedes opcionalmente lanzar un error o devolver null
    return existingAdmin;
  }
}

// Exportar instancia singleton del servicio
export const authService = new AuthService();