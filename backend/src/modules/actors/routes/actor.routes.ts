import { Router } from 'express';
import { actorController } from '../controllers/actor.controller';

const router = Router();

// Core CRUD operations (collection routes - no actorcod parameter)
router.get('/organizations/:orgcod/projects/:projcod/actors', actorController.getActorsByProject.bind(actorController));
router.post('/organizations/:orgcod/projects/:projcod/actors', actorController.createActor.bind(actorController));

// Additional functionality (specific endpoints)
router.get('/organizations/:orgcod/projects/:projcod/actors/next-code', actorController.getNextCode.bind(actorController));
router.get('/organizations/:orgcod/projects/:projcod/actors/stats', actorController.getActorStats.bind(actorController));

// Search routes (specific endpoints)
router.get('/organizations/:orgcod/projects/:projcod/actors/search', actorController.searchActors.bind(actorController));
router.get('/organizations/:orgcod/projects/:projcod/actors/search/date', actorController.searchActorsByDate.bind(actorController));

// Export routes (specific endpoints)
router.get('/organizations/:orgcod/projects/:projcod/actors/exports/excel', actorController.exportToExcel.bind(actorController));
router.get('/organizations/:orgcod/projects/:projcod/actors/exports/pdf', actorController.exportToPDF.bind(actorController));

// Core CRUD operations (individual resources with actorcod parameter)
router.get('/organizations/:orgcod/projects/:projcod/actors/:actorcod', actorController.getActorByOrgProjectAndCode.bind(actorController));
router.put('/organizations/:orgcod/projects/:projcod/actors/:actorcod', actorController.updateActor.bind(actorController));
router.delete('/organizations/:orgcod/projects/:projcod/actors/:actorcod', actorController.deleteActor.bind(actorController));

export default router;