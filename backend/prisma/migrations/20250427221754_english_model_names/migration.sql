/*
  Warnings:

  - You are about to drop the column `codigo` on the `Actor` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `Actor` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Actor` table. All the data in the column will be lost.
  - You are about to drop the column `proyectoId` on the `Actor` table. All the data in the column will be lost.
  - You are about to drop the column `rolId` on the `Actor` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `Actor` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `Conclusion` table. All the data in the column will be lost.
  - You are about to drop the column `entrevistaId` on the `Conclusion` table. All the data in the column will be lost.
  - You are about to drop the column `codigo` on the `Educcion` table. All the data in the column will be lost.
  - You are about to drop the column `comentario` on the `Educcion` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `Educcion` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `Educcion` table. All the data in the column will be lost.
  - You are about to drop the column `fechaCreacion` on the `Educcion` table. All the data in the column will be lost.
  - You are about to drop the column `fechaModificacion` on the `Educcion` table. All the data in the column will be lost.
  - You are about to drop the column `importancia` on the `Educcion` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Educcion` table. All the data in the column will be lost.
  - You are about to drop the column `proyectoId` on the `Educcion` table. All the data in the column will be lost.
  - You are about to drop the column `codigo` on the `Ilacion` table. All the data in the column will be lost.
  - You are about to drop the column `comentario` on the `Ilacion` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `Ilacion` table. All the data in the column will be lost.
  - You are about to drop the column `fechaCreacion` on the `Ilacion` table. All the data in the column will be lost.
  - You are about to drop the column `fechaModificacion` on the `Ilacion` table. All the data in the column will be lost.
  - You are about to drop the column `importancia` on the `Ilacion` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Ilacion` table. All the data in the column will be lost.
  - You are about to drop the column `postcondicion` on the `Ilacion` table. All the data in the column will be lost.
  - You are about to drop the column `precondicion` on the `Ilacion` table. All the data in the column will be lost.
  - You are about to drop the column `procedimiento` on the `Ilacion` table. All the data in the column will be lost.
  - You are about to drop the `ActaAceptacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Agenda` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Artefacto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Autor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contador` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Entrevista` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Especificacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Evidencia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Experto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Fuente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Interfaz` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organizacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Proyecto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RelacionEntidad` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RequerimientoNoFuncional` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Riesgo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rol` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `Actor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Educcion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Ilacion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Actor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Actor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `Actor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `Actor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Actor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Actor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Conclusion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interviewId` to the `Conclusion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Educcion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Educcion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `importance` to the `Educcion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Educcion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `Educcion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Educcion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Ilacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `importance` to the `Ilacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Ilacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postcondition` to the `Ilacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precondition` to the `Ilacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `procedure` to the `Ilacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Ilacion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ActaAceptacion" DROP CONSTRAINT "ActaAceptacion_proyectoId_fkey";

-- DropForeignKey
ALTER TABLE "Actor" DROP CONSTRAINT "Actor_proyectoId_fkey";

-- DropForeignKey
ALTER TABLE "Actor" DROP CONSTRAINT "Actor_rolId_fkey";

-- DropForeignKey
ALTER TABLE "Agenda" DROP CONSTRAINT "Agenda_entrevistaId_fkey";

-- DropForeignKey
ALTER TABLE "Autor" DROP CONSTRAINT "Autor_rolId_fkey";

-- DropForeignKey
ALTER TABLE "Conclusion" DROP CONSTRAINT "Conclusion_entrevistaId_fkey";

-- DropForeignKey
ALTER TABLE "Educcion" DROP CONSTRAINT "Educcion_proyectoId_fkey";

-- DropForeignKey
ALTER TABLE "Entrevista" DROP CONSTRAINT "Entrevista_autorId_fkey";

-- DropForeignKey
ALTER TABLE "Entrevista" DROP CONSTRAINT "Entrevista_proyectoId_fkey";

-- DropForeignKey
ALTER TABLE "Especificacion" DROP CONSTRAINT "Especificacion_ilacionId_fkey";

-- DropForeignKey
ALTER TABLE "Evidencia" DROP CONSTRAINT "Evidencia_entrevistaId_fkey";

-- DropForeignKey
ALTER TABLE "Experto" DROP CONSTRAINT "Experto_proyectoId_fkey";

-- DropForeignKey
ALTER TABLE "Fuente" DROP CONSTRAINT "Fuente_proyectoId_fkey";

-- DropForeignKey
ALTER TABLE "Interfaz" DROP CONSTRAINT "Interfaz_proyectoId_fkey";

-- DropForeignKey
ALTER TABLE "Proyecto" DROP CONSTRAINT "Proyecto_organizacionId_fkey";

-- DropForeignKey
ALTER TABLE "RelacionEntidad" DROP CONSTRAINT "RelacionEntidad_proyectoId_fkey";

-- DropForeignKey
ALTER TABLE "RequerimientoNoFuncional" DROP CONSTRAINT "RequerimientoNoFuncional_proyectoId_fkey";

-- DropForeignKey
ALTER TABLE "Riesgo" DROP CONSTRAINT "Riesgo_proyectoId_fkey";

-- DropIndex
DROP INDEX "Actor_codigo_key";

-- DropIndex
DROP INDEX "Educcion_codigo_key";

-- DropIndex
DROP INDEX "Ilacion_codigo_key";

-- AlterTable
ALTER TABLE "Actor" DROP COLUMN "codigo",
DROP COLUMN "estado",
DROP COLUMN "nombre",
DROP COLUMN "proyectoId",
DROP COLUMN "rolId",
DROP COLUMN "tipo",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "roleId" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Conclusion" DROP COLUMN "descripcion",
DROP COLUMN "entrevistaId",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "interviewId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Educcion" DROP COLUMN "codigo",
DROP COLUMN "comentario",
DROP COLUMN "descripcion",
DROP COLUMN "estado",
DROP COLUMN "fechaCreacion",
DROP COLUMN "fechaModificacion",
DROP COLUMN "importancia",
DROP COLUMN "nombre",
DROP COLUMN "proyectoId",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "importance" TEXT NOT NULL,
ADD COLUMN     "modificationDate" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ilacion" DROP COLUMN "codigo",
DROP COLUMN "comentario",
DROP COLUMN "estado",
DROP COLUMN "fechaCreacion",
DROP COLUMN "fechaModificacion",
DROP COLUMN "importancia",
DROP COLUMN "nombre",
DROP COLUMN "postcondicion",
DROP COLUMN "precondicion",
DROP COLUMN "procedimiento",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "importance" TEXT NOT NULL,
ADD COLUMN     "modificationDate" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "postcondition" TEXT NOT NULL,
ADD COLUMN     "precondition" TEXT NOT NULL,
ADD COLUMN     "procedure" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;

-- DropTable
DROP TABLE "ActaAceptacion";

-- DropTable
DROP TABLE "Agenda";

-- DropTable
DROP TABLE "Artefacto";

-- DropTable
DROP TABLE "Autor";

-- DropTable
DROP TABLE "Contador";

-- DropTable
DROP TABLE "Entrevista";

-- DropTable
DROP TABLE "Especificacion";

-- DropTable
DROP TABLE "Evidencia";

-- DropTable
DROP TABLE "Experto";

-- DropTable
DROP TABLE "Fuente";

-- DropTable
DROP TABLE "Interfaz";

-- DropTable
DROP TABLE "Organizacion";

-- DropTable
DROP TABLE "Proyecto";

-- DropTable
DROP TABLE "RelacionEntidad";

-- DropTable
DROP TABLE "RequerimientoNoFuncional";

-- DropTable
DROP TABLE "Riesgo";

-- DropTable
DROP TABLE "Rol";

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificationDate" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "legalRepresentative" TEXT,
    "representativePhone" TEXT,
    "taxId" TEXT,
    "contact" TEXT,
    "contactPhone" TEXT,
    "status" TEXT,
    "comments" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '00.01',
    "name" TEXT NOT NULL,
    "description" TEXT,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificationDate" TIMESTAMP(3),
    "status" TEXT,
    "comments" TEXT,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcceptanceRecord" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AcceptanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "interviewName" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "interviewDate" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "intervieweeName" TEXT NOT NULL,
    "intervieweeRole" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "observations" TEXT,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaItem" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,

    CONSTRAINT "AgendaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "evidenceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file" TEXT NOT NULL,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interface" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filePath" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Interface_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NonFunctionalRequirement" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificationDate" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "qualityAttribute" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "importance" TEXT NOT NULL,
    "comment" TEXT,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "NonFunctionalRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specification" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificationDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "importance" TEXT NOT NULL,
    "ilacionId" TEXT NOT NULL,
    "precondition" TEXT NOT NULL,
    "procedure" TEXT NOT NULL,
    "postcondition" TEXT NOT NULL,
    "comment" TEXT,

    CONSTRAINT "Specification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "paternalSurname" TEXT,
    "maternalSurname" TEXT,
    "alias" TEXT,
    "status" TEXT NOT NULL,
    "roleId" TEXT,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificationDate" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "comment" TEXT,
    "status" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expert" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificationDate" TIMESTAMP(3),
    "paternalSurname" TEXT NOT NULL,
    "maternalSurname" TEXT,
    "firstName" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "comment" TEXT,
    "status" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Expert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityRelationship" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "relationType" TEXT NOT NULL,
    "relatedId" TEXT NOT NULL,

    CONSTRAINT "EntityRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Risk" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "registryCode" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "probability" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comments" TEXT,

    CONSTRAINT "Risk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artifact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mnemonic" TEXT NOT NULL,

    CONSTRAINT "Artifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Counter" (
    "id" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "contextId" TEXT NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Counter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_code_key" ON "Organization"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Project_code_organizationId_key" ON "Project"("code", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Evidence_code_key" ON "Evidence"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Interface_code_key" ON "Interface"("code");

-- CreateIndex
CREATE UNIQUE INDEX "NonFunctionalRequirement_code_key" ON "NonFunctionalRequirement"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Specification_code_key" ON "Specification"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Author_code_key" ON "Author"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Source_code_key" ON "Source"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Expert_code_key" ON "Expert"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Risk_code_key" ON "Risk"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Artifact_name_key" ON "Artifact"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Artifact_mnemonic_key" ON "Artifact"("mnemonic");

-- CreateIndex
CREATE UNIQUE INDEX "Counter_entity_contextId_key" ON "Counter"("entity", "contextId");

-- CreateIndex
CREATE UNIQUE INDEX "Actor_code_key" ON "Actor"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Educcion_code_key" ON "Educcion"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Ilacion_code_key" ON "Ilacion"("code");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcceptanceRecord" ADD CONSTRAINT "AcceptanceRecord_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaItem" ADD CONSTRAINT "AgendaItem_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conclusion" ADD CONSTRAINT "Conclusion_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interface" ADD CONSTRAINT "Interface_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonFunctionalRequirement" ADD CONSTRAINT "NonFunctionalRequirement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Educcion" ADD CONSTRAINT "Educcion_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Specification" ADD CONSTRAINT "Specification_ilacionId_fkey" FOREIGN KEY ("ilacionId") REFERENCES "Ilacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actor" ADD CONSTRAINT "Actor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actor" ADD CONSTRAINT "Actor_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expert" ADD CONSTRAINT "Expert_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityRelationship" ADD CONSTRAINT "EntityRelationship_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Risk" ADD CONSTRAINT "Risk_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
