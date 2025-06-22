import { prisma } from '../../../shared/database/prisma';
import { ExpertDTO } from '../models/expert.model';
export class ExpertRepository {

  /**
   * Creates a new expert in the database
   */

  async create(projectId: string, data: ExpertDTO) {
    
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const code = await this.generateCode(projectId);
    return prisma.expert.create({
      data: {
        ...data,
        version: '01.00',
        externalOrganization: data.externalOrganization ?? null,
        code: code,
        projectId: projectId,
        creationDate: new Date(),
      },
      include: {
        project: {
          select: { code: true },
        },
      },
    });
  }

  async update(code: string,projectId: string, data: Partial<ExpertDTO>, newVersion?: string) {
    const currentExp = await prisma.expert.findFirst({ 
      where: { code, projectId  } 
    });
    if (!currentExp) throw new Error('Expert not found');

    const version = newVersion || this.incrementVersion(currentExp.version);

    return prisma.expert.update({
      where: { id: currentExp.id },
      data: {
        ...data,
        externalOrganization: data.externalOrganization ?? currentExp.externalOrganization,
        version,
        modificationDate: new Date(),
      },
      include: {
        project: { select: { code: true } },
      },
    });
  }

  async findAllByProject(projectId: string, skip: number = 0, take = 20) {
    return prisma.expert.findMany({
      where: { projectId },
      skip,
      take,
      orderBy: { creationDate: 'desc' },
      include: { project: { select: { code: true } } },
    });
  }

  async findById(id: string) {
    return prisma.expert.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            code: true,
          },
        },
      },
    });
  }
  
  async findByCode(code: string) {
    return prisma.expert.findFirst({
      where: { code },
      include: { 
        project: { 
          select: { 
            code: true } } },
    });
  }

  async findByCodeAndProject(code: string, projectId: string) {
    return prisma.expert.findFirst({
      where: { code, projectId },
      include: { project: { select: { code: true } } },
    });
  }

  async delete(id: string) {
    return prisma.expert.delete({ where: { id } });
  }

  async searchByName(projectId: string, name: string) {
    return prisma.expert.findMany({
      where: {
        projectId,
        firstName: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: {
        creationDate: 'desc',
      },
      include: {
        project: {
          select: {
            code: true,
          },
        },
      },
    });
  }


  /**
   * Searches projects by date
   */
  async searchByDate(projectId: string, year?: string, month?: string) {
    // Buscar el proyecto en la tabla correcta
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      throw new Error(`Project with id ${projectId} not found`);
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

    return await prisma.expert.findMany({
      where: {
        projectId: project.id,
        ...dateFilter
      }
    });
  }

  async getNextCode(projectId: string): Promise<string> {
    const counter = await this.getNextCounter(projectId);
    return `EXP-${counter.toString().padStart(3, '0')}`;
  }
 
  async generateCode(projectId: string): Promise<string> {
    const counter = await this.getNextCounter(projectId);
    return `EXP-${counter.toString().padStart(3, '0')}`;
  }
  async getNextCounter(projectId: string): Promise<number> {
    
    if (!projectId || typeof projectId !== 'string') {
      throw new Error('Invalid project ID');
    }

    console.log(`Generating counter for project ID: ${projectId}`);
      try {
      const counterRecord = await prisma.counter.upsert({
        where: {
          entity_contextId: {
            entity: 'EXPERT',
            contextId: projectId,
          },
        },
        update: { 
          counter: { 
            increment: 1 
          } 
        },
        create: {
          entity: 'EXPERT',
          contextId: projectId,
          counter: 1,
        },
      });
      console.log(`Generated counter: ${counterRecord.counter} for project: ${projectId}`);
        return counterRecord.counter;
    }catch (error) {
      console.error("Error generating counter:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to generate counter: ${error.message}`);
      }
      throw new Error('Failed to generate counter due to an unknown error');
    }
  }

  /**
   * Gets next code for a new organization without incrementing the counter
   */
  async getNextCodePreview(projectId: string): Promise<string> {
    const currentCounter = await this.getCurrentCounter(projectId);
    //console.log(`Project ID: ${currentCounter}`);
    // Add 1 to show the next code without affecting the database
    const nextCounter = currentCounter + 1;
    return `EXP-${nextCounter.toString().padStart(3, '0')}`;
  }
   /**
   * Gets current counter without incrementing it
   */
  async getCurrentCounter(projectId: string): Promise<number> {
  //console.log(`Project ID: ${projectId}`);
  const counter = await prisma.counter.findUnique({
    where: {
      entity_contextId: {
        entity: 'EXPERT',
        contextId: projectId, // <-- aquí debe ir el projectId
      }
    },
  });

  // If no counter exists yet, return 0
  return counter ? counter.counter : 0;
}


  private incrementVersion(currentVersion: string): string {
    const [major, minor] = currentVersion.split('.');
    const newMinor = (parseInt(minor) + 1).toString().padStart(2, '0');
    return `${major}.${newMinor}`;
  }
}



export const expertRepository = new ExpertRepository();
