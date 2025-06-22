-- Elimina el índice único antiguo si existe
DROP INDEX IF EXISTS "Evidence_code_key";

-- Crea el índice único compuesto correcto
CREATE UNIQUE INDEX "Evidence_code_interviewId_key" ON "Evidence" ("code", "interviewId");