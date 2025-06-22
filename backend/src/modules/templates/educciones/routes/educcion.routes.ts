import { Router } from 'express';
import { educcionController } from '../controllers/educcion.controller';

const router = Router();

// Core CRUD operations (collection routes - no educod parameter)
router.get('/organizations/:orgcod/projects/:projcod/educciones', educcionController.getEduccionesByProject.bind(educcionController));
router.post('/organizations/:orgcod/projects/:projcod/educciones', educcionController.createEduccion.bind(educcionController));

// Additional functionality (specific endpoints)
router.get('/organizations/:orgcod/projects/:projcod/educciones/next-code', educcionController.getNextCode.bind(educcionController));

// Search routes (specific endpoints)
router.get('/organizations/:orgcod/projects/:projcod/educciones/search', educcionController.searchEduccionesByName.bind(educcionController));

// Export routes (specific endpoints)
router.get('/organizations/:orgcod/projects/:projcod/educciones/exports/excel', educcionController.exportToExcel.bind(educcionController));
router.get('/organizations/:orgcod/projects/:projcod/educciones/exports/pdf', educcionController.exportToPDF.bind(educcionController));

// Core CRUD operations (individual resources with educod parameter)
router.get('/organizations/:orgcod/projects/:projcod/educciones/:educod', educcionController.getEduccionByCode.bind(educcionController));
router.put('/organizations/:orgcod/projects/:projcod/educciones/:educod', educcionController.updateEduccion.bind(educcionController));
router.delete('/organizations/:orgcod/projects/:projcod/educciones/:educod', educcionController.deleteEduccion.bind(educcionController));

// Related resources
router.get('/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones', educcionController.getEduccionWithIlaciones.bind(educcionController));

export default router;