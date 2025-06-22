/*
  Warnings:

  - Made the column `contextoId` on table `Contador` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Contador" ALTER COLUMN "contextoId" SET NOT NULL;
