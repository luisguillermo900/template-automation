import { organizationRepository } from '../repositories/organization.repository';
import { OrganizationDTO } from '../models/organization.model';

export class OrganizationService {
  private repository = organizationRepository;

  /**
   * Creates a new organization
   */
  async createOrganization(data: OrganizationDTO) {
    return this.repository.create(data);
  }

  /**
   * Gets all organizations with pagination
   */
  async getOrganizations(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.repository.findAll(skip, limit);
  }

  /**
   * Gets an organization by code
   */
  async getOrganizationByCode(code: string) {
    return this.repository.findByCode(code);
  }

  /**
   * Gets an organization by ID
   */
  async getOrganizationById(id: string) {
    return this.repository.findById(id);
  }

  /**
   * Updates an existing organization
   */
  async updateOrganization(code: string, data: OrganizationDTO) {
    // Verify organization exists
    const existingOrg = await this.repository.findByCode(code);
    if (!existingOrg) {
      throw new Error('Organization not found');
    }

    // Increment version
    const newVersion = this.incrementVersion(existingOrg.version);

    // Pasar la versión como parámetro separado
    return this.repository.update(code, data, newVersion);
  }

  /**
   * Deletes an organization
   */
  async deleteOrganization(id: string) {
    return this.repository.delete(id);
  }

  /**
   * Searches organizations by name
   */
  async searchOrganizations(name: string) {
    return this.repository.searchByName(name);
  }

  /**
   * Searches organizations by date
   */
  async searchOrganizationsByDate(month: number, year: number) {
    return this.repository.searchByDate(month, year);
  }

  /**
   * Gets an organization with its projects
   */
  async getOrganizationWithProjects(code: string) {
    return this.repository.findWithProjects(code);
  }

  /**
   * Gets the next unique code for an organization
   */
  async getNextCode() {
    return this.repository.getNextCode();
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
  async getNextCodePreview() {
    return this.repository.getNextCodePreview();
  }

  /**
   * Initializes the main organization of the system
   */
  async initializeMainOrganization() {
    const mainOrgCode = 'ORG-MAIN';

    // Check if main organization already exists
    const existingOrg = await this.repository.findByCode(mainOrgCode);

    if (existingOrg) {
      console.log('Main organization already exists:', existingOrg.name);
      return existingOrg;
    }

    // Create main organization if it doesn't exist
    const mainOrganizationData = {
      name: 'ReqWizard',
      address: 'Main organization address',
      phone: '777-0000',
      status: 'Active',
      comments: 'This is the main organization of the system.',
    };

    const mainOrganization = await this.repository.createMainOrganization(mainOrganizationData);

    console.log('Main organization created:', mainOrganization.name);
    return mainOrganization;
  }
}

// Export singleton instance of the service
export const organizationService = new OrganizationService();