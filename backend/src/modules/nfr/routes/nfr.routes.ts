// nfr/routes/nfr.routes.ts

import { Router } from 'express';
import { nfrController } from '../controllers/nfr.controller';
import { riskController } from '../../risk/controllers/risk.controller'; // Importación del controlador de Risk

const router = Router();

// ============ GLOBAL ROUTES (sin filtrar por proyecto) ============

// Global NFR routes
router.get('/nfrs', nfrController.getAllNfrs.bind(nfrController));
router.get('/nfrs/exports/excel', nfrController.exportAllToExcel.bind(nfrController));
router.get('/nfrs/frequent', nfrController.getFrequentNfrs.bind(nfrController));
router.get('/nfrs/:nfrcod', nfrController.getNfrByCode.bind(nfrController));
router.get('/nfrs/:nfrcod/instances', nfrController.getNfrInstances.bind(nfrController));

// ============ PROJECT-SPECIFIC ROUTES ============

// NFR routes - siguiendo el patrón de proyectos
// Core CRUD operations (collection routes)
router.get('/projects/:projcod/nfrs', nfrController.getNfrsByProject.bind(nfrController));
router.post('/projects/:projcod/nfrs', nfrController.createNfr.bind(nfrController));
router.post('/projects/:projcod/nfrs/from-existing', nfrController.createNfrFromExisting.bind(nfrController));
router.get('/projects/:projcod/nfrs/check-duplicate', nfrController.checkDuplicateNfr.bind(nfrController));

// Additional functionality
router.get('/projects/:projcod/nfrs/next-code', nfrController.getNextCode.bind(nfrController));

// Search routes
router.get('/projects/:projcod/nfrs/search/name', nfrController.searchNfrs.bind(nfrController));
router.get('/projects/:projcod/nfrs/search/date', nfrController.searchNfrsByDate.bind(nfrController));
router.get('/projects/:projcod/nfrs/search/status', nfrController.searchNfrsByStatus.bind(nfrController));
router.get('/projects/:projcod/nfrs/search/quality-attribute', nfrController.searchNfrsByQualityAttribute.bind(nfrController));

// Export routes
router.get('/projects/:projcod/nfrs/exports/excel', nfrController.exportToExcel.bind(nfrController));
router.get('/projects/:projcod/nfrs/exports/pdf', nfrController.exportToPDF.bind(nfrController));

// Core CRUD operations (individual resources)
router.get('/projects/:projcod/nfrs/:nfrcod', nfrController.getNfrByCode.bind(nfrController));
router.put('/projects/:projcod/nfrs/:nfrcod', nfrController.updateNfr.bind(nfrController));
router.delete('/projects/:projcod/nfrs/:nfrcod', nfrController.deleteNfr.bind(nfrController));

// Rutas relacionadas con los Riesgos de un NFR
// Estas rutas ahora derivan al controlador del módulo Risk
router.get('/projects/:projcod/nfrs/:nfrcod/risks', riskController.getRisksByNfr.bind(riskController));
router.post('/projects/:projcod/nfrs/:nfrcod/risks', riskController.createRiskForNfr.bind(riskController));

export default router;