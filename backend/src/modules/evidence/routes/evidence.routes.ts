import { Router } from 'express';
import multer from 'multer';
import { evidenceController } from '../controllers/evidence.controller';

const router = Router();
const upload = multer({ dest: 'uploads/evidence/' });

// Additional functionality 
router.get('/organizations/:orgcod/projects/:projcod/evidences', evidenceController.getEvidencesByProject.bind(evidenceController));
router.get('/organizations/:orgcod/projects/:projcod/evidences/search', evidenceController.searchEvidencesByNameInProject.bind(evidenceController));

// Core CRUD operations (collection routes - no :code parameter)
router.get('/organizations/:orgcod/projects/:projcod/interviews/:interviewid/evidences', evidenceController.getEvidencesByInterview.bind(evidenceController));
router.post('/organizations/:orgcod/projects/:projcod/interviews/:interviewid/evidences', upload.single('file'), evidenceController.createEvidence.bind(evidenceController));

// Additional functionality (specific endpoints)
router.get('/organizations/:orgcod/projects/:projcod/interviews/:interviewid/evidences/next-code', evidenceController.getNextCode.bind(evidenceController));

// Search routes (specific endpoints)
router.get('/organizations/:orgcod/projects/:projcod/interviews/:interviewid/evidences/search', evidenceController.searchEvidencesByName.bind(evidenceController));

// Core CRUD operations
router.get('/organizations/:orgcod/projects/:projcod/interviews/:interviewid/evidences/:code', evidenceController.getEvidenceByCode.bind(evidenceController));
router.put('/organizations/:orgcod/projects/:projcod/interviews/:interviewid/evidences/:code', upload.single('file'), evidenceController.updateEvidence.bind(evidenceController));
router.delete('/organizations/:orgcod/projects/:projcod/interviews/:interviewid/evidences/:code', evidenceController.deleteEvidence.bind(evidenceController));

// Preview route for evidence files
router.get('/organizations/:orgcod/projects/:projcod/interviews/:interviewid/evidences/:code/preview', evidenceController.getEvidenceFilePath.bind(evidenceController));

export default router;
