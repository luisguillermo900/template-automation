import artifactRoutes from './routes/artifact.route';
import { artifactService } from './services/artifact.service';
import { artifactRepository } from './repositories/artifact.repository';
import { artifactController } from './controllers/artifact.controller';

// Export all module components
export {
  artifactRoutes,
  artifactService,
  artifactRepository,
  artifactController
};