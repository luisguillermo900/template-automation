import { Router } from 'express';
import { artifactController } from '../controllers/artifact.controller';

const router = Router();

// Core CRUD operations
router.get('/artifacts', artifactController.getAllArtifacts.bind(artifactController));
router.post('/artifacts', artifactController.createArtifact.bind(artifactController));

// Search routes
router.get('/artifacts/search/name', artifactController.searchArtifactsByName.bind(artifactController));
router.get('/artifacts/search/mnemonic', artifactController.searchArtifactsByMnemonic.bind(artifactController));

// Individual resource operations
router.get('/artifacts/:id', artifactController.getArtifactById.bind(artifactController));
router.put('/artifacts/:id', artifactController.updateArtifact.bind(artifactController));
router.delete('/artifacts/:id', artifactController.deleteArtifact.bind(artifactController));

export default router;