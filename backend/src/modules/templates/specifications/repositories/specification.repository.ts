import { prisma } from '../../../../shared/database/prisma';
import { SpecificationDTO } from '../models/specification.model';

export class SpecificationRepository {
  /**
   * Creates a new specification in the database
   */
  async create(ilacionId: string, data: SpecificationDTO) {
    const ilacion = await prisma.ilacion.findUnique({
      where: { id: ilacionId },
    });

    if (!ilacion) {
      throw new Error('Ilacion not found');
    }

    const code = await this.generateCode(ilacionId);

    return prisma.specification.create({
      data: {
        name: data.name,
        status: data.status || 'Pending',
        importance: data.importance || 'Medium',
        precondition: data.precondition || '',
        procedure: data.procedure || '',
        postcondition: data.postcondition || '',
        comment: data.comment,
        code: code,
        version: '01.00',
        ilacionId: ilacionId,
      },
      include: {
        ilacion: {
          select: {
            code: true,
            educcion: {
              select: {
                code: true,
                project: {
                  select: {
                    code: true,
                    organization: {
                      select: {
                        code: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  /**
   * Finds a specification by its code and ilacionId
   */
  async findByCodeAndIlacion(code: string, ilacionId: string) {
    return prisma.specification.findFirst({
      where: {
        code,
        ilacionId
      },
      include: {
        ilacion: {
          select: {
            code: true,
            educcion: {
              select: {
                code: true,
                project: {
                  select: {
                    code: true,
                    organization: {
                      select: {
                        code: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  /**
   * Gets all specifications from an ilacion with pagination
   */
  async findAllByIlacion(ilacionId: string, skip: number = 0, take: number = 20) {
    return prisma.specification.findMany({
      where: {
        ilacionId,
      },
      skip,
      take,
      orderBy: {
        creationDate: 'desc',
      },
      include: {
        ilacion: {
          select: {
            code: true,
            educcion: {
              select: {
                code: true,
                project: {
                  select: {
                    code: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  /**
   * Updates an existing specification
   */
  async update(id: string, data: Partial<SpecificationDTO>, newVersion?: string) {
    return prisma.specification.update({
      where: { id },
      data: {
        name: data.name !== undefined ? data.name : undefined,
        status: data.status !== undefined ? data.status : undefined,
        importance: data.importance !== undefined ? data.importance : undefined,
        precondition: data.precondition !== undefined ? data.precondition : undefined,
        procedure: data.procedure !== undefined ? data.procedure : undefined,
        postcondition: data.postcondition !== undefined ? data.postcondition : undefined,
        comment: data.comment !== undefined ? data.comment : undefined,
        version: newVersion,
        modificationDate: new Date(),
      },
      include: {
        ilacion: {
          select: {
            code: true,
            educcion: {
              select: {
                code: true,
                project: {
                  select: {
                    code: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  /**
   * Deletes a specification by its ID
   */
  async delete(id: string) {
    return prisma.specification.delete({
      where: { id },
    });
  }

  /**
   * Gets the next code preview without incrementing the counter
   */
  async getNextCodePreview(ilacionId: string): Promise<string> {
    // Validation
    if (!ilacionId || typeof ilacionId !== 'string') {
      throw new Error('Invalid ilacion ID');
    }

    try {
      // Solo consulta el contador sin incrementarlo
      const counter = await prisma.counter.findUnique({
        where: {
          entity_contextId: {
            entity: "SPECIFICATION",
            contextId: ilacionId
          }
        }
      });

      const nextCount = (counter?.counter || 0) + 1;
      return `ESP-${nextCount.toString().padStart(3, '0')}`;
    } catch (error) {
      console.error("Error getting counter preview:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to get counter preview: ${error.message}`);
      }
      throw new Error('Failed to get counter preview due to an unknown error');
    }
  }

  /**
   * Gets next code for a new specification
   */
  async getNextCode(ilacionId: string): Promise<string> {
    const counter = await this.getNextCounter(ilacionId);
    return `ESP-${counter.toString().padStart(3, '0')}`;
  }

  /**
   * Generates a unique code for a specification within an ilacion
   */
  async generateCode(ilacionId: string): Promise<string> {
    return this.getNextCode(ilacionId);
  }


  /**
   * Increments and returns the counter for generating unique codes
   */
  async getNextCounter(ilacionId: string): Promise<number> {
    // Validation
    if (!ilacionId || typeof ilacionId !== 'string') {
      throw new Error('Invalid ilacion ID');
    }

    try {
      const counterRecord = await prisma.counter.upsert({
        where: {
          entity_contextId: {
            entity: "SPECIFICATION",
            contextId: ilacionId
          }
        },
        update: {
          counter: {
            increment: 1,
          },
        },
        create: {
          entity: "SPECIFICATION",
          contextId: ilacionId,
          counter: 1,
        },
      });

      return counterRecord.counter;
    } catch (error) {
      console.error('Error generating counter:', error);
      throw new Error('Failed to generate counter for specification');
    }
  }

  /**
   * Increments the version of a specification
   */
  private incrementVersion(currentVersion: string): string {
    const [major, minor] = currentVersion.split('.');
    const newMinor = (parseInt(minor) + 1).toString().padStart(2, '0');
    return `${major}.${newMinor}`;
  }

  /**
   * Searches specifications by name within an ilacion
   */
  async searchByName(ilacionId: string, name: string) {
    return prisma.specification.findMany({
      where: {
        ilacionId,
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: {
        creationDate: 'desc',
      },
      include: {
        ilacion: {
          select: {
            code: true,
            educcion: {
              select: {
                code: true,
                project: {
                  select: {
                    code: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }
}

export const specificationRepository = new SpecificationRepository();