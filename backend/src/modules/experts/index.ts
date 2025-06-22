import expertRoutes from './routes/expert.routes';
import { expertService } from './services/expert.service';
import { expertRepository } from './repositories/expert.repository';
import { expertController } from './controllers/expert.controller';

// Export all module components
export {
    expertRoutes,
    expertService,
    expertRepository,
    expertController
};

