// repositories/role.repository.ts - CORREGIDO
import { prisma } from '../../../shared/database/prisma';
import { RoleDTO, RoleSearchParams } from '../models/role.model';

export class RoleRepository {
  /**
   * Creates a new role in the database
   */
  async create(data: RoleDTO) {
    const counter = await this.getNextCounter();
    const code = `ROL-${counter.toString().padStart(3, '0')}`;

    const createData: any = {
      code: code,
      name: data.name,
      creationDate: new Date(),
      status: data.status ?? 'Active',
    };

    if (data.comments) {
      createData.comments = data.comments;
    }

    const role = await prisma.role.create({
      data: createData,
    });

    // Get counts separately to avoid _count issues
    const actorCount = await prisma.actor.count({ where: { roleId: role.id } });
    const authorCount = await prisma.author.count({ where: { roleId: role.id } });

    return {
      ...role,
      _count: {
        actors: actorCount,
        authors: authorCount,
      },
    };
  }

  /**
   * Gets all roles with pagination
   */
  async findAll(skip: number, take: number) {
    const roles = await prisma.role.findMany({
      skip,
      take,
      orderBy: {
        name: 'asc',
      },
    });

    // Add counts manually
    const rolesWithCounts = await Promise.all(
      roles.map(async (role) => {
        const actorCount = await prisma.actor.count({ where: { roleId: role.id } });
        const authorCount = await prisma.author.count({ where: { roleId: role.id } });
        
        return {
          ...role,
          _count: {
            actors: actorCount,
            authors: authorCount,
          },
        };
      })
    );

    return rolesWithCounts;
  }

  /**
   * Finds a role by ID
   */
  async findById(id: string) {
    const role = await prisma.role.findUnique({
      where: { id },
    });

    if (!role) return null;

    // Get counts separately
    const actorCount = await prisma.actor.count({ where: { roleId: role.id } });
    const authorCount = await prisma.author.count({ where: { roleId: role.id } });

    return {
      ...role,
      _count: {
        actors: actorCount,
        authors: authorCount,
      },
    };
  }

  /**
   * Finds a role by code
   */
  async findByCode(code: string) {
    const role = await prisma.role.findFirst({
      where: { code },
    });

    if (!role) return null;

    // Get counts separately
    const actorCount = await prisma.actor.count({ where: { roleId: role.id } });
    const authorCount = await prisma.author.count({ where: { roleId: role.id } });

    return {
      ...role,
      _count: {
        actors: actorCount,
        authors: authorCount,
      },
    };
  }

  /**
   * Finds a role by name
   */
  async findByName(name: string) {
    const role = await prisma.role.findUnique({
      where: { name },
    });

    if (!role) return null;

    // Get counts separately
    const actorCount = await prisma.actor.count({ where: { roleId: role.id } });
    const authorCount = await prisma.author.count({ where: { roleId: role.id } });

    return {
      ...role,
      _count: {
        actors: actorCount,
        authors: authorCount,
      },
    };
  }

  /**
   * Updates an existing role
   */
  async update(id: string, data: Partial<RoleDTO>) {
    const role = await prisma.role.update({
      where: { id },
      data,
    });

    // Get counts separately
    const actorCount = await prisma.actor.count({ where: { roleId: role.id } });
    const authorCount = await prisma.author.count({ where: { roleId: role.id } });

    return {
      ...role,
      _count: {
        actors: actorCount,
        authors: authorCount,
      },
    };
  }

  /**
   * Deletes a role by ID
   */
  async delete(id: string) {
    return prisma.role.delete({
      where: { id },
    });
  }

  /**
   * Searches roles with filters
   */
  async search(params: RoleSearchParams) {
    const where: any = {};

    if (params.name) {
      where.name = {
        contains: params.name,
        mode: 'insensitive',
      };
    }

    if (params.status) {
      where.status = params.status;
    }

    const roles = await prisma.role.findMany({
      where,
      orderBy: {
        code: 'asc',
      },
    });

    // Add counts manually
    const rolesWithCounts = await Promise.all(
      roles.map(async (role) => {
        const actorCount = await prisma.actor.count({ where: { roleId: role.id } });
        const authorCount = await prisma.author.count({ where: { roleId: role.id } });
        
        return {
          ...role,
          _count: {
            actors: actorCount,
            authors: authorCount,
          },
        };
      })
    );

    return rolesWithCounts;
  }

  /**
   * Gets roles by status
   */
  async findByStatus(status: string) {
    const roles = await prisma.role.findMany({
      where: { status },
      orderBy: {
        code: 'asc',
      },
    });

    // Add counts manually
    const rolesWithCounts = await Promise.all(
      roles.map(async (role) => {
        const actorCount = await prisma.actor.count({ where: { roleId: role.id } });
        const authorCount = await prisma.author.count({ where: { roleId: role.id } });
        
        return {
          ...role,
          _count: {
            actors: actorCount,
            authors: authorCount,
          },
        };
      })
    );

    return rolesWithCounts;
  }

  /**
   * Gets role with full relations (actors and authors)
   */
  async findByIdWithRelations(id: string) {
    const role = await prisma.role.findUnique({
      where: { id },
    });

    if (!role) return null;

    // Get related records separately
    const actors = await prisma.actor.findMany({
      where: { roleId: id },
      select: {
        id: true,
        code: true,
        name: true,
      },
      orderBy: {
        code: 'asc',
      },
    });

    const authors = await prisma.author.findMany({
      where: { roleId: id },
      select: {
        id: true,
        code: true,
        firstName: true,
        paternalSurname: true,
      },
      orderBy: {
        code: 'asc',
      },
    });

    return {
      ...role,
      actors,
      authors,
      _count: {
        actors: actors.length,
        authors: authors.length,
      },
    };
  }

  /**
   * Gets total count of roles
   */
  async count() {
    return prisma.role.count();
  }

  /**
   * Gets next counter for generating unique codes
   */
  async getNextCounter() {
    const counter = await prisma.counter.upsert({
      where: {
        entity_contextId: {
          entity: 'role',
          contextId: 'global'
        }
      },
      create: {
        entity: 'role',
        contextId: 'global',
        counter: 1,
      },
      update: {
        counter: { increment: 1 },
      },
    });

    return counter.counter;
  }

  /**
   * Gets next code for a new role
   */
  async getNextCode(): Promise<string> {
    const counter = await this.getNextCounter();
    return `ROL-${counter.toString().padStart(3, '0')}`;
  }

  /**
   * Gets current counter without incrementing it
   */
  async getCurrentCounter() {
    const counter = await prisma.counter.findUnique({
      where: {
        entity_contextId: {
          entity: 'role',
          contextId: 'global'
        }
      },
    });

    return counter ? counter.counter : 0;
  }

  /**
   * Gets next code preview without incrementing the counter
   */
  async getNextCodePreview(): Promise<string> {
    const currentCounter = await this.getCurrentCounter();
    const nextCounter = currentCounter + 1;
    return `ROL-${nextCounter.toString().padStart(3, '0')}`;
  }

  /**
   * Gets role statistics
   */
  async getStats() {
    const total = await this.count();
    const activeCount = await prisma.role.count({ where: { status: 'Active' } });
    const inactiveCount = await prisma.role.count({ where: { status: 'Inactive' } });
    
    // Count totals with error handling
    let totalActors = 0;
    let totalAuthors = 0;

    try {
      totalActors = await prisma.actor.count();
    } catch (error) {
      // Handle the error appropriately, e.g., log it or rethrow
      console.error('Error counting actors:', error);
    }

    try {
      totalAuthors = await prisma.author.count();
    } catch (error) {
      // Handle the error appropriately, e.g., log it or rethrow
      console.error('Error counting authors:', error);
    }

    return {
      total,
      byStatus: {
        active: activeCount,
        inactive: inactiveCount,
      },
      totalActors,
      totalAuthors,
    };
  }

  /**
   * Validates name uniqueness
   */
  async isNameUnique(name: string, excludeId?: string) {
    const where: any = { name };
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const existing = await prisma.role.findFirst({ where });
    return !existing;
  }

  /**
   * Checks if role can be deleted (no actors or authors assigned)
   */
  async canBeDeleted(id: string): Promise<boolean> {
    let actorCount = 0;
    let authorCount = 0;

    try {
      actorCount = await prisma.actor.count({ where: { roleId: id } });
    } catch (error) {
      // Actor table might not exist
      console.error('Error counting actors for role:', error);
    }

    try {
      authorCount = await prisma.author.count({ where: { roleId: id } });
    } catch (error) {
      // Author table might not exist
      console.error('Error counting authors for role:', error);
    }

    return actorCount === 0 && authorCount === 0;
  }
}

// Export singleton instance of the repository
export const roleRepository = new RoleRepository();