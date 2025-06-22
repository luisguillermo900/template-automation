-- AlterTable
ALTER TABLE "NonFunctionalRequirement" ADD COLUMN     "sourceNfrCode" TEXT;

-- AlterTable
ALTER TABLE "Risk" ADD COLUMN     "modificationDate" TIMESTAMP(3),
ADD COLUMN     "sourceRiskCode" TEXT;
