import { artifactRepository } from '../repositories/artifact.repository';
import { ArtifactDTO, ArtifactResponse } from '../models/artifact.model';

export class ArtifactService {
  private repository = artifactRepository; // Corregir referencia al repositorio

  /**
   * Creates a new artifact
   * @param data Artifact data to create
   * @returns The created artifact with its ID and timestamps
   */
  async createArtifact(data: ArtifactDTO): Promise<ArtifactResponse> {
    // Validación adicional si es necesario
    return this.repository.create(data);
  }

  /**
   * Gets all artifacts
   * @returns Array of all artifacts
   */
  async getAllArtifacts(): Promise<ArtifactResponse[]> {
    return this.repository.findAll();
  }

  /**
   * Searches artifacts by name (partial match)
   * @param name The name to search for
   * @returns Array of matching artifacts
   */
  async searchArtifactsByName(name: string): Promise<ArtifactResponse[]> {
    return this.repository.findByName(name);
  }

  /**
   * Searches artifacts by mnemonic (partial match)
   * @param mnemonic The mnemonic to search for
   * @returns Array of matching artifacts
   */
  async searchArtifactsByMnemonic(mnemonic: string): Promise<ArtifactResponse[]> {
    return this.repository.findByMnemonic(mnemonic);
  }

  /**
   * Gets an artifact by ID
   * @param id The artifact ID
   * @returns The artifact or null if not found
   */
  async getArtifactById(id: string): Promise<ArtifactResponse | null> {
    return this.repository.findById(id);
  }

  /**
   * Updates an existing artifact
   * @param id The artifact ID to update
   * @param data The updated artifact data
   * @returns The updated artifact or null if not found
   */
  async updateArtifact(id: string, data: ArtifactDTO): Promise<ArtifactResponse | null> {
    // Verify artifact exists
    const existingArtifact = await this.repository.findById(id);
    if (!existingArtifact) {
      return null; // Better handled at controller level
    }

    return this.repository.update(id, data);
  }

  /**
   * Deletes an artifact
   * @param id The artifact ID to delete
   * @returns The deleted artifact or null if not found
   */
  async deleteArtifact(id: string): Promise<ArtifactResponse | null> {
    const existingArtifact = await this.repository.findById(id);
    if (!existingArtifact) {
      return null;
    }

    return this.repository.delete(id);
  }
}

export const artifactService = new ArtifactService();