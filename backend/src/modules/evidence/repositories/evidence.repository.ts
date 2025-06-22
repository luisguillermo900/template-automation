import { prisma } from '../../../shared/database/prisma';

import { Evidence, EvidenceCreateInput, EvidenceDTO } from '../models/evidence.model';

export class EvidenceRepository {
  async create(interviewId: string, data: EvidenceDTO, file?: Express.Multer.File): Promise<Evidence> {
    const filePath = file ? `/uploads/evidence/${file.filename}` : data.file;
    // Solo autogenerar el código si NO viene en data.code
    let code = data.code;
    if (!code || code.trim() === '') {
      // Generar un código único, reintentando hasta 20 veces si hay colisión
      let unique = false;
      let attempts = 0;
      while (!unique && attempts < 20) {
        code = await this.getNextCode(interviewId);
        const exists = await prisma.evidence.findFirst({ where: { code, interviewId } });
        if (!exists) unique = true;
        else attempts++;
      }
      if (!unique) {
        throw new Error('No se pudo generar un código único para la evidencia después de varios intentos.');
      }
    } else {
      // Si el código viene en data, verificar que no exista para la misma entrevista
      const exists = await prisma.evidence.findFirst({ where: { code, interviewId } });
      if (exists) {
        throw new Error('El código de evidencia ya existe en esta entrevista. Debe ser único por entrevista.');
      }
    }
    // type: si hay archivo, siempre usar el mimetype real del archivo
    let type = file && file.mimetype ? file.mimetype : data.type;
    if (!type || typeof type !== 'string' || !type.trim()) {
      throw new Error('El campo type es obligatorio y debe ser un tipo MIME válido.');
    }
    // Elimina cualquier campo extra de data
    const { name } = data;
    // Log para depuración: muestra el code y el interviewId antes de crear la evidencia
    console.log('Intentando crear evidencia con code:', code, 'y interviewId:', interviewId);
    try {
      return await prisma.evidence.create({
        data: {
          name,
          code,
          type,
          interviewId,
          file: filePath,
          evidenceDate: new Date(),
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Ya existe una evidencia con ese código en esta entrevista.');
      }
      throw error;
    }
  }

  async findAllByInterview(interviewId: string): Promise<Evidence[]> {
    return prisma.evidence.findMany({ where: { interviewId } });
  }

  async findByCodeAndInterview(code: string, interviewId: string): Promise<Evidence | null> {
    // Asegura que el código y el interviewId sean strings y no undefined/null
    if (!code || !interviewId) return null;
    return prisma.evidence.findFirst({ where: { code: String(code), interviewId: String(interviewId) } });
  }

  async updateByCodeAndInterview(code: string, interviewId: string, data: EvidenceDTO, file?: Express.Multer.File): Promise<Evidence | null> {
    const filePath = file ? `/uploads/evidence/${file.filename}` : data.file;
    // Solo tomar los campos válidos y limpiar cualquier campo extra
    const { name } = data;
    // type: si hay archivo, siempre usar el mimetype real del archivo
    let type = file && file.mimetype ? file.mimetype : data.type;
    if (!type || typeof type !== 'string' || !type.trim()) {
      throw new Error('El campo type es obligatorio y debe ser un tipo MIME válido.');
    }
    await prisma.evidence.updateMany({
      where: { code, interviewId },
      data: {
        name,
        type,
        file: filePath,
        evidenceDate: new Date(),
      },
    });
    return this.findByCodeAndInterview(code, interviewId);
  }

  async deleteByCodeAndInterview(code: string, interviewId: string): Promise<number> {
    return prisma.evidence.deleteMany({ where: { code, interviewId } }).then(res => res.count);
  }

  async searchByName(interviewId: string, name: string): Promise<Evidence[]> {
    return prisma.evidence.findMany({
      where: {
        interviewId,
        name: { 
            contains: name, 
            mode: 'insensitive' },
      },
      include: {
        interview: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  async getNextCode(interviewId: string): Promise<string> {
    // Busca el último código numérico y suma 1, pero solo muestra el siguiente sin guardar ni incrementar ningún contador
    const last = await prisma.evidence.findMany({
      where: { interviewId },
      orderBy: { code: 'desc' },
      take: 1,
    });
    let next = 1;
    if (last.length && /^EVI-(\d+)$/.test(last[0].code)) {
      next = parseInt(last[0].code.split('-')[1]) + 1;
    }
    // Solo retorna el siguiente código sugerido, no guarda nada
    return `EVI-${next.toString().padStart(4, '0')}`;
  }

  async getFilePathByCodeAndInterview(code: string, interviewId: string): Promise<string | null> {
    const evidence = await this.findByCodeAndInterview(code, interviewId);
    return evidence ? evidence.file : null;
  }

  async findAllByProject(projectId: string) {
  return prisma.evidence.findMany({
    where: {
      interview: {
        projectId: projectId,
      },
    },
    include: {
      interview: true,
    },
    orderBy: {
      evidenceDate: 'desc',
    },
  });
}
async searchByNameInProject(projectId: string, name: string) {
  return prisma.evidence.findMany({
    where: {
      name: {
        contains: name,
        mode: 'insensitive',
      },
      interview: {
        projectId: projectId,
      },
    },
    include: {
      interview: true,
    },
    orderBy: {
      evidenceDate: 'desc',
    },
  });
}

}

export const evidenceRepository = new EvidenceRepository();
