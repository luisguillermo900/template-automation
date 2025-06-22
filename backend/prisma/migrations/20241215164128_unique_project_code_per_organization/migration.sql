/*
  Warnings:

  - A unique constraint covering the columns `[codigo,organizacionId]` on the table `Proyecto` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Proyecto_codigo_key";

-- CreateIndex
CREATE UNIQUE INDEX "Proyecto_codigo_organizacionId_key" ON "Proyecto"("codigo", "organizacionId");
