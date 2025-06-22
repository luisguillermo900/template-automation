import { prisma } from '../../../../shared/database/prisma';
import { IlacionDTO } from '../models/ilacion.model';

export class IlacionRepository {
  /**
   * Creates a new ilacion in the database
   */
  async create(educcionId: string, data: IlacionDTO) {
    const educcion = await prisma.educcion.findUnique({
      where: { id: educcionId },
    });

    if (!educcion) {
      throw new Error('Educcion not found');
    }

    const code = await this.generateCode(educcionId);

    return prisma.ilacion.create({
      data: {
        name: data.name,
        status: data.status || 'Pending',
        importance: data.importance || 'Medium', // Cambiado de priority a importance
        precondition: data.precondition,
        procedure: data.procedure,
        postcondition: data.postcondition,
        comment: data.comment,
        code: code,
        version: '01.00',
        educcionId: educcionId,
        creationDate: new Date(),
      },
      include: {
        educcion: {
          select: {
            code: true,
            project: {
              select: {
                code: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Updates an existing ilacion
   */
  async update(id: string, data: Partial<IlacionDTO>, newVersion?: string) {
    return prisma.ilacion.update({
      where: { id },
      data: {
        name: data.name,
        status: data.status,
        importance: data.importance, // Cambiado de priority a importance
        precondition: data.precondition,
        procedure: data.procedure,
        postcondition: data.postcondition,
        comment: data.comment,
        version: newVersion,
        modificationDate: new Date(),
      },
      include: {
        educcion: {
          select: {
            code: true,
            project: {
              select: {
                code: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Finds an ilacion by its code and educcionId
   */
  async findByCodeAndEduccion(code: string, educcionId: string) {
    return prisma.ilacion.findFirst({
      where: {
        code,
        educcionId
      },
      include: {
        educcion: {
          select: {
            code: true,
            project: {
              select: {
                code: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Finds an ilacion by its code
   */
  async findByCode(code: string) {
    return prisma.ilacion.findFirst({
      where: { code },
      include: {
        educcion: {
          select: {
            code: true,
            project: {
              select: {
                code: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Deletes an ilacion by its ID
   */
  async delete(id: string) {
    return prisma.ilacion.delete({
      where: { id },
    });
  }

  /**
   * Gets all ilaciones from an educcion with pagination
   */
  async findAllByEduccion(educcionId: string, skip: number = 0, take: number = 20) {
    return prisma.ilacion.findMany({
      where: {
        educcionId,
      },
      skip,
      take,
      orderBy: {
        creationDate: 'desc',
      },
      include: {
        educcion: {
          select: {
            code: true,
            project: {
              select: {
                code: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Searches ilaciones by name within an educcion
   */
  async searchByName(educcionId: string, name: string) {
    return prisma.ilacion.findMany({
      where: {
        educcionId,
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: {
        creationDate: 'desc',
      },
      include: {
        educcion: {
          select: {
            code: true,
            project: {
              select: {
                code: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Gets the next code preview without incrementing the counter
   */
  async getNextCodePreview(educcionId: string): Promise<string> {
    if (!educcionId || typeof educcionId !== 'string') {
      throw new Error('Invalid educcion ID');
    }

    try {
      // Solo consulta el contador sin incrementarlo
      const counter = await prisma.counter.findUnique({
        where: {
          entity_contextId: {
            entity: "ILACION",
            contextId: educcionId
          }
        }
      });

      const nextCount = (counter?.counter || 0) + 1;
      return `ILA-${nextCount.toString().padStart(3, '0')}`;
    } catch (error) {
      console.error("Error getting counter preview:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to get counter preview: ${error.message}`);
      }
      throw new Error('Failed to get counter preview due to an unknown error');
    }
  }

  /**
   * Gets next code for a new ilacion
   */
  async getNextCode(educcionId: string): Promise<string> {
    const counter = await this.getNextCounter(educcionId);
    return `ILA-${counter.toString().padStart(3, '0')}`;
  }

  /**
   * Generates a unique code for an ilacion within an educcion
   */
  async generateCode(educcionId: string): Promise<string> {
    return this.getNextCode(educcionId);
  }

  /**
   * Increments and returns the counter for generating unique codes
   */
  async getNextCounter(educcionId: string): Promise<number> {
    if (!educcionId || typeof educcionId !== 'string') {
      throw new Error('Invalid educcion ID');
    }

    try {
      const counterRecord = await prisma.counter.upsert({
        where: {
          entity_contextId: {
            entity: "ILACION",
            contextId: educcionId
          }
        },
        update: {
          counter: {
            increment: 1,
          },
        },
        create: {
          entity: "ILACION",
          contextId: educcionId,
          counter: 1,
        },
      });

      return counterRecord.counter;
    } catch (error) {
      console.error("Error generating counter:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to generate counter: ${error.message}`);
      }
      throw new Error('Failed to generate counter due to an unknown error');
    }
  }

  /**
   * Increments the version of an ilacion
   */
  private incrementVersion(currentVersion: string): string {
    const [major, minor] = currentVersion.split('.');
    const newMinor = (parseInt(minor) + 1).toString().padStart(2, '0');
    return `${major}.${newMinor}`;
  }
}

export const ilacionRepository = new IlacionRepository();