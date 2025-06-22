import ilacionRoutes from './routes/ilacion.routes';
import { ilacionService } from './services/ilacion.service';
import { ilacionRepository } from './repositories/ilacion.repository';
import { ilacionController } from './controllers/ilacion.controller';

// Export all module components
export {
  ilacionRoutes,
  ilacionService,
  ilacionRepository,
  ilacionController
};