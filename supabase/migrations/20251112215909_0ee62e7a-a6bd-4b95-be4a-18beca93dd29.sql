-- Fix update_wallet_and_create_transaction to properly cast transaction_type
CREATE OR REPLACE FUNCTION public.update_wallet_and_create_transaction(
  p_wallet_id uuid, 
  p_new_balance numeric, 
  p_transaction_amount numeric, 
  p_transaction_type text, 
  p_transaction_status text, 
  p_transaction_reference text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    v_transaction_id UUID;
BEGIN
    -- Update wallet balance
    UPDATE wallets 
    SET balance = p_new_balance, 
        updated_at = NOW()
    WHERE id = p_wallet_id;
    
    -- Check if update was successful
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wallet not found';
    END IF;
    
    -- Create transaction record with proper type casting
    INSERT INTO transactions (
        wallet_id, 
        amount, 
        type, 
        status, 
        reference
    )
    VALUES (
        p_wallet_id,
        p_transaction_amount,
        p_transaction_type::transaction_type,  -- Cast text to enum
        p_transaction_status,
        p_transaction_reference
    )
    RETURNING id INTO v_transaction_id;
    
    RETURN v_transaction_id;
END;
$function$;