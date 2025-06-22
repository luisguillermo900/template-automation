/*
  Warnings:

  - A unique constraint covering the columns `[code,interviewId]` on the table `Evidence` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code,projectId]` on the table `Source` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Evidence_code_interviewId_key" ON "Evidence"("code", "interviewId");

-- CreateIndex
CREATE UNIQUE INDEX "Source_code_projectId_key" ON "Source"("code", "projectId");
