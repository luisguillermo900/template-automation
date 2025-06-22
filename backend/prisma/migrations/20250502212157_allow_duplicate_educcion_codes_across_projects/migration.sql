/*
  Warnings:

  - A unique constraint covering the columns `[code,projectId]` on the table `Educcion` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Educcion" DROP CONSTRAINT "Educcion_projectId_fkey";

-- DropIndex
DROP INDEX "Educcion_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "Educcion_code_projectId_key" ON "Educcion"("code", "projectId");

-- AddForeignKey
ALTER TABLE "Educcion" ADD CONSTRAINT "Educcion_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
