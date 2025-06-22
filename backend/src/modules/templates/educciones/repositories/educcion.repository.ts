import { prisma } from '../../../../shared/database/prisma';
import { EduccionDTO } from '../models/educcion.model';

export class EduccionRepository {
  /**
   * Creates a new educcion in the database
   */
  async create(projectId: string, data: EduccionDTO) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const code = await this.generateCode(projectId);

    return prisma.educcion.create({
      data: {
        name: data.name,
        description: data.description || '',
        status: data.status || 'Pending',
        importance: data.importance || 'Medium',
        comment: data.comment,
        code: code,
        version: '01.00',
        projectId: projectId,
        creationDate: new Date(),
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
 * Updates an existing educcion
 */
  async update(code: string, data: Partial<EduccionDTO>, newVersion?: string) {
    // Primero obtener la educción actual completa
    const currentEduccion = await prisma.educcion.findFirst({
      where: { code },
    });

    if (!currentEduccion) {
      throw new Error(`Educcion with code ${code} not found`);
    }

    // Calcular la nueva versión
    const version = newVersion || this.incrementVersion(currentEduccion.version);

    return prisma.educcion.update({
      where: {
        id: currentEduccion.id // Usar ID en lugar de code
      },
      data: {
        ...data,
        version,
        modificationDate: new Date(),
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
   * Finds an educcion by its code and projectId
   */
  async findByCodeAndProject(code: string, projectId: string) {
    return prisma.educcion.findFirst({
      where: {
        code,
        projectId
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
   * Deletes an educcion by its ID
   */
  async delete(id: string) {
    return prisma.educcion.delete({
      where: { id },
    });
  }

  /**
   * Gets all educciones from a project with pagination
   */
  async findAllByProject(projectId: string, skip: number = 0, take: number = 20) {
    return prisma.educcion.findMany({
      where: {
        projectId,
      },
      skip,
      take,
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
   * Finds an educcion by its ID
   */
  async findById(id: string) {
    return prisma.educcion.findUnique({
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

  /**
   * Finds an educcion by its code
   */
  async findByCode(code: string) {
    return prisma.educcion.findFirst({
      where: { code },
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
   * Searches educciones by name
   */
  async searchByName(projectId: string, name: string) {
    return prisma.educcion.findMany({
      where: {
        projectId,
        name: {
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
   * Gets an educcion with its ilaciones
   */
  async getEduccionWithIlaciones(code: string) {
    return prisma.educcion.findFirst({
      where: { code },
      include: {
        ilaciones: true,
        project: {
          select: {
            code: true,
          },
        },
      },
    });
  }

  /**
   * Gets the next code preview without incrementing the counter
   */
  async getNextCodePreview(projectId: string): Promise<string> {
    // Validación del ID del proyecto
    if (!projectId || typeof projectId !== 'string') {
      throw new Error('Invalid project ID');
    }

    try {
      // Solo consulta el contador sin incrementarlo
      const counter = await prisma.counter.findUnique({
        where: {
          entity_contextId: {
            entity: "EDUCCION",
            contextId: projectId
          }
        }
      });

      const nextCount = (counter?.counter || 0) + 1;
      return `EDU-${nextCount.toString().padStart(3, '0')}`;
    } catch (error) {
      console.error("Error getting counter preview:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to get counter preview: ${error.message}`);
      }
      throw new Error('Failed to get counter preview due to an unknown error');
    }
  }

  /**
   * Gets next code for a new educcion and increments the counter
   * (Modificar el método existente para que sea claro que incrementa)
   */
  async getNextCode(projectId: string): Promise<string> {
    const counter = await this.getNextCounter(projectId);
    return `EDU-${counter.toString().padStart(3, '0')}`;
  }

  /**
   * Generates a unique code for an educcion within a project
   * (Modificar para utilizar getNextCode y evitar duplicación)
   */
  async generateCode(projectId: string): Promise<string> {
    return this.getNextCode(projectId);
  }

  /**
   * Increments and returns the counter for generating unique codes
   */
  async getNextCounter(projectId: string): Promise<number> {
    // Validación adicional
    if (!projectId || typeof projectId !== 'string') {
      throw new Error('Invalid project ID');
    }

    console.log(`Generating counter for project ID: ${projectId}`);

    try {
      // Actualizar para usar la restricción única compuesta correctamente
      const counterRecord = await prisma.counter.upsert({
        where: {
          entity_contextId: {
            entity: "EDUCCION",
            contextId: projectId
          }
        },
        update: {
          counter: {
            increment: 1,
          },
        },
        create: {
          entity: "EDUCCION",
          contextId: projectId,
          counter: 1,
        },
      });

      console.log(`Generated counter: ${counterRecord.counter} for project: ${projectId}`);
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
   * Increments the version of an educcion
   */
  private incrementVersion(currentVersion: string): string {
    const [major, minor] = currentVersion.split('.');
    const newMinor = (parseInt(minor) + 1).toString().padStart(2, '0');
    return `${major}.${newMinor}`;
  }

  /**
   * Gets an educcion with its ilaciones, filtered by project
   */
  async getEduccionWithIlacionesByProject(code: string, projectId: string) {
    return prisma.educcion.findFirst({
      where: {
        code,
        projectId
      },
      include: {
        ilaciones: true,
        project: {
          select: {
            code: true,
          },
        },
      },
    });
  }
}

// Export singleton instance of the repository
export const educcionRepository = new EduccionRepository();