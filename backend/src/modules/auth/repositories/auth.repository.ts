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
}
async createUser(data: { username: string; password: string; role: string }) {
  return await prisma.user.create({
    data: {
      username: data.username,
      password: data.password,
      role: data.role
    }
  });
}

// Exportar instancia singleton del repositorio
export const authRepository = new AuthRepository();