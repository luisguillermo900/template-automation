// repositories/acceptanceRecord.repository.ts
import { prisma } from '../../../shared/database/prisma';
import { AcceptanceRecordDTO, AcceptanceRecordSearchParams } from '../models/acceptanceRecord.model';

export class AcceptanceRecordRepository {
  /**
   * Creates a new acceptance record in the database
   */
  async create(data: AcceptanceRecordDTO) {
    return prisma.acceptanceRecord.create({
      data: {
        ...data,
        uploadDate: new Date(),
      },
      include: {
        project: {
          include: {
            organization: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Gets all acceptance records with pagination
   */
  async findAll(skip: number, take: number) {
    return prisma.acceptanceRecord.findMany({
      skip,
      take,
      include: {
        project: {
          include: {
            organization: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        uploadDate: 'desc',
      },
    });
  }

  /**
   * Finds an acceptance record by ID
   */
  async findById(id: string) {
    return prisma.acceptanceRecord.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            organization: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Finds acceptance records by project ID
   */
  async findByProjectId(projectId: string) {
    return prisma.acceptanceRecord.findMany({
      where: { projectId },
      include: {
        project: {
          include: {
            organization: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        uploadDate: 'desc',
      },
    });
  }

  /**
   * Updates an existing acceptance record
   */
  async update(id: string, data: Partial<AcceptanceRecordDTO>) {
    return prisma.acceptanceRecord.update({
      where: { id },
      data,
      include: {
        project: {
          include: {
            organization: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Deletes an acceptance record by ID
   */
  async delete(id: string) {
    return prisma.acceptanceRecord.delete({
      where: { id },
    });
  }

  /**
   * Searches acceptance records with filters
   */
  async search(params: AcceptanceRecordSearchParams) {
    const where: any = {};

    if (params.projectId) {
      where.projectId = params.projectId;
    }

    if (params.fileType) {
      where.fileType = {
        contains: params.fileType,
        mode: 'insensitive',
      };
    }

    if (params.startDate && params.endDate) {
      where.uploadDate = {
        gte: params.startDate,
        lte: params.endDate,
      };
    }

    return prisma.acceptanceRecord.findMany({
      where,
      include: {
        project: {
          include: {
            organization: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        uploadDate: 'desc',
      },
    });
  }

  /**
   * Gets total count of acceptance records
   */
  async count() {
    return prisma.acceptanceRecord.count();
  }

  /**
   * Gets total count of acceptance records by project
   */
  async countByProject(projectId: string) {
    return prisma.acceptanceRecord.count({
      where: { projectId },
    });
  }

  /**
   * Gets acceptance records by file type
   */
  async findByFileType(fileType: string) {
    return prisma.acceptanceRecord.findMany({
      where: {
        fileType: {
          contains: fileType,
          mode: 'insensitive',
        },
      },
      include: {
        project: {
          include: {
            organization: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        uploadDate: 'desc',
      },
    });
  }
}

// Export singleton instance of the repository
export const acceptanceRecordRepository = new AcceptanceRecordRepository();