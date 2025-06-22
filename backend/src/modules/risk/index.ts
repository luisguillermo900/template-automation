// risk/index.ts

import riskRoutes from './routes/risk.routes';
import { riskService } from './services/risk.service';
import { riskRepository } from './repositories/risk.repository';
import { riskController } from './controllers/risk.controller';

// Export all module components
export {
  riskRoutes,
  riskService,
  riskRepository,
  riskController
};