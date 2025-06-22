// services/author.service.ts - Versión final con versionado automático
import { authorRepository } from '../repositories/author.repository';
import { AuthorDTO, AuthorSearchParams, OrganizationOption, AuthorTemplateOption } from '../models/author.model';

export class AuthorService {
  private repository = authorRepository;

  /**
   * Creates a new author with version 00.01
   */
  async createAuthor(data: AuthorDTO) {
    // Validate required fields
    if (!data.firstName || data.firstName.trim() === '') {
      throw new Error('First name is required');
    }

    // Validate DNI uniqueness if provided
    if (data.dni) {
      const isUnique = await this.repository.isDniUnique(data.dni);
      if (!isUnique) {
        throw new Error('DNI already exists');
      }
    }

    // Validate organization exists if provided
    if (data.organizationId) {
      const orgExists = await this.repository.organizationExists(data.organizationId);
      if (!orgExists) {
        throw new Error('Organization not found');
      }
    }

    // Validate template author exists if provided
    if (data.templateAuthorId) {
      const templateExists = await this.repository.findById(data.templateAuthorId);
      if (!templateExists) {
        throw new Error('Template author not found');
      }
    }

    if (!data.status) {
      data.status = 'Active'; // Default status
    }

    return this.repository.create(data);
  }

  /**
   * Updates an existing author and increments version
   */
  async updateAuthor(id: string, data: Partial<AuthorDTO>) {
    // Verify author exists
    const existingAuthor = await this.repository.findById(id);
    if (!existingAuthor) {
      throw new Error('Author not found');
    }

    // Validate required fields if being updated
    if (data.firstName !== undefined && (!data.firstName || data.firstName.trim() === '')) {
      throw new Error('First name is required');
    }

    // Validate DNI uniqueness if being updated
    if (data.dni && data.dni !== existingAuthor.dni) {
      const isUnique = await this.repository.isDniUnique(data.dni, id);
      if (!isUnique) {
        throw new Error('DNI already exists');
      }
    }

    // Validate organization exists if being updated
    if (data.organizationId && data.organizationId !== existingAuthor.organizationId) {
      const orgExists = await this.repository.organizationExists(data.organizationId);
      if (!orgExists) {
        throw new Error('Organization not found');
      }
    }

    // Increment version automatically
    const newVersion = this.incrementVersion(existingAuthor.version);
    
    return this.repository.update(id, {
      ...data,
      version: newVersion,
    });
  }

  /**
   * Increments version number (00.01 → 00.02 → 00.03, etc.)
   */
  private incrementVersion(currentVersion: string): string {
    const parts = currentVersion.split('.');
    const major = parseInt(parts[0]) || 0;
    const minor = parseInt(parts[1]) || 1;
    
    const newMinor = minor + 1;
    return `${major.toString().padStart(2, '0')}.${newMinor.toString().padStart(2, '0')}`;
  }

  /**
   * Gets all authors with formatted permissions
   */
  async getAuthors(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const authors = await this.repository.findAll(skip, limit);
    const total = await this.repository.count();

    // Format authors with grouped permissions
    const formattedAuthors = authors.map(author => this.formatAuthorResponse(author));

    return {
      data: formattedAuthors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Gets an author by ID with formatted permissions
   */
  async getAuthorById(id: string) {
    const author = await this.repository.findById(id);
    if (!author) {
      throw new Error('Author not found');
    }
    return this.formatAuthorResponse(author);
  }

  /**
   * Formats author response with grouped permissions
   */
  private formatAuthorResponse(author: any) {
    return {
      ...author,
      permissions: {
        people: {
          canEditActors: author.canEditActors || false,
          canEditExperts: author.canEditExperts || false,
        },
        requirements: {
          canEditRequirements: author.canEditRequirements || false,
          canEditSpecifications: author.canEditSpecifications || false,
          canEditIlaciones: author.canEditIlaciones || false,
        },
        artifacts: {
          canEditArtefacts: author.canEditArtefacts || false,
          canEditSources: author.canEditSources || false,
          canEditMetrics: author.canEditMetrics || false,
        },
        processes: {
          canEditInterviews: author.canEditInterviews || false,
          canEditEducation: author.canEditEducation || false,
          canEditSoftwareTests: author.canEditSoftwareTests || false,
          canEditWorkplaceSafety: author.canEditWorkplaceSafety || false,
        },
      },
    };
  }

  /**
   * Gets available organizations for dropdown
   */
  async getOrganizationOptions(): Promise<OrganizationOption[]> {
    return this.repository.getOrganizationOptions();
  }

  /**
   * Gets available template authors for dropdown
   */
  async getTemplateAuthorOptions(): Promise<AuthorTemplateOption[]> {
    const authors = await this.repository.getActiveAuthors();
    return authors.map((author: any) => ({
      id: author.id,
      code: author.code,
      firstName: author.firstName,
      paternalSurname: author.paternalSurname,
      fullName: `${author.firstName} ${author.paternalSurname || ''}`.trim(),
    }));
  }

  /**
   * Gets enhanced statistics including permissions - CORREGIDO
   */
  async getAuthorStats() {
    const stats = await this.repository.getStats();
    
    return {
      total: stats.total,
      byStatus: stats.byStatus,
      byRole: stats.roleStats.reduce((acc: any, role: any) => {
        acc[role.roleId || 'No Role'] = role._count.roleId;
        return acc;
      }, {} as { [key: string]: number }),
      byOrganization: stats.orgStats.reduce((acc: any, org: any) => {
        acc[org.organizationId || 'No Organization'] = org._count.organizationId; // CORREGIDO
        return acc;
      }, {} as { [key: string]: number }),
      byPermissions: await this.repository.getPermissionStats(),
      totalInterviews: stats.totalInterviews,
      averagePermissionsPerAuthor: await this.repository.getAveragePermissions(),
    };
  }

  /**
   * Copies permissions from template author
   */
  async copyPermissionsFromTemplate(templateAuthorId: string): Promise<any> {
    const templateAuthor = await this.repository.findById(templateAuthorId);
    if (!templateAuthor) {
      throw new Error('Template author not found');
    }

    return {
      canEditActors: templateAuthor.canEditActors,
      canEditExperts: templateAuthor.canEditExperts,
      canEditRequirements: templateAuthor.canEditRequirements,
      canEditSpecifications: templateAuthor.canEditSpecifications,
      canEditIlaciones: templateAuthor.canEditIlaciones,
      canEditArtefacts: templateAuthor.canEditArtefacts,
      canEditSources: templateAuthor.canEditSources,
      canEditMetrics: templateAuthor.canEditMetrics,
      canEditInterviews: templateAuthor.canEditInterviews,
      canEditEducation: templateAuthor.canEditEducation,
      canEditSoftwareTests: templateAuthor.canEditSoftwareTests,
      canEditWorkplaceSafety: templateAuthor.canEditWorkplaceSafety,
    };
  }

  /**
   * Gets version history for an author
   */
  async getVersionHistory(id: string) {
    // Este método requeriría una tabla adicional para historial
    // Por ahora retornamos la versión actual
    const author = await this.getAuthorById(id);
    return [
      {
        version: author.version,
        modificationDate: author.modificationDate || author.creationDate,
        changes: ['Current version'],
      },
    ];
  }

  /**
   * Deletes an author and sets interviews to null
   */
  async deleteAuthor(id: string) {
    // Verify author exists
    const existingAuthor = await this.repository.findById(id);
    if (!existingAuthor) {
      throw new Error('Author not found');
    }

    // Update interviews to remove author reference before deleting
    await this.repository.removeAuthorFromInterviews(id);

    return this.repository.delete(id);
  }

  /**
   * Gets authors with specific permissions
   */
  async getAuthorsByPermission(permission: string) {
    return this.repository.findByPermission(permission);
  }

  /**
   * Bulk update permissions for multiple authors
   */
  async bulkUpdatePermissions(authorIds: string[], permissions: any) {
    const results = [];
    for (const id of authorIds) {
      try {
        const updated = await this.updateAuthor(id, permissions);
        results.push({ id, success: true, data: updated });
      } catch (error) {
        results.push({ id, success: false, error: (error as Error).message });
      }
    }
    return results;
  }


  // ... otros métodos existentes del service anterior
  async getNextCode() {
    return this.repository.getNextCode();
  }

  async getNextCodePreview() {
    return this.repository.getNextCodePreview();
  }

  async searchAuthors(params: AuthorSearchParams) {
    const results = await this.repository.search(params);
    return results.map(author => this.formatAuthorResponse(author));
  }

  async getAuthorsByStatus(status: string) {
    const validStatuses = ['Active', 'Inactive'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status. Must be Active or Inactive');
    }
    
    const results = await this.repository.findByStatus(status);
    return results.map(author => this.formatAuthorResponse(author));
  }

  async activateAuthor(id: string) {
    return this.updateAuthor(id, { status: 'Active' });
  }

  async deactivateAuthor(id: string) {
    return this.updateAuthor(id, { status: 'Inactive' });
  }
  async getAuthorsByRole(roleId: string) {
    const results = await this.repository.findByRole(roleId);
    return results.map(author => this.formatAuthorResponse(author));
  }

  async getAuthorByCode(code: string) {
    const author = await this.repository.findByCode(code);
    if (!author) {
      throw new Error('Author not found');
    }
    return this.formatAuthorResponse(author);
  }

  async getAuthorsWithInterviewCount() {
    const authors = await this.repository.findAll(0, 1000); // Get all authors
    
    return authors.map(author => ({
      ...this.formatAuthorResponse(author),
      interviewCount: author.interviews ? author.interviews.length : 0,
    }));
  }

  async bulkUpdateAuthorStatus(authorIds: string[], status: 'Active' | 'Inactive') {
    const validStatuses = ['Active', 'Inactive'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status. Must be Active or Inactive');
    }

    const results = [];
    for (const id of authorIds) {
      try {
        const updated = await this.updateAuthor(id, { status });
        results.push({ id, success: true, data: updated });
      } catch (error) {
        results.push({ id, success: false, error: (error as Error).message });
      }
    }

    return results;
  }
}

// Export singleton instance of the service
export const authorService = new AuthorService();