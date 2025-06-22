import { EvidenceCreateInput, EvidenceDTO } from '../models/evidence.model';
import { evidenceRepository } from '../repositories/evidence.repository';
import { Request } from 'express';

export const uploadEvidenceFile = async (req: Request) => {
  // File upload handled by multer in the route
  // Additional logic can be added here if needed
};

// Assuming you want to use the repository's create method directly
export const createEvidenceService = async (data: EvidenceCreateInput, file?: Express.Multer.File) => {
  // You may need to pass an interviewId here if required by your repository
  // For now, assuming interviewId is part of data
  return evidenceRepository.create(data.interviewId, data, file);
};

export class EvidenceService {
  private repository = evidenceRepository;

  async createEvidence(interviewId: string, data: EvidenceDTO, file?: Express.Multer.File) {
    return this.repository.create(interviewId, data, file);
  }

  async getEvidencesByInterview(interviewId: string) {
    return this.repository.findAllByInterview(interviewId);
  }

  async getEvidenceByCode(code: string, interviewId: string) {
    return this.repository.findByCodeAndInterview(code, interviewId);
  }

  async updateEvidence(code: string, interviewId: string, data: EvidenceDTO, file?: Express.Multer.File) {
    return this.repository.updateByCodeAndInterview(code, interviewId, data, file);
  }

  async deleteEvidence(code: string, interviewId: string) {
    return this.repository.deleteByCodeAndInterview(code, interviewId);
  }

  async searchEvidencesByName(interviewId: string, name: string) {
    return this.repository.searchByName(interviewId, name);
  }

  async getNextCode(interviewId: string): Promise<string> {
    return this.repository.getNextCode(interviewId);
  }

  async getEvidenceFilePath(code: string, interviewId: string) {
    return this.repository.getFilePathByCodeAndInterview(code, interviewId);
  }

  async getEvidencesByProject(projectId: string) {
  return this.repository.findAllByProject(projectId);
}
async searchEvidencesByNameInProject(projectId: string, name: string) {
  return this.repository.searchByNameInProject(projectId, name);
}

}

export const evidenceService = new EvidenceService();
