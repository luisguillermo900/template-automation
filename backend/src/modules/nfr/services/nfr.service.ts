// nfr/services/nfr.service.ts

import { nfrRepository } from '../repositories/nfr.repository';
import { 
  NfrDTO, 
  NfrCustomizationDTO, 
  NfrDuplicateCheckParams, 
  NfrGlobalSearchParams, 
  FrequentNfrResponse,
  NfrWithRisksResponse
} from '../models/nfr.model';
import { riskService } from '../../risk/services/risk.service'; // Importación del servicio de Risk
import { PrismaClient } from '@prisma/client';

export class NfrService {
  private readonly repository = nfrRepository;
  private readonly prisma = new PrismaClient();

  /**
   * Creates a new non-functional requirement after checking for duplicates
   */
  async createNfr(data: NfrDTO) {
    // Check for duplicate NFRs in the same project
    const isDuplicate = await this.repository.checkDuplicate(
      data.projectId, 
      data.name, 
      data.qualityAttribute
    );

    if (isDuplicate) {
      throw new Error(`A similar NFR with name "${data.name}" already exists in this project`);
    }

    return this.repository.create(data);
  }

  /**
   * Creates a new NFR based on an existing one
   */
  async createNfrFromExisting(sourceNfrCode: string, targetProjectId: string, customizations?: NfrCustomizationDTO) {
    return this.repository.createFromExisting(sourceNfrCode, targetProjectId, customizations);
  }

  /**
   * Checks if a similar NFR already exists in the project
   */
  async checkDuplicateNfr(params: NfrDuplicateCheckParams): Promise<boolean> {
    return this.repository.checkDuplicate(
      params.projectId, 
      params.name, 
      params.qualityAttribute
    );
  }

  /**
   * Gets all non-functional requirements with pagination (global or by project)
   */
  async getNfrs(page: number = 1, limit: number = 10, projectId?: string) {
    const skip = (page - 1) * limit;
    return this.repository.findAll(skip, limit, projectId);
  }

  /**
   * Gets all NFRs with advanced filtering
   */
  async searchNfrsGlobal(params: NfrGlobalSearchParams) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const skip = (page - 1) * limit;

    // Base query - no filtering by project to get global results
    let whereConditions: any = {};

    // Apply filters if provided
    if (params.name) {
      whereConditions.name = {
        contains: params.name,
        mode: 'insensitive',
      };
    }

    if (params.qualityAttribute) {
      whereConditions.qualityAttribute = {
        equals: params.qualityAttribute,
        mode: 'insensitive',
      };
    }

    if (params.status) {
      whereConditions.status = {
        equals: params.status,
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
    const nfrs = await this.prisma.nonFunctionalRequirement.findMany({
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
    const totalCount = await this.prisma.nonFunctionalRequirement.count({
      where: whereConditions,
    });

    return {
      data: nfrs,
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  /**
   * Gets a non-functional requirement by code
   */
  async getNfrByCode(code: string) {
    return this.repository.findByCode(code);
  }

  /**
   * Gets a non-functional requirement by ID
   */
  async getNfrById(id: string) {
    return this.repository.findById(id);
  }

  /**
   * Updates an existing non-functional requirement
   */
  async updateNfr(code: string, data: NfrDTO) {
    // Verify NFR exists
    const existingNfr = await this.repository.findByCode(code);
    if (!existingNfr) {
      throw new Error('Non-functional requirement not found');
    }

    // If name or quality attribute changed, check for duplicates
    if (
      (data.name && data.name !== existingNfr.name) || 
      (data.qualityAttribute && data.qualityAttribute !== existingNfr.qualityAttribute)
    ) {
      const isDuplicate = await this.repository.checkDuplicate(
        data.projectId || existingNfr.projectId,
        data.name || existingNfr.name,
        data.qualityAttribute || existingNfr.qualityAttribute
      );

      if (isDuplicate) {
        throw new Error(`A similar NFR with name "${data.name || existingNfr.name}" already exists in this project`);
      }
    }

    // Increment version
    const newVersion = this.incrementVersion(existingNfr.version);

    // Pasar la versión como parámetro separado
    return this.repository.update(code, data, newVersion);
  }

  /**
   * Deletes a non-functional requirement
   */
  async deleteNfr(id: string) {
    return this.repository.delete(id);
  }

  /**
   * Searches non-functional requirements by name
   */
  async searchNfrs(name: string, projectId?: string) {
    return this.repository.searchByName(name, projectId);
  }

  /**
   * Searches non-functional requirements by date
   */
  async searchNfrsByDate(month: number, year: number, projectId?: string) {
    return this.repository.searchByDate(month, year, projectId);
  }

  /**
   * Searches non-functional requirements by status
   */
  async searchNfrsByStatus(status: string, projectId?: string) {
    return this.repository.searchByStatus(status, projectId);
  }

  /**
   * Searches non-functional requirements by quality attribute
   */
  async searchNfrsByQualityAttribute(qualityAttribute: string, projectId?: string) {
    return this.repository.searchByQualityAttribute(qualityAttribute, projectId);
  }

  /**
   * Gets a non-functional requirement with its risks
   */
  async getNfrWithRisks(code: string): Promise<NfrWithRisksResponse | null> {
    // Obtener el NFR
    const nfr = await this.repository.findByCode(code);
    if (!nfr) {
      return null;
    }

    // Obtener riesgos asociados usando el riskService
    const risks = await riskService.getRisksByEntityAndRegistry('NFR', code);

    return {
      ...nfr,
      risks: risks
    };
  }

  /**
   * Gets all non-functional requirements for a project
   */
  async getNfrsByProject(projectId: string) {
    return this.repository.findByProject(projectId);
  }

  /**
   * Gets NFRs that are derived from a specific source NFR
   */
  async getNfrInstances(sourceNfrCode: string) {
    return this.repository.findInstancesOf(sourceNfrCode);
  }

  /**
   * Gets frequently used NFRs across projects (potential templates)
   */
  async getFrequentNfrs(limit: number = 10): Promise<FrequentNfrResponse[]> {
    return this.repository.getFrequentNfrs(limit) as Promise<FrequentNfrResponse[]>;
  }

  /**
   * Gets the next unique code for a non-functional requirement
   */
  async getNextCode(projectId: string) {
    return this.repository.getNextCode(projectId);
  }

  /**
   * Increments version following XX.YY pattern
   */
  private incrementVersion(currentVersion: string): string {
    const [major, minor] = currentVersion.split('.').map(Number);
    return `${major.toString().padStart(2, '0')}.${(minor + 1).toString().padStart(2, '0')}`;
  }
}

// Export singleton instance of the service
export const nfrService = new NfrService();