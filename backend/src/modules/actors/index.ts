import actorRoutes from './routes/actor.routes';
import { actorService } from './services/actor.service';
import { actorRepository } from './repositories/actor.repository';
import { actorController } from './controllers/actor.controller';

export {
  actorRoutes,
  actorService,
  actorController,
  actorRepository
};