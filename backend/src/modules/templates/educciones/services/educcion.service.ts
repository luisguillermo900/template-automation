import { educcionRepository } from "../repositories/educcion.repository";
import { EduccionDTO, EduccionResponse } from "../models/educcion.model";

export class EduccionService {
  private repository = educcionRepository;

  /**
   * Creates a new educcion
   */
  async createEduccion(projectId: string, data: EduccionDTO): Promise<EduccionResponse> {
    return this.repository.create(projectId, data);
  }

  /**
   * Gets all educciones from a project with pagination
   */
  async getEduccionesByProject(projectId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.repository.findAllByProject(projectId, skip, limit);
  }

  /**
   * Gets an educcion by its code, considering the project context
   */
  async getEduccionByCode(code: string, projectId?: string) {
    if (projectId) {
      return this.repository.findByCodeAndProject(code, projectId);
    } else {
      return this.repository.findByCode(code);
    }
  }

  /**
   * Updates an existing educcion
   */
  async updateEduccion(code: string, data: EduccionDTO) {
    // Verify educcion exists
    const existingEdu = await this.repository.findByCode(code);
    if (!existingEdu) {
      throw new Error("Educcion not found");
    }

    // Increment version
    const newVersion = this.incrementVersion(existingEdu.version);

    // Pass version as separate parameter
    return this.repository.update(code, data, newVersion);
  }

  /**
   * Deletes an educcion
   */
  async deleteEduccion(code: string, projectId: string) {
    const educcion = await this.repository.findByCodeAndProject(code, projectId);

    if (!educcion) {
      throw new Error('Educcion not found');
    }

    return this.repository.delete(educcion.id);
  }

  /**
   * Searches educciones by name
   */
  async searchEduccionesByName(projectId: string, name: string) {
    return this.repository.searchByName(projectId, name);
  }

  /**
   * Gets an educcion with its ilaciones
   */
  async getEduccionWithIlaciones(code: string, projectId?: string) {
    if (projectId) {
      return this.repository.getEduccionWithIlacionesByProject(code, projectId);
    } else {
      return this.repository.getEduccionWithIlaciones(code);
    }
  }

  /**
   * Gets the next unique code for an educcion
   */
  async getNextCode(projectId: string): Promise<string> {
    return this.repository.getNextCode(projectId);
  }

  /**
   * Increments version following XX.YY pattern
   */
  private incrementVersion(currentVersion: string): string {
    const [major, minor] = currentVersion.split('.').map(Number);
    return `${major.toString().padStart(2, '0')}.${(minor + 1).toString().padStart(2, '0')}`;
  }

  /**
   * Gets the next code preview without incrementing the counter
   */
  async getNextCodePreview(projectId: string): Promise<string> {
    return this.repository.getNextCodePreview(projectId);
  }
}

// Export singleton instance of the service
export const educcionService = new EduccionService();