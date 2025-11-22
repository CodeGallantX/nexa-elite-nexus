-- Fix delete_user_completely to handle auth deletion properly
-- and update giveaway code format to NeXa<8digits>

-- Drop and recreate delete_user_completely
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
  
  -- Delete profile (this will cascade to auth.users via trigger)
  DELETE FROM public.profiles WHERE id = user_id_to_delete;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error deleting user: %', SQLERRM;
    RETURN false;
END;
$$;

-- Update create_giveaway_with_codes to use NeXa format (no dash)
DROP FUNCTION IF EXISTS public.create_giveaway_with_codes(text, text, numeric, integer, numeric);

CREATE OR REPLACE FUNCTION public.create_giveaway_with_codes(
  p_title text,
  p_message text,
  p_code_value numeric,
  p_total_codes integer,
  p_expires_in_hours numeric
)
RETURNS TABLE(giveaway_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_giveaway_id UUID;
  generated_code TEXT;
  code_exists BOOLEAN;
BEGIN
  -- Validate user role
  IF NOT (get_user_role(auth.uid()) IN ('admin', 'clan_master', 'player')) THEN
    RAISE EXCEPTION 'User does not have the required privileges';
  END IF;
  
  -- Create the giveaway
  INSERT INTO giveaways (
    created_by,
    title,
    message,
    code_value,
    total_codes,
    total_amount,
    expires_at
  )
  VALUES (
    auth.uid(),
    p_title,
    p_message,
    p_code_value,
    p_total_codes,
    p_code_value * p_total_codes,
    NOW() + (p_expires_in_hours * INTERVAL '1 hour')
  )
  RETURNING id INTO new_giveaway_id;

  -- Generate and insert giveaway codes with format: NeXa<8digits>
  FOR i IN 1..p_total_codes LOOP
    LOOP
      -- Generate 8-digit random code with NeXa prefix (no dash)
      generated_code := 'NeXa' || LPAD(FLOOR(RANDOM() * 100000000)::TEXT, 8, '0');
      
      -- Check if code already exists
      SELECT EXISTS(
        SELECT 1 FROM giveaway_codes WHERE code = generated_code
      ) INTO code_exists;
      
      -- Exit loop if code is unique
      EXIT WHEN NOT code_exists;
    END LOOP;
    
    INSERT INTO giveaway_codes (
      giveaway_id,
      code,
      value,
      expires_at
    )
    VALUES (
      new_giveaway_id,
      generated_code,
      p_code_value,
      NOW() + (p_expires_in_hours * INTERVAL '1 hour')
    );
  END LOOP;
  
  RETURN QUERY SELECT new_giveaway_id as giveaway_id;
END;
$$;