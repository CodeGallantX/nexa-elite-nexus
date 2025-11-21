-- Create function to delete user completely
CREATE OR REPLACE FUNCTION public.delete_user_completely(user_id_to_delete UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete from profiles (cascades will handle related records)
  DELETE FROM public.profiles WHERE id = user_id_to_delete;
  
  -- Delete the auth user
  DELETE FROM auth.users WHERE id = user_id_to_delete;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to delete user: %', SQLERRM;
    RETURN FALSE;
END;
$$;

-- Grant execute permission to authenticated users (restricted by RLS in application)
GRANT EXECUTE ON FUNCTION public.delete_user_completely(UUID) TO authenticated;
