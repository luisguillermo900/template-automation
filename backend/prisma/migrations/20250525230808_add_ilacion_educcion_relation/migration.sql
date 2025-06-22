/*
  Warnings:

  - You are about to drop the column `educcionId` on the `Ilacion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Evidence` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code,projectId]` on the table `Ilacion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectId` to the `Ilacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ilacion" DROP CONSTRAINT "Ilacion_educcionId_fkey";

-- DropIndex
DROP INDEX "Author_dni_key";

-- DropIndex
DROP INDEX "Evidence_code_interviewId_key";

-- DropIndex
DROP INDEX "Ilacion_code_educcionId_key";

-- AlterTable
ALTER TABLE "Ilacion" DROP COLUMN "educcionId",
ADD COLUMN     "projectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "comments" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Active';

-- CreateTable
CREATE TABLE "IlacionEduccion" (
    "id" TEXT NOT NULL,
    "ilacionId" TEXT NOT NULL,
    "educcionId" TEXT NOT NULL,

    CONSTRAINT "IlacionEduccion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IlacionEduccion_ilacionId_educcionId_key" ON "IlacionEduccion"("ilacionId", "educcionId");

-- CreateIndex
CREATE UNIQUE INDEX "Evidence_code_key" ON "Evidence"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Ilacion_code_projectId_key" ON "Ilacion"("code", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_code_key" ON "Role"("code");

-- AddForeignKey
ALTER TABLE "Ilacion" ADD CONSTRAINT "Ilacion_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IlacionEduccion" ADD CONSTRAINT "IlacionEduccion_ilacionId_fkey" FOREIGN KEY ("ilacionId") REFERENCES "Ilacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IlacionEduccion" ADD CONSTRAINT "IlacionEduccion_educcionId_fkey" FOREIGN KEY ("educcionId") REFERENCES "Educcion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
