/*
  Warnings:

  - A unique constraint covering the columns `[code,ilacionId]` on the table `Specification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Specification_code_key";

-- AlterTable
ALTER TABLE "Specification" ALTER COLUMN "version" SET DEFAULT '01.00';

-- CreateIndex
CREATE UNIQUE INDEX "Specification_code_ilacionId_key" ON "Specification"("code", "ilacionId");
