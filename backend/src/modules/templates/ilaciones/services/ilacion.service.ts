import { IlacionDTO, IlacionResponse } from '../models/ilacion.model';
import { ilacionRepository } from '../repositories/ilacion.repository';

export class IlacionService {
  private repository = ilacionRepository;

  /**
   * Creates a new ilacion
   */
  async createIlacion(educcionId: string, data: IlacionDTO): Promise<IlacionResponse> {
    return this.repository.create(educcionId, data);
  }

  /**
   * Gets all ilaciones from an educcion with pagination
   */
  async getIlacionesByEduccion(educcionId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.repository.findAllByEduccion(educcionId, skip, limit);
  }

  /**
   * Gets an ilacion by its code, considering the educcion context
   */
  async getIlacionByCode(code: string, educcionId?: string) {
    if (educcionId) {
      return this.repository.findByCodeAndEduccion(code, educcionId);
    } else {
      return this.repository.findByCode(code);
    }
  }

  /**
   * Updates an existing ilacion
   */
  async updateIlacion(code: string, educcionId: string, data: IlacionDTO) {
    const existingIlacion = await this.repository.findByCodeAndEduccion(code, educcionId);
    if (!existingIlacion) {
      throw new Error('Ilacion not found');
    }

    // Increment version
    const newVersion = this.incrementVersion(existingIlacion.version);

    return this.repository.update(existingIlacion.id, data, newVersion);
  }

  /**
   * Deletes an ilacion
   */
  async deleteIlacion(code: string, educcionId: string) {
    const ilacion = await this.repository.findByCodeAndEduccion(code, educcionId);
    if (!ilacion) {
      throw new Error('Ilacion not found');
    }

    return this.repository.delete(ilacion.id);
  }

  /**
   * Searches ilaciones by name
   */
  async searchIlacionesByName(educcionId: string, name: string) {
    return this.repository.searchByName(educcionId, name);
  }

  /**
   * Gets the next unique code for an ilacion
   */
  async getNextCode(educcionId: string): Promise<string> {
    return this.repository.getNextCode(educcionId);
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
  async getNextCodePreview(educcionId: string): Promise<string> {
    return this.repository.getNextCodePreview(educcionId);
  }
}

export const ilacionService = new IlacionService();