import organizationRoutes from './routes/organization.routes';
import { organizationService } from './services/organization.service';
import { organizationRepository } from './repositories/organization.repository';
import { organizationController } from './controllers/organization.controller';

// Export all module components
export {
  organizationRoutes,
  organizationService,
  organizationRepository,
  organizationController
};