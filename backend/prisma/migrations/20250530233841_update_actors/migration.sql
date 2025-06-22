/*
  Warnings:

  - A unique constraint covering the columns `[code,projectId]` on the table `Actor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Actor" ADD COLUMN     "authorId" TEXT,
ADD COLUMN     "comments" TEXT,
ADD COLUMN     "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modificationDate" TIMESTAMP(3),
ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "version" TEXT NOT NULL DEFAULT '00.01';

-- CreateIndex
CREATE UNIQUE INDEX "Actor_code_projectId_key" ON "Actor"("code", "projectId");

-- AddForeignKey
ALTER TABLE "Actor" ADD CONSTRAINT "Actor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actor" ADD CONSTRAINT "Actor_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;
