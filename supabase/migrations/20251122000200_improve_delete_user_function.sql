-- Improve delete_user_completely function to handle all cascading deletes properly
DROP FUNCTION IF EXISTS public.delete_user_completely(UUID);

CREATE OR REPLACE FUNCTION public.delete_user_completely(user_id_to_delete UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- First, set all activities references to NULL (they should cascade but let's be explicit)
  UPDATE public.activities 
  SET performed_by = NULL 
  WHERE performed_by = user_id_to_delete;
  
  UPDATE public.activities 
  SET target_user_id = NULL 
  WHERE target_user_id = user_id_to_delete;
  
  -- Delete from profiles (this should cascade to other tables via ON DELETE CASCADE)
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
