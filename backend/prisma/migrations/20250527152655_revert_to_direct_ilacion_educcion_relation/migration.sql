/*
  Warnings:

  - You are about to drop the column `projectId` on the `Ilacion` table. All the data in the column will be lost.
  - You are about to drop the `IlacionEduccion` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code,educcionId]` on the table `Ilacion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `educcionId` to the `Ilacion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ilacion" DROP CONSTRAINT "Ilacion_projectId_fkey";

-- DropForeignKey
ALTER TABLE "IlacionEduccion" DROP CONSTRAINT "IlacionEduccion_educcionId_fkey";

-- DropForeignKey
ALTER TABLE "IlacionEduccion" DROP CONSTRAINT "IlacionEduccion_ilacionId_fkey";

-- DropIndex
DROP INDEX "Ilacion_code_projectId_key";

-- AlterTable
ALTER TABLE "Ilacion" DROP COLUMN "projectId",
ADD COLUMN     "educcionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "IlacionEduccion";

-- CreateIndex
CREATE UNIQUE INDEX "Ilacion_code_educcionId_key" ON "Ilacion"("code", "educcionId");

-- AddForeignKey
ALTER TABLE "Ilacion" ADD CONSTRAINT "Ilacion_educcionId_fkey" FOREIGN KEY ("educcionId") REFERENCES "Educcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
