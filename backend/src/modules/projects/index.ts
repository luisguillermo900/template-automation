import projectRoutes from './routes/project.routes';
import { projectService } from './services/project.service';
import { projectRepository } from './repositories/project.repository';
import { projectController } from './controllers/project.controller';

export {
  projectRoutes,
  projectService,
  projectController,
  projectRepository
};