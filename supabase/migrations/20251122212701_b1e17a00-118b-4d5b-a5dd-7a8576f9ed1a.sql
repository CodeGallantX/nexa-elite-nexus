-- Fix case sensitivity issue with giveaway codes
-- Update the create_giveaway_with_codes function to generate codes in uppercase
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
SET search_path TO 'public'
AS $function$
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

  -- Generate and insert giveaway codes with format: NEXA<8digits> (all uppercase)
  FOR i IN 1..p_total_codes LOOP
    LOOP
      -- Generate 8-digit random code with NEXA prefix in uppercase
      generated_code := 'NEXA' || LPAD(FLOOR(RANDOM() * 100000000)::TEXT, 8, '0');
      
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
$function$;

-- Update existing codes to uppercase for consistency
UPDATE giveaway_codes 
SET code = UPPER(code) 
WHERE code != UPPER(code);