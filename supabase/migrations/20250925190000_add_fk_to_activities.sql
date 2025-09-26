
-- Add foreign key constraints to activities table
-- ALTER TABLE public.activities
-- ADD CONSTRAINT activities_performed_by_fkey FOREIGN KEY (performed_by) REFERENCES public.profiles(id) ON DELETE SET NULL,
-- ADD CONSTRAINT activities_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
