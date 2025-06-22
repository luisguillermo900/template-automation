-- Baseline migration to align migration history with current database state
-- This migration acknowledges existing schema changes:
-- 1. Author table: removed unique constraint on dni
-- 2. Evidence table: changed unique constraint
-- 3. Role table: added columns code, comments, status

-- This is an empty migration as the changes are already applied