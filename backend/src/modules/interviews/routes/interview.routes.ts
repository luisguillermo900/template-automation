import { Router } from 'express';
import { interviewController } from '../controllers/interview.controller';

const router = Router();

// Core CRUD 
router.post('/organizations/:orgcod/projects/:projcod/interviews', interviewController.createInterview.bind(interviewController));
router.get('/organizations/:orgcod/projects/:projcod/interviews', interviewController.getInterviewByProject.bind(interviewController));

// Search by name
router.get('/organizations/:orgcod/projects/:projcod/interviews/search', interviewController.searchByName.bind(interviewController));

// Core CRUD operations
router.get('/organizations/:orgcod/projects/:projcod/interviews/:interviewId', interviewController.getInterviewById.bind(interviewController));
router.put('/organizations/:orgcod/projects/:projcod/interviews/:interviewId', interviewController.updateInterview.bind(interviewController));
router.delete('/organizations/:orgcod/projects/:projcod/interviews/:interviewId', interviewController.deleteInterview.bind(interviewController));


router.post('/interviews/:id/agenda-items', interviewController.addAgendaItem.bind(interviewController));
router.delete('/agenda-items/:id', interviewController.removeAgendaItem.bind(interviewController));

router.post('/interviews/:id/conclusions', interviewController.addConclusion.bind(interviewController));
router.delete('/conclusions/:id', interviewController.removeConclusion.bind(interviewController));

// Export routes (specific endpoints)
router.get('/organizations/:orgcod/projects/:projcod/interviews/exports/excel', interviewController.exportToExcel.bind(interviewController));
router.get('/organizations/:orgcod/projects/:projcod/interviews/exports/pdf', interviewController.exportToPDF.bind(interviewController));

export default router;