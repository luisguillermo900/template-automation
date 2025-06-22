import { Request, Response } from 'express';
import { artifactService } from '../services/artifact.service';
import { ArtifactDTO } from '../models/artifact.model';

export class ArtifactController {
  /**
   * Creates a new Artifact
   */
  async createArtifact(req: Request, res: Response) {
    try {
      const artifactDto: ArtifactDTO = req.body;

      if (!this.validateArtifactInput(artifactDto, res)) {
        return; // Validation failed and response was sent
      }

      const newArtifact = await artifactService.createArtifact(artifactDto);
      return res.status(201).json({
        success: true,
        message: 'Artifact created successfully.',
        data: newArtifact,
      });
    } catch (error) {
      return this.handleError(res, error, 'creating artifact');
    }
  }

  /**
   * Gets all artifacts
   */
  async getAllArtifacts(req: Request, res: Response) {
    try {
      const artifacts = await artifactService.getAllArtifacts();
      return res.status(200).json({
        success: true,
        data: artifacts
      });
    } catch (error) {
      return this.handleError(res, error, 'fetching artifacts');
    }
  }

  /**
   * Gets an artifact by Name
   */
  async searchArtifactsByName(req: Request, res: Response) {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'The search parameter "query" is required'
        });
      }

      const artifacts = await artifactService.searchArtifactsByName(query as string);
      return res.status(200).json({
        success: true,
        data: artifacts
      });
    } catch (error) {
      return this.handleError(res, error, 'searching artifacts by name');
    }
  }

  /**
   * Gets an artifact by Mnemonic
   */
  async searchArtifactsByMnemonic(req: Request, res: Response) {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'The search parameter "query" is required'
        });
      }

      const artifacts = await artifactService.searchArtifactsByMnemonic(query as string);
      return res.status(200).json({
        success: true,
        data: artifacts
      });
    } catch (error) {
      return this.handleError(res, error, 'searching artifacts by mnemonic');
    }
  }

  /**
   * Gets an artifact by ID
   */
  async getArtifactById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const artifact = await artifactService.getArtifactById(id);

      if (!artifact) {
        return res.status(404).json({
          success: false,
          error: 'Artifact not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: artifact
      });
    } catch (error) {
      return this.handleError(res, error, 'fetching artifact by ID');
    }
  }

  /**
   * Updates an artifact
   */
  async updateArtifact(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const artifactDto: ArtifactDTO = req.body;

      if (!this.validateArtifactInput(artifactDto, res)) {
        return; // Validation failed and response was sent
      }

      const updatedArtifact = await artifactService.updateArtifact(id, artifactDto);

      if (!updatedArtifact) {
        return res.status(404).json({
          success: false,
          error: 'Artifact not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Artifact updated successfully.',
        data: updatedArtifact,
      });
    } catch (error) {
      return this.handleError(res, error, 'updating artifact');
    }
  }

  /**
   * Deletes an artifact
   */
  async deleteArtifact(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedArtifact = await artifactService.deleteArtifact(id);

      if (!deletedArtifact) {
        return res.status(404).json({
          success: false,
          error: 'Artifact not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Artifact deleted successfully.',
        data: deletedArtifact,
      });
    } catch (error) {
      return this.handleError(res, error, 'deleting artifact');
    }
  }

  /**
   * Validates required fields for artifact
   * @returns boolean indicating if validation passed
   */
  private validateArtifactInput(artifactDto: ArtifactDTO, res: Response): boolean {
    if (!artifactDto.name || artifactDto.name.trim() === '') {
      res.status(400).json({
        success: false,
        error: 'Name is required'
      });
      return false;
    }

    if (!artifactDto.mnemonic || artifactDto.mnemonic.trim() === '') {
      res.status(400).json({
        success: false,
        error: 'Mnemonic is required'
      });
      return false;
    }

    return true;
  }

  /**
   * Centralized error handler
   */
  private handleError(res: Response, error: any, action: string): Response {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(`Error ${action}:`, err.message);
    return res.status(500).json({
      success: false,
      error: `Error ${action}`
    });
  }
}

// Export singleton instance of the controller
export const artifactController = new ArtifactController();