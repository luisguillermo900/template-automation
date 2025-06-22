// backend/src/initialization.ts
import { authService } from './modules/auth';
import { organizationService } from './modules/organizations';

export const initSystem = async () => {
  try {
    await authService.createAdminUser();
    console.log('Usuario administrador inicializado.');

    await organizationService.initializeMainOrganization();
    console.log('Organización principal inicializada.');
  } catch (error) {
    console.error('Error durante la inicialización del sistema:', error);
    process.exit(1);
  }
};