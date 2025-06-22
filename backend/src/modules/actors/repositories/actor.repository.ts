import { prisma } from '../../../shared/database/prisma';
import { ActorDTO } from '../models/actor.model';

export class ActorRepository {
  /**
   * Creates a new actor for a project
   */
  async create(organizationCode: string, projectCode: string, data: ActorDTO) {
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

    const code = await this.generateCode(project.id);

    return await prisma.actor.create({
      data: {
        code: code,
        name: data.name,
        projectId: project.id,
        roleId: data.roleId,
        status: data.status,
        type: data.type,
        comments: data.comments,
        organizationId: data.organizationId,
        version: '00.01',
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        author: {
          select: {
            id: true,
            firstName: true,
            code: true,
          },
        },
      },
    });
  }

  /**
   * Updates an existing actor
   */
  async update(organizationCode: string, projectCode: string, actorCode: string, data: Partial<ActorDTO>) {
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

    const actor = await prisma.actor.findUnique({
      where: {
        code_projectId: {
          code: actorCode,
          projectId: project.id,
        },
      },
    });

    if (!actor) {
      throw new Error('Actor not found');
    }

    const newVersion = this.incrementVersion(actor.version);

    return await prisma.actor.update({
      where: {
        code_projectId: {
          code: actorCode,
          projectId: project.id,
        },
      },
      data: {
        ...data,
        version: newVersion,
        modificationDate: new Date(),
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        author: {
          select: {
            id: true,
            firstName: true,
            code: true,
          },
        },
      },
    });
  }

  /**
   * Deletes an actor
   */
  async delete(organizationCode: string, projectCode: string, actorCode: string) {
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

    const actor = await prisma.actor.findUnique({
      where: {
        code_projectId: {
          code: actorCode,
          projectId: project.id,
        },
      },
    });

    if (!actor) {
      throw new Error(`Actor with code ${actorCode} not found`);
    }

    await prisma.actor.delete({
      where: {
        code_projectId: {
          code: actorCode,
          projectId: project.id,
        },
      },
    });

    return true;
  }

  /**
   * Finds an actor by organization, project and actor codes
   */
  async findByOrgProjectAndCode(organizationCode: string, projectCode: string, actorCode: string) {
    return await prisma.actor.findFirst({
      where: {
        code: actorCode,
        project: {
          code: projectCode,
          organization: {
            code: organizationCode,
          },
        },
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        author: {
          select: {
            id: true,
            firstName: true,
            code: true,
          },
        },
      },
    });
  }

  /**
   * Finds all actors for a project
   */
  async findByProject(organizationCode: string, projectCode: string, skip?: number, take?: number) {
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

    return await prisma.actor.findMany({
      where: {
        projectId: project.id,
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        author: {
          select: {
            id: true,
            firstName: true,
            code: true,
          },
        },
      },
      orderBy: {
        creationDate: 'desc',
      },
      ...(skip !== undefined && { skip }),
      ...(take !== undefined && { take }),
    });
  }

  /**
   * Searches actors by name
   */
  async searchByName(organizationCode: string, projectCode: string, name: string) {
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

    return await prisma.actor.findMany({
      where: {
        projectId: project.id,
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        author: {
          select: {
            id: true,
            firstName: true,
            code: true,
          },
        },
      },
      orderBy: {
        creationDate: 'desc',
      },
    });
  }

  /**
   * Searches actors by date
   */
  async searchByDate(organizationCode: string, projectCode: string, year?: string, month?: string) {
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

    let dateFilter = {};

    if (year && month) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      dateFilter = {
        creationDate: {
          gte: startDate,
          lte: endDate,
        },
      };
    } else if (year) {
      dateFilter = {
        creationDate: {
          gte: new Date(parseInt(year), 0, 1),
          lt: new Date(parseInt(year) + 1, 0, 1),
        },
      };
    } else if (month) {
      const currentYear = new Date().getFullYear();
      dateFilter = {
        creationDate: {
          gte: new Date(currentYear, parseInt(month) - 1, 1),
          lt: new Date(currentYear, parseInt(month), 0),
        },
      };
    }

    return await prisma.actor.findMany({
      where: {
        projectId: project.id,
        ...dateFilter,
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        author: {
          select: {
            id: true,
            firstName: true,
            code: true,
          },
        },
      },
      orderBy: {
        creationDate: 'desc',
      },
    });
  }

  /**
   * Gets the next code preview without incrementing the counter
   */
  async getNextCodePreview(organizationCode: string, projectCode: string): Promise<string> {
    const organization = await prisma.organization.findUnique({
      where: { code: organizationCode },
    });

    if (!organization) {
      throw new Error(`Organization with code ${organizationCode} does not exist`);
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
      throw new Error(`Project with code ${projectCode} does not exist`);
    }

    const entity = 'actor';
    const contextId = project.id;

    const counter = await prisma.counter.findUnique({
      where: { entity_contextId: { entity, contextId } },
    });

    const nextCount = (counter?.counter ?? 0) + 1;

    return `ACT-${nextCount.toString().padStart(4, '0')}`;
  }

  /**
   * Gets the next unique code for an actor and increments the counter
   */
  async getNextCode(organizationCode: string, projectCode: string): Promise<string> {
    const organization = await prisma.organization.findUnique({
      where: { code: organizationCode },
    });

    if (!organization) {
      throw new Error(`Organization with code ${organizationCode} does not exist`);
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
      throw new Error(`Project with code ${projectCode} does not exist`);
    }

    const entity = 'actor';
    const contextId = project.id;

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

    return `ACT-${counter.counter.toString().padStart(4, '0')}`;
  }

  /**
   * Generates a unique code for an actor within a project
   */
  private async generateCode(projectId: string): Promise<string> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        organization: {
          select: { code: true },
        },
      },
    });

    if (!project) {
      throw new Error(`Project with id ${projectId} not found`);
    }

    return this.getNextCode(project.organization.code, project.code);
  }

  /**
   * Increments version following XX.YY pattern where YY goes from 01-09, then XX increments
   * Examples: 00.01 → 00.02 → ... → 00.09 → 01.00 → 01.01 → ... → 01.09 → 02.00
   */
  private incrementVersion(currentVersion: string): string {
    const [major, minor] = currentVersion.split('.').map(Number);
    
    if (minor < 9) {
      // Increment minor version (00.01 → 00.02)
      return `${major.toString().padStart(2, '0')}.${(minor + 1).toString().padStart(2, '0')}`;
    } else {
      // Reset minor to 00 and increment major (00.09 → 01.00)
      return `${(major + 1).toString().padStart(2, '0')}.00`;
    }
  }
}

// Export singleton instance of the repository
export const actorRepository = new ActorRepository();