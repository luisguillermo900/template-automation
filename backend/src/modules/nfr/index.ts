// nfr/index.ts

import nfrRoutes from './routes/nfr.routes';
import { nfrService } from './services/nfr.service';
import { nfrRepository } from './repositories/nfr.repository';
import { nfrController } from './controllers/nfr.controller';

// Export all module components
export {
  nfrRoutes,
  nfrService,
  nfrRepository,
  nfrController
};