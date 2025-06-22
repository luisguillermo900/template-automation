import { PrismaClient } from '@prisma/client';

// Singleton para toda la aplicación
export const prisma = new PrismaClient();