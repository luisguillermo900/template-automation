import educcionRoutes from './routes/educcion.routes';
import { educcionService } from './services/educcion.service';
import { educcionRepository } from './repositories/educcion.repository';
import { educcionController } from './controllers/educcion.controller';

// Export all module components
export {
  educcionRoutes,
  educcionService,
  educcionRepository,
  educcionController
};