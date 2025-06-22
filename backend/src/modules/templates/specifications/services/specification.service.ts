import { specificationRepository } from '../repositories/specification.repository';
import { SpecificationDTO } from '../models/specification.model';

export class SpecificationService {
  private repository = specificationRepository;

  /**
   * Creates a new specification
   */
  async createSpecification(ilacionId: string, data: SpecificationDTO) {
    return this.repository.create(ilacionId, data);
  }

  /**
   * Gets all specifications from an ilacion with pagination
   */
  async getSpecificationsByIlacion(ilacionId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.repository.findAllByIlacion(ilacionId, skip, limit);
  }

  /**
   * Gets a specification by its code, considering the ilacion context
   */
  async getSpecificationByCode(code: string, ilacionId: string) {
    return this.repository.findByCodeAndIlacion(code, ilacionId);
  }

  /**
   * Updates an existing specification
   */
  async updateSpecification(id: string, data: Partial<SpecificationDTO>) {
    return this.repository.update(id, data);
  }

  /**
   * Deletes a specification
   */
  async deleteSpecification(id: string) {
    return this.repository.delete(id);
  }

  /**
   * Searches specifications by name
   */
  async searchSpecificationsByName(ilacionId: string, name: string) {
    return this.repository.searchByName(ilacionId, name);
  }

  /**
   * Gets the next unique code for a specification
   */
  async getNextCode(ilacionId: string): Promise<string> {
    return this.repository.getNextCode(ilacionId);
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
  async getNextCodePreview(ilacionId: string): Promise<string> {
    return this.repository.getNextCodePreview(ilacionId);
  }
}

export const specificationService = new SpecificationService();