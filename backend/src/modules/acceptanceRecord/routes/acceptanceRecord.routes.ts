// routes/acceptanceRecord.routes.ts
import { Router } from 'express';
import { acceptanceRecordController, upload } from '../controllers/acceptanceRecord.controller';

const router = Router();

// Core CRUD operations
router.get('/acceptance-records', acceptanceRecordController.getAcceptanceRecords.bind(acceptanceRecordController));
router.post('/acceptance-records', upload.single('file'), acceptanceRecordController.createAcceptanceRecord.bind(acceptanceRecordController));
router.get('/acceptance-records/search', acceptanceRecordController.searchAcceptanceRecords.bind(acceptanceRecordController));
router.get('/acceptance-records/stats', acceptanceRecordController.getAcceptanceRecordStats.bind(acceptanceRecordController));

// Routes with parameters
router.get('/acceptance-records/:id', acceptanceRecordController.getAcceptanceRecordById.bind(acceptanceRecordController));
router.put('/acceptance-records/:id', upload.single('file'), acceptanceRecordController.updateAcceptanceRecord.bind(acceptanceRecordController));
router.delete('/acceptance-records/:id', acceptanceRecordController.deleteAcceptanceRecord.bind(acceptanceRecordController));
router.get('/acceptance-records/:id/download', acceptanceRecordController.downloadAcceptanceRecordFile.bind(acceptanceRecordController));

// Project-specific routes
router.get('/projects/:projectId/acceptance-records', acceptanceRecordController.getAcceptanceRecordsByProject.bind(acceptanceRecordController));

// File type specific routes
router.get('/acceptance-records/by-type/:fileType', acceptanceRecordController.getAcceptanceRecordsByFileType.bind(acceptanceRecordController));

export default router;