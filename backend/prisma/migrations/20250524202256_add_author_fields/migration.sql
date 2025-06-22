/*
  Warnings:

  - A unique constraint covering the columns `[dni]` on the table `Author` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "canEditActors" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditArtefacts" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditEducation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditExperts" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditIlaciones" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditInterviews" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditMetrics" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditRequirements" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditSoftwareTests" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditSources" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditSpecifications" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditWorkplaceSafety" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "comments" TEXT,
ADD COLUMN     "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dni" TEXT,
ADD COLUMN     "modificationDate" TIMESTAMP(3),
ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "templateAuthorId" TEXT,
ADD COLUMN     "version" TEXT NOT NULL DEFAULT '00.01';

-- CreateIndex
CREATE UNIQUE INDEX "Author_dni_key" ON "Author"("dni");

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_templateAuthorId_fkey" FOREIGN KEY ("templateAuthorId") REFERENCES "Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;
