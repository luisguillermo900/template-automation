import { expertRepository } from "../repositories/expert.repository";
import { ExpertDTO, ExpertResponse } from "../models/expert.model";

export class ExpertService {
  private repo = expertRepository;

  async createExpert(projectId: string, data: ExpertDTO): Promise<ExpertResponse> {
    return this.repo.create(projectId, data);
  }

  async getExpertsByProject(projectId: string, page: number = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return this.repo.findAllByProject(projectId, skip, limit);
  }

  async getExpertByCode(code: string, projectId?: string) {
    if (projectId) {
      return this.repo.findByCodeAndProject(code, projectId);
    } else {
      return this.repo.findByCode(code);
    }
  }

  async updateExpert(code: string, projectId: string,data: ExpertDTO) {
    const existingExp = await this.repo.findByCodeAndProject(code, projectId);    if (!existingExp) throw new Error('Expert not found');
    const newVersion = this.incrementVersion(existingExp.version);
    return this.repo.update(code, projectId, data, newVersion);
  }

  async deleteExpert(code: string, projectId: string) {
    const expert = await this.repo.findByCodeAndProject(code, projectId);
    if (!expert) throw new Error('Expert not found');
    return this.repo.delete(expert.id);
  }

  async searchExpertsByName(projectId: string, name: string) {
    return this.repo.searchByName(projectId, name);
  }

  /**
   * Busca expertos por año y mes
   */
  async searchExpertsByDate(projectId: string, year?: string, month?: string) {
    return this.repo.searchByDate(projectId, year, month);
  }

  async getNextCode(projectId: string): Promise<string> {
    return this.repo.getNextCode(projectId);
  }

   /**
   * Gets the next code preview without incrementing the counter
   */
  async getNextCodePreview(projectId: string): Promise<string>{
    return this.repo.getNextCodePreview(projectId);
  }

  private incrementVersion(currentVersion: string): string {
    const [major, minor] = currentVersion.split('.').map(Number);
    return `${major.toString().padStart(2, '0')}.${(minor + 1).toString().padStart(2, '0')}`;
  }
}

export const expertService = new ExpertService();