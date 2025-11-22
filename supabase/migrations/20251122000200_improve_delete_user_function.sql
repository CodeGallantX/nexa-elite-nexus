-- Improve delete_user_completely function to handle all cascading deletes properly
DROP FUNCTION IF EXISTS public.delete_user_completely(UUID);

CREATE OR REPLACE FUNCTION public.delete_user_completely(user_id_to_delete UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete from profiles first
  -- The foreign key constraints with ON DELETE SET NULL will automatically
  -- handle updating activities references
  -- The trigger has been updated to handle this gracefully
  -- Cascades will handle related records in other tables
  DELETE FROM public.profiles WHERE id = user_id_to_delete;
  
  -- Delete the auth user
  DELETE FROM auth.users WHERE id = user_id_to_delete;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to delete user: %', SQLERRM;
END;
$$;

-- Grant execute permission to authenticated users (restricted by RLS in application)
GRANT EXECUTE ON FUNCTION public.delete_user_completely(UUID) TO authenticated;
