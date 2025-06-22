// risk/routes/risk.routes.ts

import { Router } from 'express';
import { riskController } from '../controllers/risk.controller';

const router = Router();

// ============ GLOBAL ROUTES (sin filtrar por proyecto) ============

// Global Risk routes
router.get('/risks', riskController.getAllRisks.bind(riskController));
router.get('/risks/exports/excel', riskController.exportAllToExcel.bind(riskController));
router.get('/risks/similar', riskController.getSimilarRisks.bind(riskController));
router.get('/risks/frequent', riskController.getFrequentRisks.bind(riskController));
router.get('/risks/:riskcod', riskController.getRiskByCode.bind(riskController));
router.get('/risks/entity/:entityType/registry/:registryCode', riskController.getRisksByEntityAndRegistry.bind(riskController));

// ============ PROJECT-SPECIFIC ROUTES ============

// Risk routes - siguiendo el patrón de proyectos
// Collection routes for risks
router.get('/projects/:projcod/risks', riskController.getRisksByProject.bind(riskController));
router.post('/projects/:projcod/risks', riskController.createRisk.bind(riskController));
router.post('/projects/:projcod/risks/from-existing', riskController.createRiskFromExisting.bind(riskController));
router.get('/projects/:projcod/risks/check-duplicate', riskController.checkDuplicateRisk.bind(riskController));

// Risk for specific NFR (compatibility with NFR module)
router.get('/projects/:projcod/nfrs/:nfrcod/risks', riskController.getRisksByNfr.bind(riskController));
router.post('/projects/:projcod/nfrs/:nfrcod/risks', riskController.createRiskForNfr.bind(riskController));

// Additional functionality
router.get('/projects/:projcod/risks/next-code', riskController.getNextCode.bind(riskController));

// Search routes
router.get('/projects/:projcod/risks/search/status', riskController.searchRisksByStatus.bind(riskController));
router.get('/projects/:projcod/risks/search/date', riskController.searchRisksByDate.bind(riskController));

// Export routes
router.get('/projects/:projcod/risks/exports/excel', riskController.exportToExcel.bind(riskController));
router.get('/projects/:projcod/risks/exports/pdf', riskController.exportToPDF.bind(riskController));

// Individual risk routes
router.get('/projects/:projcod/risks/:riskcod', riskController.getRiskByCode.bind(riskController));
router.put('/projects/:projcod/risks/:riskcod', riskController.updateRisk.bind(riskController));
router.delete('/projects/:projcod/risks/:riskcod', riskController.deleteRisk.bind(riskController));

export default router;