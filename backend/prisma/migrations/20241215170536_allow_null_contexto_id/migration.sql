-- AlterTable
ALTER TABLE "Contador" ALTER COLUMN "contextoId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Proyecto" ALTER COLUMN "version" SET DEFAULT '00.01';
