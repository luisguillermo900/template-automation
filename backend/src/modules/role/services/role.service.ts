// services/role.service.ts
import { roleRepository } from '../repositories/role.repository';
import { RoleDTO, RoleSearchParams } from '../models/role.model';

export class RoleService {
  private readonly repository = roleRepository;

  /**
   * Creates a new role
   */
  async createRole(data: RoleDTO) {
    // Validate required fields
    if (!data.name || data.name.trim() === '') {
      throw new Error('Role name is required');
    }

    // Validate name uniqueness
    const isUnique = await this.repository.isNameUnique(data.name);
    if (!isUnique) {
      throw new Error('Role name already exists');
    }

    data.status ??= 'Active'; // Default status

    const validStatuses = ['Active', 'Inactive'];
    if (!validStatuses.includes(data.status)) {
      throw new Error('Invalid status. Must be Active or Inactive');
    }

    return this.repository.create(data);
  }

  /**
   * Updates an existing role
   */
  async updateRole(id: string, data: Partial<RoleDTO>) {
    // Verify role exists
    const existingRole = await this.repository.findById(id);
    if (!existingRole) {
      throw new Error('Role not found');
    }

    // Validate required fields if being updated
    if (data.name !== undefined && (!data.name || data.name.trim() === '')) {
      throw new Error('Role name is required');
    }

    // Validate name uniqueness if being updated
    if (data.name && data.name !== existingRole.name) {
      const isUnique = await this.repository.isNameUnique(data.name, id);
      if (!isUnique) {
        throw new Error('Role name already exists');
      }
    }

    // Validate status if being updated
    if (data.status) {
      const validStatuses = ['Active', 'Inactive'];
      if (!validStatuses.includes(data.status)) {
        throw new Error('Invalid status. Must be Active or Inactive');
      }
    }

    return this.repository.update(id, data);
  }

  /**
   * Gets all roles with pagination
   */
  async getRoles(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const roles = await this.repository.findAll(skip, limit);
    const total = await this.repository.count();

    // Format roles with counts
    const formattedRoles = roles.map(role => ({
      ...role,
      actorCount: role._count?.actors || 0,
      authorCount: role._count?.authors || 0,
    }));

    return {
      data: formattedRoles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Gets a role by ID
   */
  async getRoleById(id: string) {
    const role = await this.repository.findById(id);
    if (!role) {
      throw new Error('Role not found');
    }

    return {
      ...role,
      actorCount: role._count?.actors || 0,
      authorCount: role._count?.authors || 0,
    };
  }

  /**
   * Gets a role by code
   */
  async getRoleByCode(code: string) {
    const role = await this.repository.findByCode(code);
    if (!role) {
      throw new Error('Role not found');
    }

    return {
      ...role,
      actorCount: role._count?.actors || 0,
      authorCount: role._count?.authors || 0,
    };
  }

  /**
   * Gets a role with full relations (actors and authors)
   */
  async getRoleWithRelations(id: string) {
    const role = await this.repository.findByIdWithRelations(id);
    if (!role) {
      throw new Error('Role not found');
    }

    return {
      ...role,
      actorCount: role._count?.actors || 0,
      authorCount: role._count?.authors || 0,
    };
  }

  /**
   * Searches roles with filters
   */
  async searchRoles(params: RoleSearchParams) {
    const results = await this.repository.search(params);
    
    return results.map(role => ({
      ...role,
      actorCount: role._count?.actors || 0,
      authorCount: role._count?.authors || 0,
    }));
  }

  /**
   * Gets roles by status
   */
  async getRolesByStatus(status: string) {
    const validStatuses = ['Active', 'Inactive'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status. Must be Active or Inactive');
    }
    
    const results = await this.repository.findByStatus(status);
    
    return results.map(role => ({
      ...role,
      actorCount: role._count?.actors || 0,
      authorCount: role._count?.authors || 0,
    }));
  }

  /**
   * Activates a role
   */
  async activateRole(id: string) {
    return this.updateRole(id, { status: 'Active' });
  }

  /**
   * Deactivates a role
   */
  async deactivateRole(id: string) {
    return this.updateRole(id, { status: 'Inactive' });
  }

  /**
   * Deletes a role
   */
  async deleteRole(id: string) {
    // Verify role exists
    const existingRole = await this.repository.findById(id);
    if (!existingRole) {
      throw new Error('Role not found');
    }

    // Check if role can be deleted (no actors or authors assigned)
    const canBeDeleted = await this.repository.canBeDeleted(id);
    if (!canBeDeleted) {
      throw new Error('Cannot delete role with assigned actors or authors');
    }

    return this.repository.delete(id);
  }

  /**
   * Gets next code preview
   */
  async getNextCode() {
    return this.repository.getNextCodePreview();
  }

  /**
   * Gets role statistics
   */
  async getRoleStats() {
    const stats = await this.repository.getStats();
    
    const averageActorsPerRole = stats.total > 0 ? stats.totalActors / stats.total : 0;
    const averageAuthorsPerRole = stats.total > 0 ? stats.totalAuthors / stats.total : 0;

    return {
      ...stats,
      averageActorsPerRole: Math.round(averageActorsPerRole * 100) / 100,
      averageAuthorsPerRole: Math.round(averageAuthorsPerRole * 100) / 100,
    };
  }

  /**
   * Bulk update roles status
   */
  async bulkUpdateRoleStatus(roleIds: string[], status: 'Active' | 'Inactive') {
    const validStatuses = ['Active', 'Inactive'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status. Must be Active or Inactive');
    }

    const results = [];
    for (const id of roleIds) {
      try {
        const updated = await this.updateRole(id, { status });
        results.push({ id, success: true, data: updated });
      } catch (error) {
        results.push({ id, success: false, error: (error as Error).message });
      }
    }

    return results;
  }

  /**
   * Gets all active roles for dropdown
   */
  async getActiveRolesForDropdown() {
    const activeRoles = await this.repository.findByStatus('Active');
    
    return activeRoles.map(role => ({
      id: role.id,
      name: role.name,
    }));
  }
}

// Export singleton instance of the service
export const roleService = new RoleService();