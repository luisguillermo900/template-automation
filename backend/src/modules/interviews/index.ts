import interviewRoutes from './routes/interview.routes';
import { interviewService } from './services/interview.service';
import { interviewRepository } from './repositories/interview.repository';
import { interviewController } from './controllers/interview.controller';

// Export all module components
export {
  interviewRoutes,
  interviewService,
  interviewRepository,
  interviewController
};