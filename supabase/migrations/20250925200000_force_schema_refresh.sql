
-- This is a dummy migration to force a schema refresh
ALTER TABLE public.activities ADD COLUMN dummy_column TEXT;
ALTER TABLE public.activities DROP COLUMN dummy_column;
