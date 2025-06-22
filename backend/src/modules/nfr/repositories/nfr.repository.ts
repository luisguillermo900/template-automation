import { prisma } from '../../../shared/database/prisma';
import { NfrDTO } from '../models/nfr.model';

export class NfrRepository {
  /**
   * Helper method to resolve project ID from code if necessary
   */
  private async resolveProjectId(projectId: string): Promise<string> {
    // Si parece ser un código (como PROJ-001) en lugar de un UUID
    if (projectId?.startsWith('PROJ-')) {
      // Buscar el proyecto por código
      const project = await prisma.project.findFirst({
        where: { code: projectId }
      });
      
      if (!project) {
        throw new Error(`Project with code ${projectId} not found`);
      }
      
      return project.id; // Devolver el ID real
    }
    
    return projectId; // Ya es un ID
  }

  /**
   * Creates a new non-functional requirement in the database
   */
  async create(data: NfrDTO) {
    // Resolver el ID del proyecto si es necesario
    const resolvedProjectId = await this.resolveProjectId(data.projectId);
    
    // Crear una copia de los datos y eliminar campos que pueden no existir en la base de datos
    const prismaData = { ...data };
    
    // Eliminar campos que pueden no existir en la BD actual
    if ('sourceNfrCode' in prismaData) {
      delete prismaData.sourceNfrCode;
    }
    
    const counter = await this.getNextCounter(resolvedProjectId);
    const code = `RNF-${counter.toString().padStart(4, '0')}`;
    
    return prisma.nonFunctionalRequirement.create({
      data: {
        ...prismaData,
        projectId: resolvedProjectId, // Usar el ID correcto
        code: code,
        version: '00.01', // Versión inicial
        creationDate: new Date(),
      },
    });
  }

  /**
   * Creates a new NFR based on an existing one (copying attributes)
   */
  async createFromExisting(sourceNfrCode: string, targetProjectId: string, customizations?: Partial<NfrDTO>) {
    // Find the source NFR
    const sourceNfr = await prisma.nonFunctionalRequirement.findUnique({
      where: { code: sourceNfrCode },
    });

    if (!sourceNfr) {
      throw new Error(`Source NFR with code ${sourceNfrCode} not found`);
    }

    // Resolver el ID del proyecto si es necesario
    const resolvedProjectId = await this.resolveProjectId(targetProjectId);

    // Generate code for new NFR
    const counter = await this.getNextCounter(resolvedProjectId);
    const newCode = `RNF-${counter.toString().padStart(4, '0')}`;

    // Crear una copia de los datos y eliminar campos que pueden no existir en la base de datos
    const nfrData: any = {
      name: customizations?.name ?? sourceNfr.name,
      qualityAttribute: customizations?.qualityAttribute ?? sourceNfr.qualityAttribute,
      description: customizations?.description ?? sourceNfr.description,
      status: customizations?.status ?? sourceNfr.status ?? 'Nuevo',
      importance: customizations?.importance ?? sourceNfr.importance ?? 'Media',
      comment: customizations?.comment ?? sourceNfr.comment ?? `Basado en ${sourceNfrCode}`,
      projectId: resolvedProjectId,
      code: newCode,
      version: '00.01',
      creationDate: new Date()
    };

    // Intentar añadir sourceNfrCode si existe en el modelo
    try {
      return await prisma.nonFunctionalRequirement.create({
        data: {
          ...nfrData,
          sourceNfrCode: sourceNfrCode,
        },
      });
    } catch (error) {
      // Si falla, probablemente el campo sourceNfrCode no existe, intentar sin él
      console.warn('Error creating NFR with sourceNfrCode, trying without it:', error);
      
      return await prisma.nonFunctionalRequirement.create({
        data: nfrData,
      });
    }
  }

  /**
   * Checks if a similar NFR already exists in the project
   */
  async checkDuplicate(projectId: string, name: string, qualityAttribute?: string): Promise<boolean> {
    const resolvedProjectId = await this.resolveProjectId(projectId);
    
    const count = await prisma.nonFunctionalRequirement.count({
      where: {
        projectId: resolvedProjectId,
        name: {
          equals: name,
          mode: 'insensitive', // Case insensitive comparison
        },
        ...(qualityAttribute && {
          qualityAttribute: {
            equals: qualityAttribute,
            mode: 'insensitive',
          },
        }),
      },
    });

    return count > 0;
  }

  /**
   * Gets all non-functional requirements with pagination (can be filtered by project)
   */
  async findAll(skip: number, take: number, projectId?: string) {
    let resolvedProjectId = projectId;
    
    // Si se proporciona un projectId, resolverlo si es necesario
    if (projectId) {
      resolvedProjectId = await this.resolveProjectId(projectId);
    }
    
    return prisma.nonFunctionalRequirement.findMany({
      where: {
        ...(resolvedProjectId && { projectId: resolvedProjectId }),
      },
      skip,
      take,
      orderBy: {
        creationDate: 'desc'
      }
    });
  }

  /**
   * Finds a non-functional requirement by ID
   */
  async findById(id: string) {
    return prisma.nonFunctionalRequirement.findUnique({
      where: { id },
    });
  }

  /**
   * Finds a non-functional requirement by code
   */
  async findByCode(code: string) {
    return prisma.nonFunctionalRequirement.findUnique({
      where: { code },
    });
  }

  /**
   * Updates an existing non-functional requirement
   */
  async update(code: string, data: Partial<NfrDTO>, newVersion?: string) {
    let resolvedProjectId = data.projectId;
    
    // Si se proporciona un projectId, resolverlo si es necesario
    if (data.projectId) {
      resolvedProjectId = await this.resolveProjectId(data.projectId);
    }
    
    // Crear una copia de los datos y actualizar el projectId si fue resuelto
    const prismaData = { ...data };
    if (resolvedProjectId !== data.projectId) {
      prismaData.projectId = resolvedProjectId;
    }
    
    // Eliminar campos que pueden no existir en la BD actual
    if ('sourceNfrCode' in prismaData) {
      delete prismaData.sourceNfrCode;
    }
    
    return prisma.nonFunctionalRequirement.update({
      where: { code },
      data: {
        ...prismaData,
        ...(newVersion && { version: newVersion }),
        modificationDate: new Date(),
      },
    });
  }

  /**
   * Deletes a non-functional requirement by ID
   */
  async delete(id: string) {
    return prisma.nonFunctionalRequirement.delete({
      where: { id },
    });
  }

  /**
   * Gets a non-functional requirement with its related risks
   */
  async findWithRisks(code: string) {
    const nfr = await prisma.nonFunctionalRequirement.findUnique({
      where: { code },
    });

    if (!nfr) {
      return null;
    }

    const risks = await prisma.risk.findMany({
      where: {
        entityType: 'NFR',
        registryCode: code,
      },
    });

    return {
      ...nfr,
      risks: risks,
    };
  }

  /**
   * Finds NFRs that have references to a source NFR
   */
  async findInstancesOf(sourceNfrCode: string) {
    try {
      return await prisma.nonFunctionalRequirement.findMany({
        where: {
          sourceNfrCode: sourceNfrCode,
        },
        orderBy: {
          creationDate: 'desc',
        },
      });
    } catch (error) {
      // Si falla, probablemente el campo sourceNfrCode no existe
      console.warn('Error finding instances by sourceNfrCode:', error);
      return [];
    }
  }

  /**
   * Searches non-functional requirements by name
   */
  async searchByName(name: string, projectId?: string) {
    let resolvedProjectId = projectId;
    
    // Si se proporciona un projectId, resolverlo si es necesario
    if (projectId) {
      resolvedProjectId = await this.resolveProjectId(projectId);
    }
    
    return prisma.nonFunctionalRequirement.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
        ...(resolvedProjectId && { projectId: resolvedProjectId }),
      },
      orderBy: {
        creationDate: 'desc',
      },
    });
  }

  /**
   * Searches non-functional requirements by date (month and year)
   */
  async searchByDate(month: number, year: number, projectId?: string) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    let resolvedProjectId = projectId;
    
    // Si se proporciona un projectId, resolverlo si es necesario
    if (projectId) {
      resolvedProjectId = await this.resolveProjectId(projectId);
    }

    return prisma.nonFunctionalRequirement.findMany({
      where: {
        creationDate: {
          gte: startDate,
          lte: endDate,
        },
        ...(resolvedProjectId && { projectId: resolvedProjectId }),
      },
      orderBy: {
        creationDate: 'desc',
      },
    });
  }

  /**
   * Searches non-functional requirements by status
   */
  async searchByStatus(status: string, projectId?: string) {
    let resolvedProjectId = projectId;
    
    // Si se proporciona un projectId, resolverlo si es necesario
    if (projectId) {
      resolvedProjectId = await this.resolveProjectId(projectId);
    }
    
    return prisma.nonFunctionalRequirement.findMany({
      where: {
        status: status,
        ...(resolvedProjectId && { projectId: resolvedProjectId }),
      },
      orderBy: {
        creationDate: 'desc',
      },
    });
  }

  /**
   * Searches non-functional requirements by quality attribute
   */
  async searchByQualityAttribute(qualityAttribute: string, projectId?: string) {
    let resolvedProjectId = projectId;
    
    // Si se proporciona un projectId, resolverlo si es necesario
    if (projectId) {
      resolvedProjectId = await this.resolveProjectId(projectId);
    }
    
    return prisma.nonFunctionalRequirement.findMany({
      where: {
        qualityAttribute: qualityAttribute,
        ...(resolvedProjectId && { projectId: resolvedProjectId }),
      },
      orderBy: {
        creationDate: 'desc',
      },
    });
  }

  /**
   * Gets frequently used NFRs for potential templates
   */
  async getFrequentNfrs(limit: number = 10) {
    try {
      // This query finds NFRs that appear in multiple projects with similar attributes
      const frequentNfrs = await prisma.$queryRaw`
        SELECT 
          n.name, 
          n.qualityAttribute, 
          COUNT(DISTINCT n.projectId) as projectCount,
          n.code as sampleCode
        FROM "NonFunctionalRequirement" n
        GROUP BY n.name, n.qualityAttribute
        HAVING COUNT(DISTINCT n.projectId) > 1
        ORDER BY projectCount DESC
        LIMIT ${limit}
      `;

      return frequentNfrs;
    } catch (error) {
      console.warn('Error getting frequent NFRs:', error);
      return [];
    }
  }

  /**
   * Gets next counter for generating unique codes
   */
  async getNextCounter(projectId: string) {
    const counter = await prisma.counter.upsert({
      where: {
        entity_contextId: {
          entity: 'nfr',
          contextId: projectId
        }
      },
      create: {
        entity: 'nfr',
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
   * Gets next code for a new non-functional requirement
   */
  async getNextCode(projectId: string): Promise<string> {
    const resolvedProjectId = await this.resolveProjectId(projectId);
    const counter = await this.getNextCounter(resolvedProjectId);
    return `RNF-${counter.toString().padStart(4, '0')}`;
  }

  /**
   * Gets all non-functional requirements by project
   */
  async findByProject(projectId: string) {
    const resolvedProjectId = await this.resolveProjectId(projectId);
    
    return prisma.nonFunctionalRequirement.findMany({
      where: { projectId: resolvedProjectId },
      orderBy: {
        creationDate: 'desc',
      },
    });
  }
}

// Export singleton instance of the repository
export const nfrRepository = new NfrRepository();