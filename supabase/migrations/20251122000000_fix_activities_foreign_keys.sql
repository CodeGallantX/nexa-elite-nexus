-- Fix both foreign keys in activities table to properly reference profiles
-- This allows proper cascade deletion when a player is deleted

ALTER TABLE public.activities
DROP CONSTRAINT IF EXISTS activities_performed_by_fkey,
ADD CONSTRAINT activities_performed_by_fkey
  FOREIGN KEY (performed_by)
  REFERENCES public.profiles(id)
  ON DELETE SET NULL;

ALTER TABLE public.activities
DROP CONSTRAINT IF EXISTS activities_target_user_id_fkey,
ADD CONSTRAINT activities_target_user_id_fkey
  FOREIGN KEY (target_user_id)
  REFERENCES public.profiles(id)
  ON DELETE SET NULL;
