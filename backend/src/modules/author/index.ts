// index.ts - Author Module
import authorRoutes from './routes/author.routes';
import { authorService } from './services/author.service';
import { authorRepository } from './repositories/author.repository';
import { authorController } from './controllers/author.controller';

// Export all module components
export {
  authorRoutes,
  authorService,
  authorRepository,
  authorController
};