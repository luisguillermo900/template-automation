import { Router } from 'express';
import { specificationController } from '../controllers/specification.controller';

const router = Router();

// Core CRUD operations (collection routes - no speccod parameter)
router.get('/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/:ilacod/specifications',
  specificationController.getSpecificationsByIlacion.bind(specificationController));
router.post('/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/:ilacod/specifications',
  specificationController.createSpecification.bind(specificationController));

// Additional functionality (specific endpoints)
router.get('/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/:ilacod/specifications/next-code',
  specificationController.getNextCode.bind(specificationController));

// Search routes (specific endpoints)
router.get('/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/:ilacod/specifications/search',
  specificationController.searchSpecificationsByName.bind(specificationController));

// Core CRUD operations (individual resources with speccod parameter)
router.get('/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/:ilacod/specifications/:speccod',
  specificationController.getSpecificationByCode.bind(specificationController));
router.put('/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/:ilacod/specifications/:speccod',
  specificationController.updateSpecification.bind(specificationController));
router.delete('/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/:ilacod/specifications/:speccod',
  specificationController.deleteSpecification.bind(specificationController));

// Export routes
router.get('/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/:ilacod/specifications/exports/excel',
  specificationController.exportToExcel.bind(specificationController));
router.get('/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/:ilacod/specifications/exports/pdf',
  specificationController.exportToPDF.bind(specificationController));
export default router;