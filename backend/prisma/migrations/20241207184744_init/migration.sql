-- CreateTable
CREATE TABLE "Organizacion" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3),
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "representanteLegal" TEXT,
    "telefonoRepresentante" TEXT,
    "ruc" TEXT,
    "contacto" TEXT,
    "telefonoContacto" TEXT,
    "estado" TEXT,
    "comentarios" TEXT,

    CONSTRAINT "Organizacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proyecto" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3),
    "estado" TEXT,
    "comentarios" TEXT,
    "organizacionId" TEXT NOT NULL,

    CONSTRAINT "Proyecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActaAceptacion" (
    "id" TEXT NOT NULL,
    "proyectoId" TEXT NOT NULL,
    "rutaArchivo" TEXT NOT NULL,
    "tipoArchivo" TEXT NOT NULL,
    "fechaSubida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActaAceptacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrevista" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "fechaEntrevista" TIMESTAMP(3) NOT NULL,
    "autorId" TEXT NOT NULL,
    "nombreEntrevistado" TEXT NOT NULL,
    "cargoEntrevistado" TEXT,
    "horaInicio" TIMESTAMP(3) NOT NULL,
    "horaFin" TIMESTAMP(3),
    "observaciones" TEXT,
    "proyectoId" TEXT NOT NULL,

    CONSTRAINT "Entrevista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agenda" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "entrevistaId" TEXT NOT NULL,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conclusion" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "entrevistaId" TEXT NOT NULL,

    CONSTRAINT "Conclusion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidencia" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "entrevistaId" TEXT NOT NULL,
    "fechaEvidencia" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivo" TEXT NOT NULL,

    CONSTRAINT "Evidencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interfaz" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivoRuta" TEXT NOT NULL,
    "archivoTipo" TEXT NOT NULL,
    "proyectoId" TEXT NOT NULL,

    CONSTRAINT "Interfaz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequerimientoNoFuncional" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3),
    "nombre" TEXT NOT NULL,
    "atributoCalidad" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "importancia" TEXT NOT NULL,
    "comentario" TEXT,
    "proyectoId" TEXT NOT NULL,

    CONSTRAINT "RequerimientoNoFuncional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Educcion" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3),
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "comentario" TEXT,
    "estado" TEXT NOT NULL,
    "importancia" TEXT NOT NULL,
    "proyectoId" TEXT NOT NULL,

    CONSTRAINT "Educcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ilacion" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3),
    "estado" TEXT NOT NULL,
    "importancia" TEXT NOT NULL,
    "educcionId" TEXT NOT NULL,
    "precondicion" TEXT NOT NULL,
    "procedimiento" TEXT NOT NULL,
    "postcondicion" TEXT NOT NULL,
    "comentario" TEXT,

    CONSTRAINT "Ilacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Especificacion" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3),
    "estado" TEXT NOT NULL,
    "importancia" TEXT NOT NULL,
    "ilacionId" TEXT NOT NULL,
    "precondicion" TEXT NOT NULL,
    "procedimiento" TEXT NOT NULL,
    "postcondicion" TEXT NOT NULL,
    "comentario" TEXT,

    CONSTRAINT "Especificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Autor" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidoPaterno" TEXT,
    "apellidoMaterno" TEXT,
    "alias" TEXT,
    "estado" TEXT NOT NULL,
    "rolId" TEXT,

    CONSTRAINT "Autor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actor" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "proyectoId" TEXT NOT NULL,
    "rolId" TEXT NOT NULL,

    CONSTRAINT "Actor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fuente" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3),
    "nombre" TEXT NOT NULL,
    "comentario" TEXT,
    "estado" TEXT NOT NULL,
    "proyectoId" TEXT NOT NULL,

    CONSTRAINT "Fuente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experto" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3),
    "apellidoPaterno" TEXT NOT NULL,
    "apellidoMaterno" TEXT,
    "nombres" TEXT NOT NULL,
    "experiencia" TEXT NOT NULL,
    "comentario" TEXT,
    "estado" TEXT NOT NULL,
    "proyectoId" TEXT NOT NULL,

    CONSTRAINT "Experto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelacionEntidad" (
    "id" TEXT NOT NULL,
    "proyectoId" TEXT NOT NULL,
    "tipoEntidad" TEXT NOT NULL,
    "entidadId" TEXT NOT NULL,
    "tipoRelacion" TEXT NOT NULL,
    "relacionadoId" TEXT NOT NULL,

    CONSTRAINT "RelacionEntidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Riesgo" (
    "id" TEXT NOT NULL,
    "proyectoId" TEXT NOT NULL,
    "tipoEntidad" TEXT NOT NULL,
    "codigoRegistro" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "impacto" TEXT NOT NULL,
    "probabilidad" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comentarios" TEXT,

    CONSTRAINT "Riesgo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artefacto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nemonico" TEXT NOT NULL,

    CONSTRAINT "Artefacto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organizacion_codigo_key" ON "Organizacion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Proyecto_codigo_key" ON "Proyecto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Entrevista_codigo_key" ON "Entrevista"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Agenda_codigo_key" ON "Agenda"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Conclusion_codigo_key" ON "Conclusion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Evidencia_codigo_key" ON "Evidencia"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Interfaz_codigo_key" ON "Interfaz"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "RequerimientoNoFuncional_codigo_key" ON "RequerimientoNoFuncional"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Educcion_codigo_key" ON "Educcion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Ilacion_codigo_key" ON "Ilacion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Especificacion_codigo_key" ON "Especificacion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Autor_codigo_key" ON "Autor"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Actor_codigo_key" ON "Actor"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Fuente_codigo_key" ON "Fuente"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Experto_codigo_key" ON "Experto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Riesgo_codigo_key" ON "Riesgo"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Artefacto_nombre_key" ON "Artefacto"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Artefacto_nemonico_key" ON "Artefacto"("nemonico");

-- AddForeignKey
ALTER TABLE "Proyecto" ADD CONSTRAINT "Proyecto_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActaAceptacion" ADD CONSTRAINT "ActaAceptacion_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrevista" ADD CONSTRAINT "Entrevista_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Autor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrevista" ADD CONSTRAINT "Entrevista_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_entrevistaId_fkey" FOREIGN KEY ("entrevistaId") REFERENCES "Entrevista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conclusion" ADD CONSTRAINT "Conclusion_entrevistaId_fkey" FOREIGN KEY ("entrevistaId") REFERENCES "Entrevista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidencia" ADD CONSTRAINT "Evidencia_entrevistaId_fkey" FOREIGN KEY ("entrevistaId") REFERENCES "Entrevista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interfaz" ADD CONSTRAINT "Interfaz_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequerimientoNoFuncional" ADD CONSTRAINT "RequerimientoNoFuncional_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Educcion" ADD CONSTRAINT "Educcion_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ilacion" ADD CONSTRAINT "Ilacion_educcionId_fkey" FOREIGN KEY ("educcionId") REFERENCES "Educcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Especificacion" ADD CONSTRAINT "Especificacion_ilacionId_fkey" FOREIGN KEY ("ilacionId") REFERENCES "Ilacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Autor" ADD CONSTRAINT "Autor_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actor" ADD CONSTRAINT "Actor_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actor" ADD CONSTRAINT "Actor_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fuente" ADD CONSTRAINT "Fuente_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experto" ADD CONSTRAINT "Experto_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelacionEntidad" ADD CONSTRAINT "RelacionEntidad_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Riesgo" ADD CONSTRAINT "Riesgo_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
