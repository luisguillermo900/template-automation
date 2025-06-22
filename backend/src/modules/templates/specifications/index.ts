import specificationRoutes from './routes/specification.routes';
import { specificationService } from './services/specification.service';
import { specificationRepository } from './repositories/specification.repository';
import { specificationController } from './controllers/specification.controller';

// Export all module components
export {
  specificationRoutes,
  specificationService,
  specificationRepository,
  specificationController
};