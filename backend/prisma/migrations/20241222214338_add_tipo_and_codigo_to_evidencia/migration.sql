/*
  Warnings:

  - Added the required column `tipo` to the `Evidencia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evidencia" ADD COLUMN     "tipo" TEXT NOT NULL;
