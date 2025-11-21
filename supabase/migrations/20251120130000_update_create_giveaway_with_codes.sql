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
  new_giveaway_id UUID;
  new_transaction_id UUID;
  code_record RECORD;
BEGIN
  -- Validate user role
  IF NOT (get_user_role(auth.uid()) IN ('admin', 'clan_master')) THEN
    RAISE EXCEPTION 'User does not have the required privileges';
  END IF;
  
  -- Create the giveaway
  INSERT INTO giveaways (created_by, title, message, code_value, total_codes, total_amount, expires_at)
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
  
  -- Create the transaction for the giveaway
  INSERT INTO transactions (type, amount, description, giveaway_id)
  VALUES ('giveaway', p_code_value * p_total_codes, 'Giveaway created', new_giveaway_id)
  RETURNING id INTO new_transaction_id;

  -- Generate and insert giveaway codes
  FOR i IN 1..p_total_codes LOOP
    INSERT INTO giveaway_codes (giveaway_id, code, value)
    VALUES (new_giveaway_id, 'NEXA' || substr(md5(random()::text), 0, 8), p_code_value);
  END LOOP;
  
  RETURN QUERY SELECT new_giveaway_id as giveaway_id;
END;
$$ LANGUAGE plpgsql;
