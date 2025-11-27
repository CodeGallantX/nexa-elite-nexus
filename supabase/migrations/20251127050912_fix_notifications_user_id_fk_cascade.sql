-- Fix notifications.user_id foreign key to use ON DELETE CASCADE
-- This ensures that when a user profile is deleted, all related notifications are automatically deleted
-- Fixes error: "update or delete on table 'profiles' violates foreign key constraint 'notifications_user_id_fkey' on table 'notifications'"

-- First, drop the existing foreign key constraint
ALTER TABLE public.notifications 
DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

-- Re-add the foreign key constraint with ON DELETE CASCADE
ALTER TABLE public.notifications
ADD CONSTRAINT notifications_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;
