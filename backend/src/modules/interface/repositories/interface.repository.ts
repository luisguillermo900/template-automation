// repositories/interface.repository.ts
import { prisma } from '../../../shared/database/prisma';
import { InterfaceDTO, InterfaceSearchParams } from '../models/interface.model';

export class InterfaceRepository {
  /**
   * Creates a new interface in the database
   */
  async create(data: InterfaceDTO & { code: string; version: string; filePath: string; fileType: string }) {
    const interfaceRecord = await prisma.interface.create({
      data: {
        code: data.code,
        name: data.name,
        version: data.version,
        date: new Date(),
        filePath: data.filePath,
        fileType: data.fileType,
        projectId: data.projectId,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return interfaceRecord;
  }

  /**
   * Gets all interfaces with pagination
   */
  async findAll(skip: number, take: number) {
    const interfaces = await prisma.interface.findMany({
      skip,
      take,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return interfaces;
  }

  /**
   * Finds an interface by ID
   */
  async findById(id: string) {
    const interfaceRecord = await prisma.interface.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            code: true,
            organization: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    return interfaceRecord;
  }

  /**
   * Finds an interface by code
   */
  async findByCode(code: string) {
    const interfaceRecord = await prisma.interface.findUnique({
      where: { code },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return interfaceRecord;
  }

  /**
   * Updates an existing interface
   */
  async update(id: string, data: Partial<InterfaceDTO> & { filePath?: string; fileType?: string }) {
    const updateData: any = {};
    
    if (data.name) updateData.name = data.name;
    if (data.filePath) updateData.filePath = data.filePath;
    if (data.fileType) updateData.fileType = data.fileType;

    const interfaceRecord = await prisma.interface.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return interfaceRecord;
  }

  /**
   * Deletes an interface by ID
   */
  async delete(id: string) {
    return prisma.interface.delete({
      where: { id },
    });
  }

  /**
   * Searches interfaces with filters
   */
  async search(params: InterfaceSearchParams) {
    const where: any = {};

    if (params.name) {
      where.name = {
        contains: params.name,
        mode: 'insensitive',
      };
    }

    if (params.projectId) {
      where.projectId = params.projectId;
    }

    if (params.fileType) {
      where.fileType = params.fileType;
    }

    const interfaces = await prisma.interface.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: {
        code: 'asc',
      },
    });

    return interfaces;
  }

  /**
   * Gets interfaces by project ID
   */
  async findByProjectId(projectId: string) {
    const interfaces = await prisma.interface.findMany({
      where: { projectId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: {
        code: 'asc',
      },
    });

    return interfaces;
  }

  /**
   * Gets total count of interfaces
   */
  async count() {
    return prisma.interface.count();
  }

  /**
   * Gets next counter for generating unique codes
   */
  async getNextCounter(projectId: string) {
    const counter = await prisma.counter.upsert({
      where: {
        entity_contextId: {
          entity: 'interface',
          contextId: projectId,
        },
      },
      create: {
        entity: 'interface',
        contextId: projectId,
        counter: 1,
      },
      update: {
        counter: { increment: 1 },
      },
    });

    return counter.counter;
  }

  /**
   * Gets next code for a new interface
   */
  async getNextCode(projectId: string): Promise<string> {
    const counter = await this.getNextCounter(projectId);
    return `INT-${counter.toString().padStart(3, '0')}`;
  }

  /**
   * Gets current counter without incrementing it
   */
  async getCurrentCounter(projectId: string) {
    const counter = await prisma.counter.findUnique({
      where: {
        entity_contextId: {
          entity: 'interface',
          contextId: projectId,
        },
      },
    });

    return counter ? counter.counter : 0;
  }

  /**
   * Gets next code preview without incrementing the counter
   */
  async getNextCodePreview(projectId: string): Promise<string> {
    const currentCounter = await this.getCurrentCounter(projectId);
    const nextCounter = currentCounter + 1;
    return `INT-${nextCounter.toString().padStart(3, '0')}`;
  }

  /**
   * Gets interface statistics
   */
  async getStats() {
    const total = await this.count();
    
    // Count by project
    const projectCounts = await prisma.interface.groupBy({
      by: ['projectId'],
      _count: {
        projectId: true,
      },
    });

    // Count by file type
    const fileTypeCounts = await prisma.interface.groupBy({
      by: ['fileType'],
      _count: {
        fileType: true,
      },
    });

    // Get project names
    const projects = await prisma.project.findMany({
      where: {
        id: {
          in: projectCounts.map(p => p.projectId),
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const byProject: Record<string, number> = {};
    projectCounts.forEach(pc => {
      const project = projects.find(p => p.id === pc.projectId);
      if (project) {
        byProject[project.name] = pc._count.projectId;
      }
    });

    const byFileType: Record<string, number> = {};
    fileTypeCounts.forEach(ftc => {
      byFileType[ftc.fileType] = ftc._count.fileType;
    });

    return {
      total,
      byProject,
      byFileType,
      totalProjects: projectCounts.length,
    };
  }

  /**
   * Validates name uniqueness within a project
   */
  async isNameUniqueInProject(name: string, projectId: string, excludeId?: string) {
    const where: any = { name, projectId };
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const existing = await prisma.interface.findFirst({ where });
    return !existing;
  }

  /**
   * Gets interfaces for dropdown by project
   */
  async getInterfacesForDropdown(projectId: string) {
    return prisma.interface.findMany({
      where: { projectId },
      select: {
        id: true,
        name: true,
        code: true,
      },
      orderBy: {
        code: 'asc',
      },
    });
  }
}

// Export singleton instance of the repository
export const interfaceRepository = new InterfaceRepository();