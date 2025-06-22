/*
  Warnings:

  - A unique constraint covering the columns `[code,educcionId]` on the table `Ilacion` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Ilacion_code_key";

-- AlterTable
ALTER TABLE "Ilacion" ALTER COLUMN "version" SET DEFAULT '01.00';

-- CreateIndex
CREATE UNIQUE INDEX "Ilacion_code_educcionId_key" ON "Ilacion"("code", "educcionId");
