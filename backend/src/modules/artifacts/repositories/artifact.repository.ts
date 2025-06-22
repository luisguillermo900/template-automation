import { prisma } from '../../../shared/database/prisma';
import { ArtifactDTO, ArtifactResponse } from '../models/artifact.model';

export class ArtifactRepository {

  /**
   * Creates a new artifact in the database
   * @param data The artifact data to create
   * @returns The created artifact with generated ID
   */
  async create(data: ArtifactDTO): Promise<ArtifactResponse> {
    return prisma.artifact.create({
      data
    });
  }

  /**
   * Gets all artifacts sorted by mnemonic
   * @returns Array of all artifacts
   */
  async findAll(): Promise<ArtifactResponse[]> {
    return prisma.artifact.findMany({
      orderBy: {
        mnemonic: 'asc'
      }
    });
  }

  /**
   * Finds artifacts by partial name match (case insensitive)
   * @param name The name to search for
   * @returns Array of matching artifacts
   */
  async findByName(name: string): Promise<ArtifactResponse[]> {
    return prisma.artifact.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: {
        name: 'asc'
      }
    });
  }

  /**
   * Finds artifacts by partial mnemonic match (case insensitive)
   * @param mnemonic The mnemonic to search for
   * @returns Array of matching artifacts
   */
  async findByMnemonic(mnemonic: string): Promise<ArtifactResponse[]> {
    return prisma.artifact.findMany({
      where: {
        mnemonic: {
          contains: mnemonic,
          mode: 'insensitive',
        },
      },
      orderBy: {
        mnemonic: 'asc'
      }
    });
  }

  /**
   * Finds an artifact by its unique ID
   * @param id The artifact ID
   * @returns The artifact or null if not found
   */
  async findById(id: string): Promise<ArtifactResponse | null> {
    return prisma.artifact.findUnique({
      where: { id },
    });
  }

  /**
   * Updates an existing artifact
   * @param id The artifact ID to update
   * @param data The partial data to update
   * @returns The updated artifact
   * @throws Will throw an error if artifact with ID does not exist
   */
  async update(id: string, data: Partial<ArtifactDTO>): Promise<ArtifactResponse> {
    return prisma.artifact.update({
      where: { id },
      data
    });
  }

  /**
   * Deletes an artifact by ID
   * @param id The artifact ID to delete
   * @returns The deleted artifact
   * @throws Will throw an error if artifact with ID does not exist
   */
  async delete(id: string): Promise<ArtifactResponse> {
    return prisma.artifact.delete({
      where: { id },
    });
  }
}

export const artifactRepository = new ArtifactRepository();