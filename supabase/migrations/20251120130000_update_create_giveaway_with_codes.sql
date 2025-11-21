-- Drop conflicting versions of create_giveaway_with_codes
DROP FUNCTION IF EXISTS public.create_giveaway_with_codes(text, text, numeric, integer, numeric);
DROP FUNCTION IF EXISTS public.create_giveaway_with_codes(text, text, integer, integer, integer);

-- create_giveaway_with_codes
CREATE OR REPLACE FUNCTION public.create_giveaway_with_codes(
  p_title TEXT,
  p_message TEXT,
  p_code_value NUMERIC,
  p_total_codes INT,
  p_expires_in_hours INT
)
RETURNS TABLE (
  giveaway_id UUID
) AS $$
DECLARE
  v_creator_id UUID;
  v_wallet_id UUID;
  v_balance DECIMAL(10, 2);
  v_total_amount DECIMAL(10, 2);
  new_giveaway_id UUID;
  new_transaction_id UUID;
  i INTEGER;
BEGIN
  -- Get creator info
  v_creator_id := auth.uid();
  IF v_creator_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Validate user role
  IF NOT (get_user_role(v_creator_id) IN ('admin', 'clan_master')) THEN
    RAISE EXCEPTION 'User does not have the required privileges';
  END IF;
  
  -- Calculate total amount
  v_total_amount := p_code_value * p_total_codes;

  -- Check wallet balance
  SELECT id, balance INTO v_wallet_id, v_balance
  FROM wallets WHERE user_id = v_creator_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Wallet not found';
  END IF;

  IF v_balance < v_total_amount THEN
    RAISE EXCEPTION 'Insufficient funds. You need ₦% but only have ₦%', v_total_amount, v_balance;
  END IF;

  -- Deduct from wallet
  UPDATE wallets 
  SET balance = balance - v_total_amount, updated_at = NOW()
  WHERE id = v_wallet_id;

  -- Record transaction
  INSERT INTO transactions (wallet_id, amount, type, status, reference)
  VALUES (v_wallet_id, v_total_amount, 'giveaway_created', 'success', 'giveaway_' || gen_random_uuid()::text)
  RETURNING id INTO new_transaction_id;

  -- Create the giveaway
  INSERT INTO giveaways (created_by, title, message, code_value, total_codes, total_amount, expires_at)
  VALUES (
    v_creator_id,
    p_title,
    p_message,
    p_code_value,
    p_total_codes,
    v_total_amount,
    NOW() + (p_expires_in_hours * INTERVAL '1 hour')
  )
  RETURNING id INTO new_giveaway_id;

  -- Generate and insert giveaway codes
  FOR i IN 1..p_total_codes LOOP
    INSERT INTO giveaway_codes (giveaway_id, code, value, expires_at)
    VALUES (new_giveaway_id, 'NEXA' || substr(md5(random()::text), 0, 8), p_code_value, NOW() + (p_expires_in_hours * INTERVAL '1 hour'));
  END LOOP;
  
  RETURN QUERY SELECT new_giveaway_id as giveaway_id;
END;
$$ LANGUAGE plpgsql;
