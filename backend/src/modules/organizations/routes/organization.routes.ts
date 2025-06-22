import { Router } from 'express';
import { organizationController } from '../controllers/organization.controller';

const router = Router();

// Core CRUD operations
router.get('/organizations', organizationController.getOrganizations.bind(organizationController));
router.post('/organizations', organizationController.createOrganization.bind(organizationController));

// Specific routes must be placed before routes with variable parameters!
router.get('/organizations/main', organizationController.getMainOrganization.bind(organizationController));
router.get('/organizations/next-code', organizationController.getNextCode.bind(organizationController));
router.get('/organizations/search', organizationController.searchOrganizations.bind(organizationController));
router.get('/organizations/search/date', organizationController.searchOrganizationsByDate.bind(organizationController));
router.get('/organizations/exports/excel', organizationController.exportToExcel.bind(organizationController));
router.get('/organizations/exports/pdf', organizationController.exportToPDF.bind(organizationController));

// Routes with variable parameters after specific routes
router.get('/organizations/:code', organizationController.getOrganizationByCode.bind(organizationController));
router.put('/organizations/:code', organizationController.updateOrganization.bind(organizationController));
router.delete('/organizations/:id', organizationController.deleteOrganization.bind(organizationController));
router.get('/organizations/:code/projects', organizationController.getProjectsByOrganization.bind(organizationController));

export default router;