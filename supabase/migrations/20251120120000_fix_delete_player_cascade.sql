
ALTER TABLE public.activities
DROP CONSTRAINT IF EXISTS activities_target_user_id_fkey,
ADD CONSTRAINT activities_target_user_id_fkey
  FOREIGN KEY (target_user_id)
  REFERENCES public.profiles(id)
  ON DELETE CASCADE;
