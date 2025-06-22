import { prisma } from '../../../shared/database/prisma';
import { OrganizationDTO } from '../models/organization.model';

export class OrganizationRepository {
  /**
   * Creates a new organization in the database
   */
  async create(data: OrganizationDTO) {
    const counter = await this.getNextCounter();
    const code = `ORG-${counter.toString().padStart(3, '0')}`;

    return prisma.organization.create({
      data: {
        ...data,
        code: code,
        version: '01.00', // Versión inicial
        creationDate: new Date(),
      },
    });
  }

  /**
   * Creates the main organization with a fixed code
   */
  async createMainOrganization(data: OrganizationDTO) {
    return prisma.organization.create({
      data: {
        ...data,
        code: 'ORG-MAIN',
        version: '01.00',
        creationDate: new Date(),
      },
    });
  }

  /**
   * Gets all organizations with pagination
   */
  async findAll(skip: number, take: number) {
    return prisma.organization.findMany({
      skip,
      take,
      orderBy: {
        creationDate: 'desc'
      }
    });
  }

  /**
   * Finds an organization by ID
   */
  async findById(id: string) {
    return prisma.organization.findUnique({
      where: { id },
    });
  }

  /**
   * Finds an organization by code
   */
  async findByCode(code: string) {
    return prisma.organization.findUnique({
      where: { code },
    });
  }

  /**
   * Updates an existing organization
   */
  async update(code: string, data: Partial<OrganizationDTO>, newVersion?: string) {
    return prisma.organization.update({
      where: { code },
      data: {
        ...data,
        ...(newVersion && { version: newVersion }),
        modificationDate: new Date(),
      },
    });
  }

  /**
   * Deletes an organization by ID
   */
  async delete(id: string) {
    return prisma.organization.delete({
      where: { id },
    });
  }

  /**
   * Gets an organization with its projects
   */
  async findWithProjects(code: string) {
    return prisma.organization.findUnique({
      where: { code },
      include: { projects: true },
    });
  }

  /**
   * Searches organizations by name
   */
  async searchByName(name: string) {
    return prisma.organization.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: {
        creationDate: 'desc',
      },
    });
  }

  /**
   * Searches organizations by date (month and year)
   */
  async searchByDate(month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return prisma.organization.findMany({
      where: {
        creationDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        creationDate: 'desc',
      },
    });
  }

  /**
   * Gets next counter for generating unique codes
   */
  async getNextCounter() {
    const counter = await prisma.counter.upsert({
      where: {
        entity_contextId: {
          entity: 'organization',
          contextId: 'global'
        }
      },
      create: {
        entity: 'organization',
        contextId: 'global',
        counter: 1,
      },
      update: {
        counter: { increment: 1 },
      },
    });

    return counter.counter;
  }

  /**
   * Gets next code for a new organization
   */
  async getNextCode(): Promise<string> {
    const counter = await this.getNextCounter();
    return `ORG-${counter.toString().padStart(3, '0')}`;
  }

  /**
   * Gets current counter without incrementing it
   */
  async getCurrentCounter() {
    const counter = await prisma.counter.findUnique({
      where: {
        entity_contextId: {
          entity: 'organization',
          contextId: 'global'
        }
      },
    });

    // If no counter exists yet, return 0
    return counter ? counter.counter : 0;
  }

  /**
   * Gets next code for a new organization without incrementing the counter
   */
  async getNextCodePreview(): Promise<string> {
    const currentCounter = await this.getCurrentCounter();
    // Add 1 to show the next code without affecting the database
    const nextCounter = currentCounter + 1;
    return `ORG-${nextCounter.toString().padStart(3, '0')}`;
  }
}

// Export singleton instance of the repository
export const organizationRepository = new OrganizationRepository();