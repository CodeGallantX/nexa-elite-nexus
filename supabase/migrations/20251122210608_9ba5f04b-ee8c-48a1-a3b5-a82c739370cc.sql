-- Fix delete_user_completely - remove auth.users deletion
-- Auth users must be deleted via Supabase Admin API, not SQL

DROP FUNCTION IF EXISTS public.delete_user_completely(uuid);

CREATE OR REPLACE FUNCTION public.delete_user_completely(user_id_to_delete uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_role user_role;
BEGIN
  -- Get current user's role
  SELECT role INTO current_user_role 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  -- Only allow admins and clan masters to delete users
  IF current_user_role NOT IN ('admin', 'clan_master') THEN
    RAISE EXCEPTION 'Only admins and clan masters can delete users';
  END IF;
  
  -- Delete related records first (in order of dependencies)
  DELETE FROM public.notifications WHERE user_id = user_id_to_delete;
  DELETE FROM public.push_subscriptions WHERE user_id = user_id_to_delete;
  DELETE FROM public.activities WHERE performed_by = user_id_to_delete OR target_user_id = user_id_to_delete;
  DELETE FROM public.bug_reports WHERE reporter_id = user_id_to_delete;
  DELETE FROM public.chat_messages WHERE user_id = user_id_to_delete;
  DELETE FROM public.attendance WHERE player_id = user_id_to_delete OR marked_by = user_id_to_delete;
  DELETE FROM public.event_participants WHERE player_id = user_id_to_delete;
  DELETE FROM public.events WHERE created_by = user_id_to_delete;
  DELETE FROM public.loadouts WHERE player_id = user_id_to_delete;
  DELETE FROM public.weapon_layouts WHERE player_id = user_id_to_delete;
  
  -- Handle giveaway-related cleanup
  UPDATE public.giveaway_codes SET redeemed_by = NULL WHERE redeemed_by = user_id_to_delete;
  DELETE FROM public.giveaways WHERE created_by = user_id_to_delete;
  
  -- Delete wallet and transactions
  DELETE FROM public.transactions WHERE wallet_id IN (
    SELECT id FROM public.wallets WHERE user_id = user_id_to_delete
  );
  DELETE FROM public.wallets WHERE user_id = user_id_to_delete;
  
  -- Delete profile only (auth user deletion must be done via Admin API)
  DELETE FROM public.profiles WHERE id = user_id_to_delete;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error deleting user: %', SQLERRM;
    RETURN false;
END;
$$;