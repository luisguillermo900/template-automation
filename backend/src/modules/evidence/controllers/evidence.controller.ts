import { Request, Response } from 'express';
import { EvidenceDTO } from '../models/evidence.model';
import { ProjectService } from '../../projects/services/project.service';
import { InterviewService } from '../../interviews/services/interview.service';
import { evidenceService } from '../services/evidence.service';

const projectService = new ProjectService();
const interviewService = new InterviewService();

export class EvidenceController {
  /**
   * Crea una nueva evidencia para una entrevista
   */
  async createEvidence(req: Request, res: Response) {
    try {
      const { orgcod, projcod, interviewid } = req.params;
      const evidenceDto: EvidenceDTO = req.body;
      const file = req.file;

      // Verificar que el proyecto pertenece a la organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }
      // Verificar que la entrevista pertenece al proyecto
      const interview = await interviewService.getInterviewById(interviewid, project.id);
      if (!interview) {
        return res.status(404).json({ error: 'Interview not found in this project.' });
      }
      if (!evidenceDto.name || evidenceDto.name.trim() === '') {
        return res.status(400).json({ error: 'Name is required.' });
      }
      const newEvidence = await evidenceService.createEvidence(interview.id, evidenceDto, file);
      res.status(201).json({
        message: 'Evidence created successfully.',
        evidence: newEvidence,
      });
    } catch (error) {
      const err = error as Error;
      if (err.message.includes('Ya existe una evidencia con ese código en esta entrevista') || err.message.includes('El código de evidencia ya existe en esta entrevista')) {
        return res.status(409).json({ error: err.message });
      }
      return res.status(500).json({ error: `Error creating evidence: ${err.message}` });
    }
  }

  /**
   * Obtiene todas las evidencias de una entrevista
   */
  async getEvidencesByInterview(req: Request, res: Response) {
    try {
      const { orgcod, projcod, interviewid } = req.params;
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }
      const interview = await interviewService.getInterviewById(interviewid, project.id);
      if (!interview) {
        return res.status(404).json({ error: 'Interview not found in this project.' });
      }
      const evidences = await evidenceService.getEvidencesByInterview(interview.id);
      res.status(200).json(evidences);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: `Error fetching evidences: ${err.message}` });
    }
  }

  /**
   * Obtiene una evidencia por su código
   */
  async getEvidenceByCode(req: Request, res: Response) {
    try {
      const { orgcod, projcod, interviewid, code } = req.params;
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }
      const interview = await interviewService.getInterviewById(interviewid, project.id);
      if (!interview) {
        return res.status(404).json({ error: 'Interview not found in this project.' });
      }
      const evidence = await evidenceService.getEvidenceByCode(code, interview.id);
      if (!evidence) {
        return res.status(404).json({ error: 'Evidence not found.' });
      }
      res.status(200).json(evidence);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: `Error fetching evidence: ${err.message}` });
    }
  }

  /**
   * Actualiza una evidencia por código
   */
  async updateEvidence(req: Request, res: Response) {
    try {
      const { orgcod, projcod, interviewid, code } = req.params;
      const evidenceDto: EvidenceDTO = req.body;
      const file = req.file;
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }
      const interview = await interviewService.getInterviewById(interviewid, project.id);
      if (!interview) {
        return res.status(404).json({ error: 'Interview not found in this project.' });
      }
      const updated = await evidenceService.updateEvidence(code, interview.id, evidenceDto, file);
      res.status(200).json({ message: 'Evidence updated successfully.', evidence: updated });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: `Error updating evidence: ${err.message}` });
    }
  }

  /**
   * Elimina una evidencia por código
   */
  async deleteEvidence(req: Request, res: Response) {
    try {
      const { orgcod, projcod, interviewid, code } = req.params;
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }
      const interview = await interviewService.getInterviewById(interviewid, project.id);
      if (!interview) {
        return res.status(404).json({ error: 'Interview not found in this project.' });
      }
      await evidenceService.deleteEvidence(code, interview.id);
      res.status(200).json({ message: 'Evidence deleted successfully.' });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: `Error deleting evidence: ${err.message}` });
    }
  }

  /**
   * Busca evidencias por nombre
   */
  async searchEvidencesByName(req: Request, res: Response) {
    try {
      const { orgcod, projcod, interviewid } = req.params;
      const { name } = req.query;
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }
      const interview = await interviewService.getInterviewById(interviewid, project.id);
      if (!interview) {
        return res.status(404).json({ error: 'Interview not found in this project.' });
      }
      const evidences = await evidenceService.searchEvidencesByName(interview.id, name as string);
      res.status(200).json(evidences);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: `Error searching evidences: ${err.message}` });
    }
  }

  /**
   * Obtiene el siguiente código sugerido para una evidencia
   */
  async getNextCode(req: Request, res: Response) {
    try {
      const { orgcod, projcod, interviewid } = req.params;
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }
      const interview = await interviewService.getInterviewById(interviewid, project.id);
      if (!interview) {
        return res.status(404).json({ error: 'Interview not found in this project.' });
      }
      const nextCode = await evidenceService.getNextCode(interview.id);
      res.status(200).json({ nextCode });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: `Error getting next code: ${err.message}` });
    }
  }

  /**
   * Devuelve la ruta del archivo de la evidencia (preview)
   */
  async getEvidenceFilePath(req: Request, res: Response) {
    try {
      const { orgcod, projcod, interviewid, code } = req.params;
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }
      const interview = await interviewService.getInterviewById(interviewid, project.id);
      if (!interview) {
        return res.status(404).json({ error: 'Interview not found in this project.' });
      }
      const filePath = await evidenceService.getEvidenceFilePath(code, interview.id);
      if (!filePath) {
        return res.status(404).json({ error: 'Evidence file not found.' });
      }
      res.status(200).json({ filePath });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: `Error getting evidence file: ${err.message}` });
    }
  }

  async getEvidencesByProject(req: Request, res: Response) {
  try {
    const { orgcod, projcod } = req.params;
    // Verifica que el proyecto pertenece a la organización
    const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
    if (!project) {
      return res.status(404).json({ error: 'Project not found in this organization.' });
    }
    const evidences = await evidenceService.getEvidencesByProject(project.id);
    res.status(200).json(evidences);
  } catch (error) {
    console.error('Error fetching evidences by project:', error);
    res.status(500).json({ error: 'Error fetching evidences by project.' });
  }
}
async searchEvidencesByNameInProject(req: Request, res: Response) {
  try {
    const { orgcod, projcod } = req.params;
    const { name } = req.query;
    if (!name || (name as string).trim() === '') {
      return res.status(400).json({ error: 'Name parameter is required for search.' });
    }
    const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
    if (!project) {
      return res.status(404).json({ error: 'Project not found in this organization.' });
    }
    const evidences = await evidenceService.searchEvidencesByNameInProject(project.id, name as string);
    res.status(200).json(evidences);
  } catch (error) {
    const err = error as Error;
    console.error('Error searching evidences by name in project:', err.message);
    res.status(500).json({ error: 'Error searching evidences by name in project.' });
  }
}

}

export const evidenceController = new EvidenceController();
