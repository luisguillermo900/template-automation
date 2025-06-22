import { Router } from 'express';
import { sourceController } from '../controllers/source.controller';

const router = Router();

// CRUD routes operations 
router.get('/organizations/:orgcod/projects/:projcod/sources', sourceController.getSourcesByProject.bind(sourceController));
router.post('/organizations/:orgcod/projects/:projcod/sources', sourceController.createSource.bind(sourceController));

// Additional functionality (specific endpoints)
router.get('/organizations/:orgcod/projects/:projcod/sources/next-code', sourceController.getNextCode.bind(sourceController));

// Auxiliary routes
router.get('/organizations/:orgcod/projects/:projcod/sources/search', sourceController.searchSourcesByName.bind(sourceController));
router.get('/organizations/:orgcod/projects/:projcod/sources/search/date', sourceController.searchSourcesByDate.bind(sourceController));

// Core CRUD operations
router.get('/organizations/:orgcod/projects/:projcod/sources/:srccod', sourceController.getSourceByCode.bind(sourceController));
router.put('/organizations/:orgcod/projects/:projcod/sources/:srccod', sourceController.updateSource.bind(sourceController));
router.delete('/organizations/:orgcod/projects/:projcod/sources/:srccod', sourceController.deleteSource.bind(sourceController));

// Export routes (specific endpoints)
router.get('/organizations/:orgcod/projects/:projcod/sources/exports/excel', sourceController.exportToExcel.bind(sourceController));
router.get('/organizations/:orgcod/projects/:projcod/sources/exports/pdf', sourceController.exportToPDF.bind(sourceController));

export default router;
