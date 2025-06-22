// filepath: d:\PIS2_2025A\template-automation-system\backend\src\modules\interviews\repositories\interview.repository.ts
import { prisma } from '../../../shared/database/prisma';
import { InterviewDTO } from '../models/interview.model';

export class InterviewRepository {
  /**
   * Creates a new interview in the database
   */
  async create(projectId: string, data: InterviewDTO) {

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    if (!data.authorId) {
      throw new Error('El campo authorCode es obligatorio para crear una entrevista');
    }

    const author = await prisma.author.findUnique({
      where: { id: data.authorId },
    });
    if (!author) {
      throw new Error('Author not found');
    }

  const interviewDateStr = typeof data.interviewDate === 'string'
    ? data.interviewDate
    : data.interviewDate.toISOString().slice(0, 10);

  const startTimeStr = typeof data.startTime === 'string'
    ? data.startTime
    : data.startTime.toTimeString().slice(0, 8);

  const endTimeStr = typeof data.endTime === 'string'
    ? data.endTime
    : data.endTime?.toTimeString().slice(0, 8) ?? '';

      // Parsear la fecha en componentes numéricos (año, mes, día)
  const [year, month, day] = interviewDateStr.split('-').map(Number);

  // Parsear la hora de inicio en componentes numéricos (hora, minuto, segundo)
  const [startH, startM, startS] = startTimeStr.split(':').map(Number);
  // Crear el objeto Date para startTime usando Date.UTC
  // Nota: El mes en Date.UTC es 0-indexado (0 para enero, 11 para diciembre)
  const startTimeObj = new Date(Date.UTC(year, month - 1, day, startH, startM, startS ?? 0));

  // Parsear la hora de fin en componentes numéricos (hora, minuto, segundo)
  const [endH, endM, endS] = endTimeStr.split(':').map(Number);
  // Crear el objeto Date para endTime usando Date.UTC
  const endTimeObj = new Date(Date.UTC(year, month - 1, day, endH, endM, endS ?? 0));

  const interviewData: any = {
    interviewName: data.interviewName,
    version: '01.00',
    interviewDate: new Date(`${data.interviewDate}T00:00:00Z`),
    authorId: author.id, // Assuming authorId is passed in data
    intervieweeName: data.intervieweeName,
    intervieweeRole: data.intervieweeRole,
    observations: data.observations,
    projectId: projectId,
    agendaItems: {
      create: data.agendaItems || [],
    },
    conclusions: {
      create: data.conclusions || [],
    },
};

if (!isNaN(startTimeObj.getTime())) {
  interviewData.startTime = startTimeObj;
}
if (!isNaN(endTimeObj.getTime())) {
  interviewData.endTime = endTimeObj;
}

const created = await prisma.interview.create({
  data: interviewData,
  include: {
    agendaItems: true,
    conclusions: true,
    project: {
      select: {
        code: true,
      },
    },
    author: { 
      select: { code: true }
    }
  },
});
// Retornar el objeto con authorCode plano
  return {
    ...created,
    authorCode: created.author.code,
  };
}

  /**
   * Finds all interviews by project ID
   */
  async findAllByProject(projectId: string, skip: number = 0, take = 20) {
    return prisma.interview.findMany({
      where: { 
        projectId 
      },
      skip,
      take,
      include: {
        author: true,
        project: {
          select: {
            code: true,
          },
        },
        agendaItems: true,
        conclusions: true,
        evidences: true,
      },
    });
  }

  async findAllByProjectExport(projectId: string, skip: number = 0, take = 20){
    return prisma.interview.findMany({
      where: { 
        projectId 
      },
      skip,
      take,
      include: {
        author: true,
        project: {
          select: {
            code: true,
          },
        },
        agendaItems: true,
        conclusions: true,
        evidences: true,
      },
    });
  }

  /**
   * Finds an interview by its ID
   */
  async findById(id: string) {
    return prisma.interview.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            code: true,
          },
        },
        project: {
          select: {
            code: true,
          },
        },
        agendaItems: true,
        conclusions: true,
        evidences: true,
      },
    });
  }

  /**
   * Updates an existing interview
   */
  async update(id: string, data: Partial<InterviewDTO>, newVersion?: string) {
  // Obtener la entrevista actual
  const currentInterview = await prisma.interview.findUnique({
    where: { id },
  });
  if (!currentInterview) {
    throw new Error(`Interview with code ${id} not found`);
  }

  // Calcular la nueva versión
  const version = newVersion || this.incrementVersion(currentInterview.version);

  // Usar la fecha actual si no viene en el update
  const interviewDateStr = data.interviewDate
    ? typeof data.interviewDate === 'string'
      ? data.interviewDate
      : data.interviewDate.toISOString().slice(0, 10)
    : currentInterview.interviewDate.toISOString().slice(0, 10);

  // Solo crear Date si hay hora válida
  let startTime: Date | undefined = undefined;
  if (data.startTime) {
    const start = `${interviewDateStr}T${data.startTime}:00Z`;
    const d = new Date(start);
    if (!isNaN(d.getTime())) startTime = d;
  }

  let endTime: Date | undefined = undefined;
  if (data.endTime) {
    const end = `${interviewDateStr}T${data.endTime}:00Z`;
    const d = new Date(end);
    if (!isNaN(d.getTime())) endTime = d;
  }

  // Solo crear Date si hay fecha válida
  let interviewDate: Date | undefined = undefined;
  if (data.interviewDate) {
    const d = new Date(`${interviewDateStr}T00:00:00Z`);
    if (!isNaN(d.getTime())) interviewDate = d;
  }

  // Create a new data object excluding the original startTime and endTime strings
  const updateData: any = { ...data };
  delete updateData.startTime;
  delete updateData.endTime;
  delete updateData.authorCode;

  return prisma.interview.update({
    where: { id },
    data: {
      ...updateData, // Use the new data object without original time strings
      ...(interviewDate && { interviewDate }),
      ...(startTime && { startTime }), // Include the constructed Date object
      ...(endTime && { endTime }),     // Include the constructed Date object
      version,
      // Eliminar todos los agendaItems existentes y crear los nuevos
      agendaItems: {
        deleteMany: {}, // Elimina todos los agendaItems relacionados con esta entrevista
        create: updateData.agendaItems // Crea los nuevos agendaItems a partir del array
      },
      // Eliminar todas las conclusions existentes y crear las nuevas
      conclusions: {
        deleteMany: {}, // Elimina todas las conclusions relacionadas con esta entrevista
        create: updateData.conclusions // Crea las nuevas conclusions a partir del array
      }
    },
    include: {
      author: { select: { code: true } },
      project: { select: { code: true } },
      agendaItems: true,
      conclusions: true,
      evidences: true,
    },
  });
}

  /**
   * Finds an interview by its code and projectId
   */
  async findByCodeAndProject(id: string, projectId: string) {
    return prisma.interview.findFirst({
      where: {
        id,
        projectId
      },
      include: {
        author: {
          select: {
            code: true,
          },
        },
        project: {
          select: {
            code: true,
          },
        },
        agendaItems: true,
        conclusions: true,
        evidences: true,
      },
    });
  }

  /**
   * Deletes an interview by its ID
   */
  async delete(id: string) {
    return prisma.interview.delete({
      where: { id },
    });
  }

  /**
   * Increments the version of an interview
   */
  private incrementVersion(currentVersion: string): string {
    const [major, minor] = currentVersion.split('.');
    const newMinor = (parseInt(minor) + 1).toString().padStart(2, '0');
    return `${major}.${newMinor}`;
  }
  /**
   * Searches for interviews by name
   */
  async searchByName(projectId: string, name: string) {
  return prisma.interview.findMany({
    where: {
      projectId,
      interviewName: {
        contains: name,
        mode: 'insensitive',
      },
    },
    orderBy: { interviewDate: 'desc' },
  });
}

async addAgendaItem(interviewId: string, description: string) {
    return prisma.agendaItem.create({
      data: {
        interviewId,
        description,
      },
    });
  }

  async removeAgendaItem(id: string) {
    return prisma.agendaItem.delete({
      where: { id },
    });
  }

  async addConclusion(interviewId: string, description: string) {
    return prisma.conclusion.create({
      data: {
        interviewId,
        description,
      },
    });
  }

  async removeConclusion(id: string) {
    return prisma.conclusion.delete({
      where: { id },
    });
  }

/*async findByProject(projectId: string) {
  return prisma.interview.findMany({
    where: { projectId },
    orderBy: { interviewDate: 'desc' },
  });
}*/

}

// Export singleton instance of the repository
export const interviewRepository = new InterviewRepository();