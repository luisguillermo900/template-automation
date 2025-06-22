import { actorRepository } from '../repositories/actor.repository';
import { ActorDTO, ActorSearchParams } from '../models/actor.model';

export class ActorService {
  private readonly repository = actorRepository;

  /**
   * Creates a new actor
   */
  async createActor(organizationCode: string, projectCode: string, data: ActorDTO) {
    return this.repository.create(organizationCode, projectCode, data);
  }

  /**
   * Updates an existing actor
   */
  async updateActor(organizationCode: string, projectCode: string, actorCode: string, data: Partial<ActorDTO>) {
    return this.repository.update(organizationCode, projectCode, actorCode, data);
  }

  /**
   * Deletes an actor
   */
  async deleteActor(organizationCode: string, projectCode: string, actorCode: string) {
    return this.repository.delete(organizationCode, projectCode, actorCode);
  }

  /**
   * Gets an actor by organization, project and actor codes
   */
  async getActorByOrgProjectAndCode(organizationCode: string, projectCode: string, actorCode: string) {
    return this.repository.findByOrgProjectAndCode(organizationCode, projectCode, actorCode);
  }

  /**
   * Gets all actors for a project
   */
  async getActorsByProject(organizationCode: string, projectCode: string, page?: number, limit?: number) {
    let skip, take;
    
    if (page && limit) {
      skip = (page - 1) * limit;
      take = limit;
    }

    return this.repository.findByProject(organizationCode, projectCode, skip, take);
  }

  /**
   * Searches actors by name
   */
  async searchActorsByName(organizationCode: string, projectCode: string, name: string) {
    return this.repository.searchByName(organizationCode, projectCode, name);
  }

  /**
   * Searches actors by date
   */
  async searchActorsByDate(organizationCode: string, projectCode: string, year?: string, month?: string) {
    return this.repository.searchByDate(organizationCode, projectCode, year, month);
  }

  /**
   * Advanced search for actors
   */
  async searchActors(organizationCode: string, projectCode: string, searchParams: ActorSearchParams) {
    // For now, we only implement name search, but this can be extended
    if (searchParams.name) {
      return this.searchActorsByName(organizationCode, projectCode, searchParams.name);
    }

    if (searchParams.year || searchParams.month) {
      return this.searchActorsByDate(organizationCode, projectCode, searchParams.year, searchParams.month);
    }

    // If no specific search criteria, return all actors for the project
    return this.getActorsByProject(organizationCode, projectCode);
  }

  /**
   * Gets the next code preview without incrementing the counter
   */
  async getNextCodePreview(organizationCode: string, projectCode: string): Promise<string> {
    return this.repository.getNextCodePreview(organizationCode, projectCode);
  }

  /**
   * Gets the next unique code for an actor and increments counter
   */
  async getNextCode(organizationCode: string, projectCode: string): Promise<string> {
    return this.repository.getNextCode(organizationCode, projectCode);
  }

  /**
   * Gets actor statistics for a project
   */
  async getActorStats(organizationCode: string, projectCode: string) {
    const actors = await this.getActorsByProject(organizationCode, projectCode);
    
    const stats = {
      total: actors.length,
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      byRole: {} as Record<string, number>,
    };

    actors.forEach(actor => {
      // Count by type
      stats.byType[actor.type] = (stats.byType[actor.type] || 0) + 1;
      
      // Count by status
      stats.byStatus[actor.status] = (stats.byStatus[actor.status] || 0) + 1;
      
      // Count by roleId
      if (actor.roleId) {
        stats.byRole[actor.roleId] = (stats.byRole[actor.roleId] || 0) + 1;
      }
    });

    return stats;
  }
}

// Export singleton instance of the service
export const actorService = new ActorService();