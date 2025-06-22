// source.repository.ts
import { prisma } from '../../../shared/database/prisma';
import { SourceDTO } from '../models/source.model';

export class SourceRepository {
  async create(projectId: string, data: SourceDTO) {
    const project = await prisma.project.findUnique({ 
      where: { id: projectId } });

    if (!project) throw new Error('Project not found');

    if (!data.sourceDate) {
      throw new Error('sourceDate is required');
    }
    const sourceDateStr = typeof data.sourceDate === 'string'
    ? data.sourceDate
    : data.sourceDate.toISOString().slice(0, 10);

    // Parsear la fecha en componentes numéricos (año, mes, día)
    const [year, month, day] = sourceDateStr.split('-').map(Number);
    
    const code = await this.generateCode(projectId);
    return prisma.source.create({
      data: {
        ...data,
        sourceDate: new Date(`${data.sourceDate}T00:00:00Z`),
        version: '01.00',
        code : code,
        projectId : projectId,
        creationDate: new Date(),
      },
      include: { 
        project: { 
          select: { 
            code: true } } },
    });
  }

  async update(code: string, projectId: string, data: Partial<SourceDTO>, newVersion?: string) {
    const currentSour = await prisma.source.findFirst({ 
      where: { code, projectId } });

    if (!currentSour) throw new Error('Source not found');
      
    // Usar la fecha actual si no viene en el update
    const sourceDateStr = data.sourceDate
      ? typeof data.sourceDate === 'string'
        ? data.sourceDate
        : data.sourceDate.toISOString().slice(0, 10)
      : currentSour.sourceDate
        ? currentSour.sourceDate.toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10);

     // Solo crear Date si hay fecha válida
  let sourceDate: Date | undefined = undefined;
  if (data.sourceDate) {
    const d = new Date(`${sourceDateStr}T00:00:00Z`);
    if (!isNaN(d.getTime())) sourceDate = d;
  }

    const version = newVersion || this.incrementVersion(currentSour.version);
    return prisma.source.update({
      where: { 
        id: currentSour.id },
      data: { 
        ...data,
        ...(sourceDate && { sourceDate }), 
        version, 
        modificationDate: new Date() },
      include: {
        project: {
          select: {
            code: true,
          },
        },
      },
    });
  }

  async findAllByProject(projectId: string, skip: number = 0, take = 20) {
    return prisma.source.findMany({
      where: { projectId },
      skip,
      take,
      orderBy: { creationDate: 'desc' },
      include: { project: { select: { code: true } } },
    });
  }

  async findByCode(code: string) {
    return prisma.source.findFirst({ 
        where: { code },
        include: { 
          project:{ 
          select: { 
            code: true } } },
    });
    
  }

  async findByCodeAndProject(code: string, projectId: string) {
    return prisma.source.findFirst({ 
        where: { code, projectId },
        include: { project: { select: { code: true } } },
    });
  }

  async delete(id: string) {
    return prisma.source.delete({ where: { id } });
  }

  async searchByName(projectId: string, name: string) {
    return prisma.source.findMany({
      where: { 
        projectId, 
        name: { contains: name, mode: 'insensitive' } 
    },
      orderBy: { creationDate: 'desc' },
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

    return await prisma.source.findMany({
      where: {
        projectId: project.id,
        ...dateFilter
      }
    });
  }

  async getNextCode(projectId: string): Promise<string> {
    const counter = await this.getNextCounter(projectId);
    return `FUE-${counter.toString().padStart(3, '0')}`;
  }

  async generateCode(projectId: string): Promise<string> {
    const counter = await this.getNextCounter(projectId);
    return `FUE-${counter.toString().padStart(3, '0')}`;
  }

  async getNextCounter(projectId: string): Promise<number> {
    
    if (!projectId || typeof projectId !== 'string') {
        throw new Error('Invalid project ID');
      }
    console.log(`Generating counter for project ID: ${projectId}`);

    
    try {
        const counter = await prisma.counter.upsert({
        where: {
            entity_contextId: { 
                entity: 'SOURCE', 
                contextId: projectId 
            },
        },
        update: { counter: { increment: 1 } },
        create: { entity: 'SOURCE', 
            contextId: projectId, 
            counter: 1 },
        });
        console.log(`Generated counter: ${counter.counter} for project: ${projectId}`);
        return counter.counter;
    }catch (error) {
        console.error("Error generating counter:", error);
        if (error instanceof Error) {
        throw new Error(`Failed to generate counter: ${error.message}`);
        }
        throw new Error('Failed to generate counter due to an unknown error');
    }
}


/**
   * Obtiene el siguiente código de fuente sin incrementar el contador
   */
  async getNextCodePreview(projectId: string): Promise<string> {
    const currentCounter = await this.getCurrentCounter(projectId);
    const nextCounter = currentCounter + 1;
    return `FUE-${nextCounter.toString().padStart(3, '0')}`;
  }

  /**
   * Obtiene el contador actual sin incrementarlo
   */
  async getCurrentCounter(projectId: string): Promise<number> {
    const counter = await prisma.counter.findUnique({
      where: {
        entity_contextId: {
          entity: 'SOURCE',
          contextId: projectId,
        }
      },
    });
    return counter ? counter.counter : 0;
  }

  private incrementVersion(version: string): string {
    const [major, minor] = version.split('.');
    return `${major}.${(parseInt(minor) + 1).toString().padStart(2, '0')}`;
  }
}

export const sourceRepository = new SourceRepository();
