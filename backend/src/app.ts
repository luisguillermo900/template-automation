// backend/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRoutes } from './modules/auth';
import { initSystem } from './initialization';
import { organizationRoutes } from './modules/organizations';
import { projectRoutes } from './modules/projects';
import { educcionRoutes } from './modules/templates/educciones'
import { ilacionRoutes } from './modules/templates/ilaciones';
import { specificationRoutes } from './modules/templates/specifications';
import { interviewRoutes } from './modules//interviews';
import { expertRoutes } from './modules/experts';
import { sourceRoutes } from './modules/source';
import { nfrRoutes } from './modules/nfr';
import { riskRoutes } from './modules/risk';
import { artifactRoutes } from './modules/artifacts';
import { acceptanceRecordRoutes } from './modules/acceptanceRecord'; // Importar las rutas de Acceptance Record
import { authorRoutes } from './modules/author';
import { roleRoutes } from './modules/role';
import { evidenceRoutes } from './modules/evidence'; // Importar las rutas de evidencia
import {actorRoutes} from './modules/actors'; // Importar las rutas de actores
import { interfaceRoutes } from './modules/interface';


dotenv.config(); // Cargar las variables de entorno desde el archivo .env

if (!process.env.PORT || !process.env.DATABASE_URL || !process.env.DIRECT_URL) {
  console.error('Faltan variables de entorno requeridas.');
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 5000;

// Habilitar CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
// static files middleware for uploads files
app.use('/uploads', express.static('uploads'));

// Definir rutas
app.use('/api/v1', interfaceRoutes); // Rutas de interfaces
app.use('/api/v1', authRoutes);
app.use('/api/v1', organizationRoutes);
app.use('/api/v1', projectRoutes);
// Ruta de las Plantillas
app.use('/api/v1', educcionRoutes);
app.use('/api/v1', ilacionRoutes);
app.use('/api/v1', specificationRoutes);
app.use('/api/v1', interviewRoutes); // Rutas de entrevistas
app.use('/api/v1', expertRoutes);  // Rutas de expertos
app.use('/api/v1', sourceRoutes);  // Rutas de fuentes
app.use('/api/v1', nfrRoutes);  // Rutas de NFR
app.use('/api/v1', riskRoutes);  // Rutas de riesgo
app.use('/api/v1', acceptanceRecordRoutes); // Rutas de Acceptance Record
app.use('/api/v1', authorRoutes); // Rutas de autores
app.use('/api/v1', roleRoutes); // Rutas de roles
app.use('/api/v1', evidenceRoutes); // Rutas de evidencia
app.use('/api/v1', actorRoutes); // Rutas de actores



// General routes
app.use('/api/v1', artifactRoutes);  // Rutas de artefactos


// Ejecutar la función de inicialización antes de iniciar el servidor
initSystem()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error(`Error al iniciar el servidor: ${error.message}`);
    process.exit(1);
  });

// Manejar señales de salida
process.on('SIGINT', () => {
  console.log('Cerrando el servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Servidor detenido.');
  process.exit(0);
});
