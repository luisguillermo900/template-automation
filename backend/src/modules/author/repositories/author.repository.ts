// repositories/author.repository.ts - Versión final con organizaciones
import { prisma } from '../../../shared/database/prisma';
import { AuthorDTO, AuthorSearchParams } from '../models/author.model';
import bcrypt from 'bcrypt';

export class AuthorRepository {
  /**
   * Creates a new author with organization relationship
   */
  async create(data: AuthorDTO) {
    const counter = await this.getNextCounter();
    const code = `AUT-${counter.toString().padStart(4, '0')}`;

    // Hash password if provided
    let hashedPassword = undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    return prisma.author.create({
      data: {
        ...data,
        code: code,
        version: '00.01',
        creationDate: new Date(),
        password: hashedPassword,
        // Set default permissions if not provided
        canEditActors: data.canEditActors || false,
        canEditExperts: data.canEditExperts || false,
        canEditRequirements: data.canEditRequirements || false,
        canEditSpecifications: data.canEditSpecifications || false,
        canEditIlaciones: data.canEditIlaciones || false,
        canEditArtefacts: data.canEditArtefacts || false,
        canEditSources: data.canEditSources || false,
        canEditMetrics: data.canEditMetrics || false,
        canEditInterviews: data.canEditInterviews || false,
        canEditEducation: data.canEditEducation || false,
        canEditSoftwareTests: data.canEditSoftwareTests || false,
        canEditWorkplaceSafety: data.canEditWorkplaceSafety || false,
      },
      include: {
        role: true,
        organization: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        templateAuthor: {
          select: {
            id: true,
            code: true,
            firstName: true,
            paternalSurname: true,
          },
        },
      },
    });
  }

  /**
   * Updates author and increments version
   */
  async update(id: string, data: Partial<AuthorDTO>) {
    // Hash password if provided
    let updateData = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return prisma.author.update({
      where: { id },
      data: {
        ...updateData,
        modificationDate: new Date(),
      },
      include: {
        role: true,
        organization: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        templateAuthor: {
          select: {
            id: true,
            code: true,
            firstName: true,
            paternalSurname: true,
          },
        },
      },
    });
  }

  /**
   * Gets all authors with full relationships
   */
  async findAll(skip: number, take: number) {
    return prisma.author.findMany({
      skip,
      take,
      select: {
        id: true,
        code: true,
        version: true,
        creationDate: true,
        modificationDate: true,
        firstName: true,
        paternalSurname: true,
        maternalSurname: true,
        alias: true,
        phone: true,
        dni: true,
        organizationId: true,
        templateAuthorId: true,
        status: true,
        comments: true,
        roleId: true,
        role: true,
        organization: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        templateAuthor: {
          select: {
            id: true,
            code: true,
            firstName: true,
            paternalSurname: true,
          },
        },
        canEditActors: true,
        canEditExperts: true,
        canEditRequirements: true,
        canEditSpecifications: true,
        canEditIlaciones: true,
        canEditArtefacts: true,
        canEditSources: true,
        canEditMetrics: true,
        canEditInterviews: true,
        canEditEducation: true,
        canEditSoftwareTests: true,
        canEditWorkplaceSafety: true,
        interviews: {
          select: {
            id: true,
            interviewName: true,
            interviewDate: true,
            projectId: true,
          },
        },
        // Password excluded
      },
      orderBy: {
        code: 'asc',
      },
    });
  }

  /**
   * Finds author by ID with full relationships
   */
  async findById(id: string) {
    return prisma.author.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        version: true,
        creationDate: true,
        modificationDate: true,
        firstName: true,
        paternalSurname: true,
        maternalSurname: true,
        alias: true,
        phone: true,
        dni: true,
        organizationId: true,
        templateAuthorId: true,
        status: true,
        comments: true,
        roleId: true,
        role: true,
        organization: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        templateAuthor: {
          select: {
            id: true,
            code: true,
            firstName: true,
            paternalSurname: true,
          },
        },
        canEditActors: true,
        canEditExperts: true,
        canEditRequirements: true,
        canEditSpecifications: true,
        canEditIlaciones: true,
        canEditArtefacts: true,
        canEditSources: true,
        canEditMetrics: true,
        canEditInterviews: true,
        canEditEducation: true,
        canEditSoftwareTests: true,
        canEditWorkplaceSafety: true,
        interviews: {
          select: {
            id: true,
            interviewName: true,
            interviewDate: true,
            projectId: true,
          },
        },
      },
    });
  }

  /**
   * Validates if organization exists
   */
  async organizationExists(organizationId: string): Promise<boolean> {
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true },
    });
    return !!org;
  }

  /**
   * Gets organization options for dropdown
   */
  async getOrganizationOptions() {
    return prisma.organization.findMany({
      select: {
        id: true,
        code: true,
        name: true,
      },
      where: {
        status: 'Active', // Solo organizaciones activas
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Gets active authors for template selection
   */
  async getActiveAuthors() {
    return prisma.author.findMany({
      where: {
        status: 'Active',
      },
      select: {
        id: true,
        code: true,
        firstName: true,
        paternalSurname: true,
      },
      orderBy: {
        firstName: 'asc',
      },
    });
  }

  /**
   * Removes author reference from interviews before deletion
   */
  async removeAuthorFromInterviews(authorId: string) {
    return prisma.interview.updateMany({
      where: {
        authorId: authorId,
      },
      data: {
        authorId: null as any, // CORREGIDO: Cast a any para evitar error de tipos
        
      },
    });
  }

  /**
   * Gets authors by status
   */
  async findByStatus(status: string) {
    return prisma.author.findMany({
      where: { status },
      select: {
        id: true,
        code: true,
        version: true,
        creationDate: true,
        firstName: true,
        paternalSurname: true,
        maternalSurname: true,
        alias: true,
        phone: true,
        dni: true,
        organizationId: true,
        status: true,
        role: true,
        organization: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        canEditActors: true,
        canEditExperts: true,
        canEditRequirements: true,
        canEditSpecifications: true,
        canEditIlaciones: true,
        canEditArtefacts: true,
        canEditSources: true,
        canEditMetrics: true,
        canEditInterviews: true,
        canEditEducation: true,
        canEditSoftwareTests: true,
        canEditWorkplaceSafety: true,
      },
      orderBy: {
        code: 'asc',
      },
    });
  }

  /**
   * Gets authors by role
   */
  async findByRole(roleId: string) {
    return prisma.author.findMany({
      where: { roleId },
      select: {
        id: true,
        code: true,
        version: true,
        creationDate: true,
        firstName: true,
        paternalSurname: true,
        maternalSurname: true,
        alias: true,
        phone: true,
        dni: true,
        organizationId: true,
        status: true,
        role: true,
        organization: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        canEditActors: true,
        canEditExperts: true,
        canEditRequirements: true,
        canEditSpecifications: true,
        canEditIlaciones: true,
        canEditArtefacts: true,
        canEditSources: true,
        canEditMetrics: true,
        canEditInterviews: true,
        canEditEducation: true,
        canEditSoftwareTests: true,
        canEditWorkplaceSafety: true,
      },
      orderBy: {
        code: 'asc',
      },
    });
  }


  /**
   * Finds authors by specific permission
   */
  async findByPermission(permission: string) {
    const where: any = {};
    where[permission] = true;

    return prisma.author.findMany({
      where,
      select: {
        id: true,
        code: true,
        firstName: true,
        paternalSurname: true,
        organization: {
          select: {
            code: true,
            name: true,
          },
        },
        role: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        firstName: 'asc',
      },
    });
  }

  /**
   * Gets permission statistics
   */
  async getPermissionStats() {
    await prisma.author.aggregate({
      _count: {
        canEditActors: true,
        canEditExperts: true,
        canEditRequirements: true,
        canEditSpecifications: true,
        canEditIlaciones: true,
        canEditArtefacts: true,
        canEditSources: true,
        canEditMetrics: true,
        canEditInterviews: true,
        canEditEducation: true,
        canEditSoftwareTests: true,
        canEditWorkplaceSafety: true,
      },
      where: {
        // Count only true values
      },
    });

    // Get actual counts for true values
    const permissionCounts = await Promise.all([
      prisma.author.count({ where: { canEditActors: true } }),
      prisma.author.count({ where: { canEditExperts: true } }),
      prisma.author.count({ where: { canEditRequirements: true } }),
      prisma.author.count({ where: { canEditSpecifications: true } }),
      prisma.author.count({ where: { canEditIlaciones: true } }),
      prisma.author.count({ where: { canEditArtefacts: true } }),
      prisma.author.count({ where: { canEditSources: true } }),
      prisma.author.count({ where: { canEditMetrics: true } }),
      prisma.author.count({ where: { canEditInterviews: true } }),
      prisma.author.count({ where: { canEditEducation: true } }),
      prisma.author.count({ where: { canEditSoftwareTests: true } }),
      prisma.author.count({ where: { canEditWorkplaceSafety: true } }),
    ]);

    return {
      canEditActors: permissionCounts[0],
      canEditExperts: permissionCounts[1],
      canEditRequirements: permissionCounts[2],
      canEditSpecifications: permissionCounts[3],
      canEditIlaciones: permissionCounts[4],
      canEditArtefacts: permissionCounts[5],
      canEditSources: permissionCounts[6],
      canEditMetrics: permissionCounts[7],
      canEditInterviews: permissionCounts[8],
      canEditEducation: permissionCounts[9],
      canEditSoftwareTests: permissionCounts[10],
      canEditWorkplaceSafety: permissionCounts[11],
    };
  }

  /**
   * Gets average permissions per author
   */
  async getAveragePermissions(): Promise<number> {
    const authors = await prisma.author.findMany({
      select: {
        canEditActors: true,
        canEditExperts: true,
        canEditRequirements: true,
        canEditSpecifications: true,
        canEditIlaciones: true,
        canEditArtefacts: true,
        canEditSources: true,
        canEditMetrics: true,
        canEditInterviews: true,
        canEditEducation: true,
        canEditSoftwareTests: true,
        canEditWorkplaceSafety: true,
      },
    });

    if (authors.length === 0) return 0;

    const totalPermissions = authors.reduce((sum, author) => {
      const permissions = [
        author.canEditActors,
        author.canEditExperts,
        author.canEditRequirements,
        author.canEditSpecifications,
        author.canEditIlaciones,
        author.canEditArtefacts,
        author.canEditSources,
        author.canEditMetrics,
        author.canEditInterviews,
        author.canEditEducation,
        author.canEditSoftwareTests,
        author.canEditWorkplaceSafety,
      ];
      return sum + permissions.filter(Boolean).length;
    }, 0);

    return totalPermissions / authors.length;
  }

  /**
   * Enhanced search with organization and permission filters
   */
  async search(params: AuthorSearchParams) {
    const where: any = {};

    if (params.firstName) {
      where.firstName = {
        contains: params.firstName,
        mode: 'insensitive',
      };
    }

    if (params.paternalSurname) {
      where.paternalSurname = {
        contains: params.paternalSurname,
        mode: 'insensitive',
      };
    }

    if (params.dni) {
      where.dni = {
        contains: params.dni,
        mode: 'insensitive',
      };
    }

    if (params.phone) {
      where.phone = {
        contains: params.phone,
        mode: 'insensitive',
      };
    }

    if (params.organizationId) {
      where.organizationId = params.organizationId;
    }

    if (params.status) {
      where.status = params.status;
    }

    if (params.roleId) {
      where.roleId = params.roleId;
    }

    // Filter by specific permissions
    if (params.hasPermissions && params.hasPermissions.length > 0) {
      const permissionConditions = params.hasPermissions.map(permission => ({
        [permission]: true,
      }));
      where.OR = permissionConditions;
    }

    return prisma.author.findMany({
      where,
      select: {
        id: true,
        code: true,
        version: true,
        creationDate: true,
        modificationDate: true,
        firstName: true,
        paternalSurname: true,
        maternalSurname: true,
        alias: true,
        phone: true,
        dni: true,
        organizationId: true,
        templateAuthorId: true,
        status: true,
        comments: true,
        roleId: true,
        role: true,
        organization: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        templateAuthor: {
          select: {
            id: true,
            code: true,
            firstName: true,
            paternalSurname: true,
          },
        },
        canEditActors: true,
        canEditExperts: true,
        canEditRequirements: true,
        canEditSpecifications: true,
        canEditIlaciones: true,
        canEditArtefacts: true,
        canEditSources: true,
        canEditMetrics: true,
        canEditInterviews: true,
        canEditEducation: true,
        canEditSoftwareTests: true,
        canEditWorkplaceSafety: true,
      },
      orderBy: {
        code: 'asc',
      },
    });
  }

  /**
   * Gets authors by organization
   */
  async findByOrganization(organizationId: string) {
    return prisma.author.findMany({
      where: { organizationId },
      select: {
        id: true,
        code: true,
        firstName: true,
        paternalSurname: true,
        maternalSurname: true,
        status: true,
        role: true,
        organization: {
          select: {
            code: true,
            name: true,
          },
        },
      },
      orderBy: {
        code: 'asc',
      },
    });
  }

  /**
   * Validates DNI uniqueness
   */
  async isDniUnique(dni: string, excludeId?: string): Promise<boolean> {
    const where: any = { dni };
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const existing = await prisma.author.findFirst({ where });
    return !existing;
  }

  /**
   * Gets enhanced statistics with organization data
   */
  async getStats() {
    const total = await this.count();
    const activeCount = await prisma.author.count({ where: { status: 'Active' } });
    const inactiveCount = await prisma.author.count({ where: { status: 'Inactive' } });
    
    const roleStats = await prisma.author.groupBy({
      by: ['roleId'],
      _count: {
        roleId: true,
      },
      where: {
        roleId: {
          not: null,
        },
      },
    });

    const orgStats = await prisma.author.groupBy({
      by: ['organizationId'],
      _count: {
        organizationId: true,
      },
      where: {
        organizationId: {
          not: null,
        },
      },
    });

    const totalInterviews = await prisma.interview.count();

    return {
      total,
      byStatus: {
        active: activeCount,
        inactive: inactiveCount,
      },
      roleStats,
      orgStats,
      totalInterviews,
    };
  }

  async findByCode(code: string) {
    const author = await prisma.author.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        version: true,
        creationDate: true,
        modificationDate: true,
        firstName: true,
        paternalSurname: true,
        maternalSurname: true,
        alias: true,
        phone: true,
        dni: true,
        organizationId: true,
        templateAuthorId: true,
        status: true,
        comments: true,
        roleId: true,
        role: true,
        organization: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        templateAuthor: {
          select: {
            id: true,
            code: true,
            firstName: true,
            paternalSurname: true,
          },
        },
        canEditActors: true,
        canEditExperts: true,
        canEditRequirements: true,
        canEditSpecifications: true,
        canEditIlaciones: true,
        canEditArtefacts: true,
        canEditSources: true,
        canEditMetrics: true,
        canEditInterviews: true,
        canEditEducation: true,
        canEditSoftwareTests: true,
        canEditWorkplaceSafety: true,
        interviews: {
          select: {
            id: true,
            interviewName: true,
            interviewDate: true,
            projectId: true,
          },
        },
      },
    });
    
    return author;
  }

  // ... otros métodos del repository anterior
  async count() {
    return prisma.author.count();
  }

  async delete(id: string) {
    return prisma.author.delete({
      where: { id },
    });
  }

  async getNextCounter() {
    const counter = await prisma.counter.upsert({
      where: {
        entity_contextId: {
          entity: 'author',
          contextId: 'global'
        }
      },
      create: {
        entity: 'author',
        contextId: 'global',
        counter: 1,
      },
      update: {
        counter: { increment: 1 },
      },
    });

    return counter.counter;
  }

  async getNextCode(): Promise<string> {
    const counter = await this.getNextCounter();
    return `AUT-${counter.toString().padStart(4, '0')}`;
  }

  async getCurrentCounter() {
    const counter = await prisma.counter.findUnique({
      where: {
        entity_contextId: {
          entity: 'author',
          contextId: 'global'
        }
      },
    });

    return counter ? counter.counter : 0;
  }

  async getNextCodePreview(): Promise<string> {
    const currentCounter = await this.getCurrentCounter();
    const nextCounter = currentCounter + 1;
    return `AUT-${nextCounter.toString().padStart(4, '0')}`;
  }
}

// Export singleton instance of the repository
export const authorRepository = new AuthorRepository();