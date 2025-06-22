// risk/services/risk.service.ts

import { riskRepository } from '../repositories/risk.repository';
import { 
  RiskDTO, 
  RiskCustomizationDTO, 
  RiskDuplicateCheckParams, 
  RiskGlobalSearchParams, 
  FrequentRiskResponse 
} from '../models/risk.model';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RiskService {
  private readonly repository = riskRepository;

  /**
   * Creates a new risk after checking for duplicates
   */
  async createRisk(data: RiskDTO) {
    // Check for duplicate risks
    const isDuplicate = await this.repository.checkDuplicate(
      data.projectId,
      data.entityType,
      data.registryCode,
      data.description
    );

    if (isDuplicate) {
      throw new Error(`A similar risk with description "${data.description}" already exists for this entity`);
    }

    return this.repository.create(data);
  }

  /**
   * Creates a new risk based on an existing one
   */
  async createRiskFromExisting(sourceRiskCode: string, targetProjectId: string, targetEntityType?: string, targetRegistryCode?: string, customizations?: RiskCustomizationDTO) {
    return this.repository.createFromExisting(
      sourceRiskCode, 
      targetProjectId, 
      targetEntityType, 
      targetRegistryCode, 
      customizations
    );
  }

  /**
   * Checks if a similar risk already exists
   */
  async checkDuplicateRisk(params: RiskDuplicateCheckParams): Promise<boolean> {
    return this.repository.checkDuplicate(
      params.projectId,
      params.entityType,
      params.registryCode,
      params.description
    );
  }

  /**
   * Gets all risks with pagination (global or by project)
   */
  async getRisks(page: number = 1, limit: number = 10, projectId?: string) {
    const skip = (page - 1) * limit;
    return this.repository.findAll(skip, limit, projectId);
  }

  /**
   * Gets all risks with advanced filtering
   */
  async searchRisksGlobal(params: RiskGlobalSearchParams) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const skip = (page - 1) * limit;

    // Base query - no filtering by project to get global results
    let whereConditions: any = {};

    // Apply filters if provided
    if (params.description) {
      whereConditions.description = {
        contains: params.description,
        mode: 'insensitive',
      };
    }

    if (params.impact) {
      whereConditions.impact = {
        equals: params.impact,
        mode: 'insensitive',
      };
    }

    if (params.probability) {
      whereConditions.probability = {
        equals: params.probability,
        mode: 'insensitive',
      };
    }

    if (params.status) {
      whereConditions.status = {
        equals: params.status,
        mode: 'insensitive',
      };
    }

    if (params.entityType) {
      whereConditions.entityType = {
        equals: params.entityType,
        mode: 'insensitive',
      };
    }

    if (params.startDate && params.endDate) {
      whereConditions.creationDate = {
        gte: params.startDate,
        lte: params.endDate,
      };
    }

    // Execute query with filters
    const risks = await prisma.risk.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: {
        creationDate: 'desc',
      },
      include: {
        project: {
          select: {
            code: true,
            name: true,
          },
        },
      },
    });

    // Get total count for pagination info
    const totalCount = await prisma.risk.count({
      where: whereConditions,
    });

    return {
      data: risks,
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  /**
   * Gets a risk by ID
   */
  async getRiskById(id: string) {
    return this.repository.findById(id);
  }

  /**
   * Gets a risk by code
   */
  async getRiskByCode(code: string) {
    return this.repository.findByCode(code);
  }

  /**
   * Updates an existing risk
   */
  async updateRisk(code: string, data: RiskDTO) {
    // Verify risk exists
    const existingRisk = await this.repository.findByCode(code);
    if (!existingRisk) {
      throw new Error('Risk not found');
    }

    // If description changed, check for duplicates
    if (
      data.description && 
      data.description !== existingRisk.description
    ) {
      const isDuplicate = await this.repository.checkDuplicate(
        data.projectId || existingRisk.projectId,
        data.entityType || existingRisk.entityType,
        data.registryCode || existingRisk.registryCode,
        data.description
      );

      if (isDuplicate) {
        throw new Error(`A similar risk with description "${data.description}" already exists for this entity`);
      }
    }

    return this.repository.update(code, data);
  }

  /**
   * Deletes a risk
   */
  async deleteRisk(id: string) {
    return this.repository.delete(id);
  }

  /**
   * Gets risks for a specific entity and registry
   */
  async getRisksByEntityAndRegistry(entityType: string, registryCode: string) {
    return this.repository.findByEntityAndRegistry(entityType, registryCode);
  }

  /**
   * Gets risks for a project
   */
  async getRisksByProject(projectId: string) {
    return this.repository.findByProject(projectId);
  }

  /**
   * Gets similar risks across all projects
   */
  async getSimilarRisks(description: string, limit: number = 10) {
    return this.repository.findSimilarRisks(description, limit);
  }

  /**
   * Gets frequently used risks across projects (potential templates)
   */
  async getFrequentRisks(limit: number = 10): Promise<FrequentRiskResponse[]> {
    return this.repository.getFrequentRisks(limit) as Promise<FrequentRiskResponse[]>;
  }

  /**
   * Searches risks by status
   */
  async searchRisksByStatus(status: string, projectId?: string) {
    return this.repository.searchByStatus(status, projectId);
  }

  /**
   * Searches risks by date
   */
  async searchRisksByDate(month: number, year: number, projectId?: string) {
    return this.repository.searchByDate(month, year, projectId);
  }

  /**
   * Gets the next unique code for a risk
   */
  async getNextCode(projectId: string) {
    return this.repository.getNextCode(projectId);
  }

  /**
   * Calculate PI Index (Probability x Impact) as a numeric value
   */
  calculatePIIndex(probability: string, impact: string): number {
    const probValue = this.getProbabilityValue(probability);
    const impactValue = this.getImpactValue(impact);
    
    return parseFloat((probValue * impactValue).toFixed(2));
  }

  /**
   * Convert probability string to numeric value
   */
  private getProbabilityValue(probability: string): number {
    switch (probability.toLowerCase()) {
      case 'muy alta':
      case 'very high':
        return 0.9;
      case 'alta':
      case 'high':
        return 0.7;
      case 'media':
      case 'medium':
        return 0.5;
      case 'baja':
      case 'low':
        return 0.3;
      case 'muy baja':
      case 'very low':
        return 0.1;
      default:
        // If it's already a numeric string
        {
          const value = parseFloat(probability);
          return isNaN(value) ? 0.5 : value;
        }
    }
  }

  /**
   * Convert impact string to numeric value
   */
  private getImpactValue(impact: string): number {
    switch (impact.toLowerCase()) {
      case 'catastrófico':
      case 'catastrophic':
        return 0.9;
      case 'crítico':
      case 'critical':
        return 0.7;
      case 'moderado':
      case 'moderate':
        return 0.5;
      case 'menor':
      case 'minor':
        return 0.3;
      case 'insignificante':
      case 'insignificant':
        return 0.1;
      default: {
        // If it's already a numeric string
        const value = parseFloat(impact);
        return isNaN(value) ? 0.5 : value;
      }
    }
  }
}

// Export singleton instance of the service
export const riskService = new RiskService();