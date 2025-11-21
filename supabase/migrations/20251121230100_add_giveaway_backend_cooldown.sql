-- Function to check if user can redeem giveaway (cooldown check)
CREATE OR REPLACE FUNCTION public.can_redeem_giveaway(p_user_id UUID)
RETURNS TABLE(can_redeem BOOLEAN, cooldown_seconds INTEGER, last_redeemed_at TIMESTAMP WITH TIME ZONE)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_last_redeemed TIMESTAMP WITH TIME ZONE;
  v_cooldown_seconds INTEGER := 60; -- 60 seconds cooldown
  v_time_since_last INTEGER;
BEGIN
  -- Get the last time user redeemed a giveaway
  SELECT last_giveaway_redeemed_at INTO v_last_redeemed
  FROM public.profiles
  WHERE id = p_user_id;
  
  -- If never redeemed, allow
  IF v_last_redeemed IS NULL THEN
    RETURN QUERY SELECT TRUE, 0, NULL::TIMESTAMP WITH TIME ZONE;
    RETURN;
  END IF;
  
  -- Calculate seconds since last redemption
  v_time_since_last := EXTRACT(EPOCH FROM (NOW() - v_last_redeemed))::INTEGER;
  
  -- Check if cooldown has passed
  IF v_time_since_last >= v_cooldown_seconds THEN
    RETURN QUERY SELECT TRUE, 0, v_last_redeemed;
  ELSE
    RETURN QUERY SELECT FALSE, (v_cooldown_seconds - v_time_since_last), v_last_redeemed;
  END IF;
END;
$$;

-- Update the redeem_giveaway_code function to include cooldown check
-- Drop the function first to allow changing return type from JSONB to JSON
DROP FUNCTION IF EXISTS public.redeem_giveaway_code(TEXT);

CREATE OR REPLACE FUNCTION public.redeem_giveaway_code(p_code TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_code_record RECORD;
  v_giveaway_record RECORD;
  v_new_balance NUMERIC;
  v_wallet_id UUID;
  v_can_redeem BOOLEAN;
  v_cooldown_seconds INTEGER;
BEGIN
  -- Get the current user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Unauthorized');
  END IF;
  
  -- Check cooldown
  SELECT can_redeem, cooldown_seconds INTO v_can_redeem, v_cooldown_seconds
  FROM public.can_redeem_giveaway(v_user_id);
  
  IF NOT v_can_redeem THEN
    RETURN json_build_object(
      'success', false, 
      'message', 'Cooldown active',
      'cooldown_seconds', v_cooldown_seconds
    );
  END IF;
  
  -- Get the code record
  SELECT * INTO v_code_record
  FROM public.giveaway_codes
  WHERE code = p_code;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Invalid code');
  END IF;
  
  -- Check if already redeemed
  IF v_code_record.is_redeemed THEN
    RETURN json_build_object('success', false, 'message', 'Code already redeemed');
  END IF;
  
  -- Get giveaway record
  SELECT * INTO v_giveaway_record
  FROM public.giveaways
  WHERE id = v_code_record.giveaway_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Invalid code');
  END IF;
  
  -- Check if expired
  IF v_giveaway_record.expires_at < NOW() THEN
    RETURN json_build_object('success', false, 'message', 'Code expired');
  END IF;
  
  -- Mark code as redeemed
  UPDATE public.giveaway_codes
  SET is_redeemed = true,
      redeemed_at = NOW(),
      redeemed_by = v_user_id
  WHERE code = p_code;
  
  -- Update giveaway redeemed count
  UPDATE public.giveaways
  SET redeemed_count = redeemed_count + 1
  WHERE id = v_code_record.giveaway_id;
  
  -- Credit user wallet
  SELECT id INTO v_wallet_id
  FROM public.wallets
  WHERE user_id = v_user_id;
  
  IF v_wallet_id IS NULL THEN
    -- Create wallet if it doesn't exist
    INSERT INTO public.wallets (user_id, balance, currency)
    VALUES (v_user_id, v_giveaway_record.code_value, 'NGN')
    RETURNING id, balance INTO v_wallet_id, v_new_balance;
  ELSE
    -- Update existing wallet
    UPDATE public.wallets
    SET balance = balance + v_giveaway_record.code_value
    WHERE id = v_wallet_id
    RETURNING balance INTO v_new_balance;
  END IF;
  
  -- Create transaction record
  INSERT INTO public.transactions (wallet_id, type, amount, status, reference, currency)
  VALUES (
    v_wallet_id,
    'giveaway_redeemed',
    v_giveaway_record.code_value,
    'completed',
    'giveaway_' || p_code || '_' || EXTRACT(EPOCH FROM NOW())::TEXT,
    'NGN'
  );
  
  -- Update user's last giveaway redeemed timestamp
  UPDATE public.profiles
  SET last_giveaway_redeemed_at = NOW()
  WHERE id = v_user_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Code redeemed successfully',
    'amount', v_giveaway_record.code_value,
    'new_balance', v_new_balance
  );
END;
$$;

-- Grant execute to authenticated users only for their own redemptions (function checks auth.uid())
GRANT EXECUTE ON FUNCTION public.can_redeem_giveaway(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_giveaway_code(TEXT) TO authenticated;
