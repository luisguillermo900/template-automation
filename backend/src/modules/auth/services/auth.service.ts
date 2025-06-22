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
    const existingAdmin = await this.repository.findByUsername('admin');

    if (existingAdmin) {
      console.log('El usuario admin ya existe.');
      return existingAdmin;
    }

    console.log('Creando usuario admin por defecto...');

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = await this.repository.createUser({
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN', // Ajusta según tu sistema de roles
    });

    console.log('Usuario administrador inicializado.');
    return adminUser;
  }

// Exportar instancia singleton del servicio
export const authService = new AuthService();