-- CreateTable
CREATE TABLE "Contador" (
    "id" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "contextoId" TEXT NOT NULL,
    "contador" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Contador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contador_entidad_contextoId_key" ON "Contador"("entidad", "contextoId");
