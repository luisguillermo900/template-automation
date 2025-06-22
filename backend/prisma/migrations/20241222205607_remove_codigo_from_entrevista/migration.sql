/*
  Warnings:

  - You are about to drop the column `codigo` on the `Entrevista` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Entrevista_codigo_key";

-- AlterTable
ALTER TABLE "Entrevista" DROP COLUMN "codigo";
