import { Router } from 'express';
import { ilacionController } from '../controllers/ilacion.controller';

const router = Router();

// Core CRUD operations (collection routes - no ilacod parameter)
router.get('/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones', ilacionController.getIlacionesByEduccion.bind(ilacionController));
router.post('/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones', ilacionController.createIlacion.bind(ilacionController));

// Additional functionality (specific endpoints)
router.get('/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/next-code', ilacionController.getNextCode.bind(ilacionController));

// Search routes (specific endpoints)
router.get('/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/search', ilacionController.searchIlacionesByName.bind(ilacionController));

// Export routes (specific endpoints)
router.get('/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/exports/excel', ilacionController.exportToExcel.bind(ilacionController));
router.get('/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/exports/pdf', ilacionController.exportToPDF.bind(ilacionController));

// Core CRUD operations (individual resources with ilacod parameter)
router.get('/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/:ilacod', ilacionController.getIlacionByCode.bind(ilacionController));
router.put('/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/:ilacod', ilacionController.updateIlacion.bind(ilacionController));
router.delete('/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/:ilacod', ilacionController.deleteIlacion.bind(ilacionController));

export default router;