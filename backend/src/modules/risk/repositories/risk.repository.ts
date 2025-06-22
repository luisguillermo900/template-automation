// risk/repositories/risk.repository.ts

import { prisma } from '../../../shared/database/prisma';
import { RiskDTO } from '../models/risk.model';

export class RiskRepository {
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
   * Creates a new risk in the database
   */
  async create(data: RiskDTO) {
    // Resolver el ID del proyecto si es necesario
    const resolvedProjectId = await this.resolveProjectId(data.projectId);
    
    // Crear una copia de los datos y eliminar campos que pueden no existir en la base de datos
    const prismaData = { ...data };
    
    // Eliminar campos que pueden no existir en la BD actual
    if ('sourceRiskCode' in prismaData) {
      delete prismaData.sourceRiskCode;
    }
    
    const counter = await this.getNextCounter(resolvedProjectId);
    const code = `RISK-${counter.toString().padStart(4, '0')}`;
    
    return prisma.risk.create({
      data: {
        ...prismaData,
        projectId: resolvedProjectId, // Usar el ID correcto
        code: code,
        creationDate: new Date(),
      },
    });
  }

  /**
   * Creates a new risk based on an existing one (copying attributes)
   */
  async createFromExisting(sourceRiskCode: string, targetProjectId: string, targetEntityType?: string, targetRegistryCode?: string, customizations?: Partial<RiskDTO>) {
    // Find the source risk
    const sourceRisk = await prisma.risk.findUnique({
      where: { code: sourceRiskCode },
    });

    if (!sourceRisk) {
      throw new Error(`Source risk with code ${sourceRiskCode} not found`);
    }

    // Resolver el ID del proyecto si es necesario
    const resolvedProjectId = await this.resolveProjectId(targetProjectId);

    // Generate code for new risk
    const counter = await this.getNextCounter(resolvedProjectId);
    const newCode = `RISK-${counter.toString().padStart(4, '0')}`;

    // Crear data básica para el riesgo
    const riskData: any = {
      description: customizations?.description ?? sourceRisk.description,
      impact: customizations?.impact ?? sourceRisk.impact,
      probability: customizations?.probability ?? sourceRisk.probability,
      status: customizations?.status ?? 'Nuevo',
      comments: customizations?.comments ?? `Basado en ${sourceRiskCode}`,
      projectId: resolvedProjectId,
      entityType: targetEntityType ?? sourceRisk.entityType,
      registryCode: targetRegistryCode ?? sourceRisk.registryCode,
      code: newCode,
      creationDate: new Date()
    };

    // Intentar añadir sourceRiskCode si existe en el modelo
    try {
      return await prisma.risk.create({
        data: {
          ...riskData,
          sourceRiskCode: sourceRiskCode,
        },
      });
    } catch (error) {
      // Si falla, probablemente el campo sourceRiskCode no existe, intentar sin él
      console.warn('Error creating risk with sourceRiskCode, trying without it:', error);
      
      return await prisma.risk.create({
        data: riskData,
      });
    }
  }

  /**
   * Checks if a similar risk already exists for the entity
   */
  async checkDuplicate(projectId: string, entityType: string, registryCode: string, description: string): Promise<boolean> {
    const resolvedProjectId = await this.resolveProjectId(projectId);
    
    const count = await prisma.risk.count({
      where: {
        projectId: resolvedProjectId,
        entityType: entityType,
        registryCode: registryCode,
        description: {
          equals: description,
          mode: 'insensitive', // Case insensitive comparison
        }
      },
    });

    return count > 0;
  }

  /**
   * Gets all risks with pagination (can be filtered by project)
   */
  async findAll(skip: number, take: number, projectId?: string) {
    let resolvedProjectId = projectId;
    
    // Si se proporciona un projectId, resolverlo si es necesario
    if (projectId) {
      resolvedProjectId = await this.resolveProjectId(projectId);
    }
    
    return prisma.risk.findMany({
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
   * Finds a risk by ID
   */
  async findById(id: string) {
    return prisma.risk.findUnique({
      where: { id },
    });
  }

  /**
   * Finds a risk by code
   */
  async findByCode(code: string) {
    return prisma.risk.findUnique({
      where: { code },
    });
  }

  /**
   * Updates an existing risk
   */
  async update(code: string, data: Partial<RiskDTO>) {
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
    if ('sourceRiskCode' in prismaData) {
      delete prismaData.sourceRiskCode;
    }
    
    // Asegurarse de que modificationDate esté presente solo si la base de datos tiene este campo
    try {
      return prisma.risk.update({
        where: { code },
        data: {
          ...prismaData,
          modificationDate: new Date(),
        },
      });
    } catch (error) {
      // Si falla por modificationDate, intentar sin ese campo
      console.warn('Error updating with modificationDate, trying without it:', error);
      
      if ('modificationDate' in prismaData) {
        delete prismaData.modificationDate;
      }
      
      return prisma.risk.update({
        where: { code },
        data: prismaData,
      });
    }
  }

  /**
   * Deletes a risk by ID
   */
  async delete(id: string) {
    return prisma.risk.delete({
      where: { id },
    });
  }

  /**
   * Gets risks by entity type and registry code
   */
  async findByEntityAndRegistry(entityType: string, registryCode: string) {
    return prisma.risk.findMany({
      where: { 
        entityType: entityType,
        registryCode: registryCode
      },
      orderBy: {
        creationDate: 'desc',
      },
    });
  }

  /**
   * Gets risks by project ID
   */
  async findByProject(projectId: string) {
    const resolvedProjectId = await this.resolveProjectId(projectId);
    
    return prisma.risk.findMany({
      where: { projectId: resolvedProjectId },
      orderBy: {
        creationDate: 'desc',
      },
    });
  }

  /**
   * Gets similar risks across all projects
   */
  async findSimilarRisks(description: string, limit: number = 10) {
    return prisma.risk.findMany({
      where: {
        description: {
          contains: description,
          mode: 'insensitive',
        },
      },
      orderBy: {
        creationDate: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Gets common risks that appear in multiple projects
   */
  async getFrequentRisks(limit: number = 10) {
    try {
      // This query finds risks that appear in multiple projects with similar descriptions
      const frequentRisks = await prisma.$queryRaw`
        SELECT 
          r.description, 
          COUNT(DISTINCT r.projectId) as projectCount,
          r.code as sampleCode
        FROM "Risk" r
        GROUP BY r.description
        HAVING COUNT(DISTINCT r.projectId) > 1
        ORDER BY projectCount DESC
        LIMIT ${limit}
      `;

      return frequentRisks;
    } catch (error) {
      console.warn('Error getting frequent risks:', error);
      return [];
    }
  }

  /**
   * Searches risks by status
   */
  async searchByStatus(status: string, projectId?: string) {
    let resolvedProjectId = projectId;
    
    // Si se proporciona un projectId, resolverlo si es necesario
    if (projectId) {
      resolvedProjectId = await this.resolveProjectId(projectId);
    }
    
    return prisma.risk.findMany({
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
   * Searches risks by date (month and year)
   */
  async searchByDate(month: number, year: number, projectId?: string) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    let resolvedProjectId = projectId;
    
    // Si se proporciona un projectId, resolverlo si es necesario
    if (projectId) {
      resolvedProjectId = await this.resolveProjectId(projectId);
    }

    return prisma.risk.findMany({
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
   * Gets next counter for generating unique codes
   */
  async getNextCounter(projectId: string) {
    const counter = await prisma.counter.upsert({
      where: {
        entity_contextId: {
          entity: 'risk',
          contextId: projectId
        }
      },
      create: {
        entity: 'risk',
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
   * Gets next code for a new risk
   */
  async getNextCode(projectId: string): Promise<string> {
    const resolvedProjectId = await this.resolveProjectId(projectId);
    const counter = await this.getNextCounter(resolvedProjectId);
    return `RISK-${counter.toString().padStart(4, '0')}`;
  }
}

// Export singleton instance of the repository
export const riskRepository = new RiskRepository();