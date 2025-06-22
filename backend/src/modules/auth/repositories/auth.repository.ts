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

// Exportar instancia singleton del repositorio
export const authRepository = new AuthRepository();