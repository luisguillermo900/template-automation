/*
  Warnings:

  - You are about to drop the column `codigo` on the `Agenda` table. All the data in the column will be lost.
  - You are about to drop the column `codigo` on the `Conclusion` table. All the data in the column will be lost.
  - Added the required column `nombreEntrevista` to the `Entrevista` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Agenda_codigo_key";

-- DropIndex
DROP INDEX "Conclusion_codigo_key";

-- AlterTable
ALTER TABLE "Agenda" DROP COLUMN "codigo";

-- AlterTable
ALTER TABLE "Conclusion" DROP COLUMN "codigo";

-- AlterTable
ALTER TABLE "Entrevista" ADD COLUMN     "nombreEntrevista" TEXT NOT NULL;
