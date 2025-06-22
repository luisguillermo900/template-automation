// index.ts - Evidence Module
import evidenceRoutes from './routes/evidence.routes';
import { evidenceService } from './services/evidence.service';
import { evidenceRepository } from './repositories/evidence.repository';
import { evidenceController } from './controllers/evidence.controller';

// Export all module components
export {
  evidenceRoutes,
  evidenceService,
  evidenceRepository,
  evidenceController
};
