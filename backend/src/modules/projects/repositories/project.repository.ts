import { prisma } from '../../../shared/database/prisma';
import { ProjectDTO } from '../models/project.model';

export class ProjectRepository {
  /**
   * Creates a new project for an organization
   */
  async create(organizationCode: string, data: ProjectDTO) {
    const organization = await prisma.organization.findUnique({
      where: { code: organizationCode },
    });

    if (!organization) {
      throw new Error('Organization not found');
    }

    const code = await this.generateCode(organization.id);

    return await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        status: data.status,
        comments: data.comments,
        code: code,
        version: '01.00', // Initial project version
        organizationId: organization.id,
      },
    });
  }

  /**
   * Updates an existing project
   */
  async update(organizationCode: string, projectCode: string, data: Partial<ProjectDTO>) {
    const organization = await prisma.organization.findUnique({
      where: { code: organizationCode },
    });

    if (!organization) {
      throw new Error('Organization not found');
    }

    const project = await prisma.project.findUnique({
      where: {
        code_organizationId: {
          code: projectCode,
          organizationId: organization.id,
        },
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const newVersion = this.incrementVersion(project.version);

    return await prisma.project.update({
      where: {
        code_organizationId: {
          code: projectCode,
          organizationId: organization.id,
        },
      },
      data: {
        ...data,
        version: newVersion,
      },
    });
  }

  /**
   * Deletes a project
   */
  async delete(organizationCode: string, projectCode: string) {
    const organization = await prisma.organization.findUnique({
      where: { code: organizationCode },
    });

    if (!organization) {
      throw new Error(`Organization with code ${organizationCode} not found`);
    }

    const project = await prisma.project.findUnique({
      where: {
        code_organizationId: {
          code: projectCode,
          organizationId: organization.id,
        },
      },
    });

    if (!project) {
      throw new Error(`Project with code ${projectCode} not found`);
    }

    await prisma.project.delete({
      where: {
        code_organizationId: {
          code: projectCode,
          organizationId: organization.id,
        },
      },
    });

    return true;
  }

  /**
   * Finds a project by organization code and project code
   */
  async findByOrgAndCode(organizationCode: string, projectCode: string) {
    return await prisma.project.findFirst({
      where: {
        code: projectCode,
        organization: {
          code: organizationCode,
        },
      },
    });
  }

  /**
   * Finds all projects for an organization
   */
  async findByOrganization(organizationCode: string) {
    const organization = await prisma.organization.findUnique({
      where: { code: organizationCode },
      include: { projects: true },
    });

    if (!organization) {
      throw new Error(`Organization with code ${organizationCode} not found`);
    }

    return organization.projects;
  }

  /**
   * Searches projects by name
   */
  async searchByName(organizationCode: string, name: string) {
    const organization = await prisma.organization.findUnique({
      where: { code: organizationCode }
    });

    if (!organization) {
      throw new Error(`Organization with code ${organizationCode} not found`);
    }

    return await prisma.project.findMany({
      where: {
        organizationId: organization.id,
        name: {
          contains: name,
          mode: 'insensitive'
        }
      }
    });
  }

  /**
   * Searches projects by date
   */
  async searchByDate(organizationCode: string, year?: string, month?: string) {
    const organization = await prisma.organization.findUnique({
      where: { code: organizationCode }
    });

    if (!organization) {
      throw new Error(`Organization with code ${organizationCode} not found`);
    }

    let dateFilter = {};

    if (year && month) {
      // Filter by year and month
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      dateFilter = {
        creationDate: {
          gte: startDate,
          lte: endDate
        }
      };
    } else if (year) {
      // Filter by year only
      dateFilter = {
        creationDate: {
          gte: new Date(parseInt(year), 0, 1),
          lt: new Date(parseInt(year) + 1, 0, 1)
        }
      };
    } else if (month) {
      // Filter by month only (in current year)
      const currentYear = new Date().getFullYear();
      dateFilter = {
        creationDate: {
          gte: new Date(currentYear, parseInt(month) - 1, 1),
          lt: new Date(currentYear, parseInt(month), 0)
        }
      };
    }

    return await prisma.project.findMany({
      where: {
        organizationId: organization.id,
        ...dateFilter
      }
    });
  }

  /**
 * Gets the next unique code for a project without incrementing the counter
 * This method replaces the current getNextCode implementation
 */
  async getNextCodePreview(organizationCode: string): Promise<string> {
    const organization = await prisma.organization.findUnique({
      where: { code: organizationCode },
    });

    if (!organization) {
      throw new Error(`Organization with code ${organizationCode} does not exist`);
    }

    const entity = 'project';
    const contextId = organization.id;

    // Query the current counter value without incrementing it
    const counter = await prisma.counter.findUnique({
      where: { entity_contextId: { entity, contextId } },
    });

    const nextCount = (counter?.counter || 0) + 1;

    return `PROJ-${nextCount.toString().padStart(3, '0')}`;
  }

  /**
   * Gets the next unique code for a project and increments the counter
   * This is a new method that follows the pattern in organization module
   */
  async getNextCode(organizationCode: string): Promise<string> {
    const organization = await prisma.organization.findUnique({
      where: { code: organizationCode },
    });

    if (!organization) {
      throw new Error(`Organization with code ${organizationCode} does not exist`);
    }

    const entity = 'project';
    const contextId = organization.id;

    const counter = await prisma.counter.upsert({
      where: { entity_contextId: { entity, contextId } },
      create: {
        entity,
        contextId,
        counter: 1,
      },
      update: {
        counter: { increment: 1 },
      },
    });

    return `PROJ-${counter.counter.toString().padStart(3, '0')}`;
  }

  /**
   * Generates a unique code for a project within an organization
   * Modify to use getNextCode instead of duplicating logic
   */
  private async generateCode(organizationId: string): Promise<string> {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { code: true }
    });

    if (!organization) {
      throw new Error(`Organization with id ${organizationId} not found`);
    }

    return this.getNextCode(organization.code);
  }

  /**
   * Increments the version of a project
   */
  private incrementVersion(currentVersion: string): string {
    const [major, minor] = currentVersion.split('.').map(Number);
    return `${major.toString().padStart(2, '0')}.${(minor + 1).toString().padStart(2, '0')}`;
  }

  /**
   * Gets all requirements associated with a project for catalog generation
   */
  async getProjectRequirementsCatalog(organizationCode: string, projectCode: string) {
    const project = await prisma.project.findFirst({
      where: {
        code: projectCode,
        organization: {
          code: organizationCode,
        }
      },
      include: {
        organization: true
      }
    });

    if (!project) {
      throw new Error(`Project with code ${projectCode} not found`);
    }

    // Get all educciones with nested ilaciones and specifications
    const educciones = await prisma.educcion.findMany({
      where: {
        projectId: project.id
      },
      include: {
        ilaciones: {
          include: {
            specifications: true
          },
          orderBy: {
            code: 'asc'
          }
        }
      },
      orderBy: {
        code: 'asc'
      }
    });

    return { project, educciones };
  }
}

// Export singleton instance of the repository
export const projectRepository = new ProjectRepository();