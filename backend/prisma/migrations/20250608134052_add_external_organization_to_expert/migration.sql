/*
  Warnings:

  - A unique constraint covering the columns `[code,projectId]` on the table `Expert` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Actor_code_key";

-- AlterTable
ALTER TABLE "Expert" ADD COLUMN     "externalOrganization" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Expert_code_projectId_key" ON "Expert"("code", "projectId");
