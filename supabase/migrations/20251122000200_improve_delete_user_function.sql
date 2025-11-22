-- Improve delete_user_completely function to handle all cascading deletes properly
DROP FUNCTION IF EXISTS public.delete_user_completely(UUID);

CREATE OR REPLACE FUNCTION public.delete_user_completely(user_id_to_delete UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set all existing activities references to NULL
  -- This ensures no orphaned references remain
  UPDATE public.activities 
  SET performed_by = NULL 
  WHERE performed_by = user_id_to_delete;
  
  UPDATE public.activities 
  SET target_user_id = NULL 
  WHERE target_user_id = user_id_to_delete;
  
  -- Delete from profiles first
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
