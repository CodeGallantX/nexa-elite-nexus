-- Drop conflicting versions of create_giveaway_with_codes
DROP FUNCTION IF EXISTS public.create_giveaway_with_codes(text, text, numeric, integer, integer);
DROP FUNCTION IF EXISTS public.create_giveaway_with_codes(text, text, integer, integer, integer);
DROP FUNCTION IF EXISTS public.create_giveaway_with_codes(text, text, numeric, integer, numeric);
DROP FUNCTION IF EXISTS public.create_giveaway_with_codes(text, text, numeric, integer, int); -- for good measure
DROP FUNCTION IF EXISTS public.create_giveaway_with_codes(text, text, decimal, integer, numeric);

-- create_giveaway_with_codes
CREATE OR REPLACE FUNCTION public.create_giveaway_with_codes(
  p_title TEXT,
  p_message TEXT,
  p_code_value NUMERIC,
  p_total_codes INT,
  p_expires_in_hours NUMERIC
)
RETURNS TABLE (
  giveaway_id UUID,
  transaction_id UUID
) AS $$
DECLARE
  v_creator_id UUID;
  v_wallet_id UUID;
  v_balance DECIMAL(10, 2);
  v_total_amount DECIMAL(10, 2);
  v_giveaway_id UUID;
  v_transaction_id UUID;
  v_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
  v_creator_id := auth.uid();
  IF v_creator_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  v_total_amount := p_code_value * p_total_codes;

  SELECT id, balance INTO v_wallet_id, v_balance
  FROM wallets WHERE user_id = v_creator_id;
  
  IF NOT FOUND THEN
      RAISE EXCEPTION 'Wallet not found';
  END IF;

  IF v_balance < v_total_amount THEN
      RAISE EXCEPTION 'Insufficient funds. You need ₦% but only have ₦%', v_total_amount, v_balance;
  END IF;

  UPDATE wallets 
  SET balance = balance - v_total_amount, updated_at = NOW()
  WHERE id = v_wallet_id;

  v_expires_at := NOW() + (p_expires_in_hours * INTERVAL '1 hour');
  
  INSERT INTO giveaways (created_by, title, message, code_value, total_codes, total_amount, expires_at)
  VALUES (v_creator_id, p_title, p_message, p_code_value, p_total_codes, v_total_amount, v_expires_at)
  RETURNING id INTO v_giveaway_id;
  
  INSERT INTO transactions (wallet_id, type, amount, description, giveaway_id, status, reference)
  VALUES (v_wallet_id, v_total_amount, 'giveaway_created', 'Giveaway created: ' || p_title, v_giveaway_id, 'success', 'giveaway_' || v_giveaway_id::text)
  RETURNING id INTO v_transaction_id;

  FOR i IN 1..p_total_codes LOOP
    INSERT INTO giveaway_codes (giveaway_id, code, value, expires_at)
    VALUES (v_giveaway_id, 'NEXA' || substr(md5(random()::text), 0, 8), p_code_value, v_expires_at);
  END LOOP;
  
  RETURN QUERY SELECT v_giveaway_id, v_transaction_id;
END;
$$ LANGUAGE plpgsql;