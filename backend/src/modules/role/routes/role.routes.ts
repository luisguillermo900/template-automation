import { Router } from 'express';
import { roleController } from '../controllers/role.controller';

const router = Router();

// Core CRUD operations
router.get('/roles', roleController.getRoles.bind(roleController));
router.post('/roles', roleController.createRole.bind(roleController));

// Specific routes must be placed before routes with variable parameters!
router.get('/roles/next-code', roleController.getNextCode.bind(roleController));
router.get('/roles/search', roleController.searchRoles.bind(roleController));
router.get('/roles/stats', roleController.getRoleStats.bind(roleController));
router.get('/roles/active', roleController.getActiveRolesForDropdown.bind(roleController));

// Export routes (NEW)
router.get('/roles/exports/excel', roleController.exportToExcel.bind(roleController));
router.get('/roles/exports/pdf', roleController.exportToPDF.bind(roleController));

// Status specific routes
router.get('/roles/status/:status', roleController.getRolesByStatus.bind(roleController));

// Bulk operations
router.post('/roles/bulk-update-status', roleController.bulkUpdateRoleStatus.bind(roleController));

// Routes with variable parameters after specific routes
router.get('/roles/:id', roleController.getRoleById.bind(roleController));
router.put('/roles/:id', roleController.updateRole.bind(roleController));
router.delete('/roles/:id', roleController.deleteRole.bind(roleController));

// Get role with full relations (actors and authors)
router.get('/roles/:id/relations', roleController.getRoleWithRelations.bind(roleController));

// Action routes with ID
router.put('/roles/:id/activate', roleController.activateRole.bind(roleController));
router.put('/roles/:id/deactivate', roleController.deactivateRole.bind(roleController));

// Routes by code (alternative access)
router.get('/roles/code/:code', roleController.getRoleByCode.bind(roleController));

export default router;