import { prisma } from '../../../shared/database/prisma';

export class AuthRepository {
  /**
   * Encuentra un usuario por nombre de usuario
   */
  async findByUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username }
    });
  }

  /**
   * Crea un nuevo usuario
   */
  async createUser(data: { username: string; password: string }) {
  return await prisma.user.create({
    data: {
      username: data.username,
      password: data.password,
      firstName: 'Admin',
      lastName: 'User',
      isActive: true
    }
  });
}
}

// Exportar instancia singleton del repositorio
export const authRepository = new AuthRepository();
