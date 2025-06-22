// index.ts - AcceptanceRecord Module
import acceptanceRecordRoutes from './routes/acceptanceRecord.routes';
import { acceptanceRecordService } from './services/acceptanceRecord.service';
import { acceptanceRecordRepository } from './repositories/acceptanceRecord.repository';
import { acceptanceRecordController } from './controllers/acceptanceRecord.controller';

// Export all module components
export {
  acceptanceRecordRoutes,
  acceptanceRecordService,
  acceptanceRecordRepository,
  acceptanceRecordController
};