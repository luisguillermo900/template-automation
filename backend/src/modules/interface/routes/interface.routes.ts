import { Router } from 'express';
import { interfaceController } from '../controllers/interface.controller';

const router = Router();

// Core CRUD operations
router.get('/interfaces', interfaceController.getInterfaces.bind(interfaceController));
router.post('/interfaces', 
  interfaceController.uploadMiddleware, 
  interfaceController.createInterface.bind(interfaceController)
);

// Specific routes must be placed before routes with variable parameters!
router.get('/interfaces/search', interfaceController.searchInterfaces.bind(interfaceController));
router.get('/interfaces/stats', interfaceController.getInterfaceStats.bind(interfaceController));

// Export routes
router.get('/interfaces/exports/excel', interfaceController.exportToExcel.bind(interfaceController));
router.get('/interfaces/exports/pdf', interfaceController.exportToPDF.bind(interfaceController));

// Project specific routes
router.get('/interfaces/project/:projectId', interfaceController.getInterfacesByProject.bind(interfaceController));
router.get('/interfaces/project/:projectId/next-code', interfaceController.getNextCode.bind(interfaceController));
router.get('/interfaces/project/:projectId/dropdown', interfaceController.getInterfacesForDropdown.bind(interfaceController));

// Routes with variable parameters after specific routes
router.get('/interfaces/:id', interfaceController.getInterfaceById.bind(interfaceController));
router.put('/interfaces/:id', 
  interfaceController.uploadMiddleware, 
  interfaceController.updateInterface.bind(interfaceController)
);
router.delete('/interfaces/:id', interfaceController.deleteInterface.bind(interfaceController));

// File operations
router.get('/interfaces/:id/download', interfaceController.downloadInterfaceFile.bind(interfaceController));
router.get('/interfaces/:id/view', interfaceController.viewInterfaceFile.bind(interfaceController));

// Routes by code (alternative access)
router.get('/interfaces/code/:code', interfaceController.getInterfaceByCode.bind(interfaceController));

export default router;