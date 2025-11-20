DROP FUNCTION IF EXISTS public.create_giveaway_with_codes(text, text, numeric, integer, numeric);

CREATE OR REPLACE FUNCTION public.create_giveaway_with_codes(
    p_title text,
    p_message text,
    p_code_value numeric,
    p_total_codes integer,
    p_expires_in_hours numeric
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_creator_id UUID;
    v_wallet_id UUID;
    v_balance DECIMAL(10, 2);
    v_total_amount DECIMAL(10, 2);
    v_giveaway_id UUID;
    v_expires_at TIMESTAMP WITH TIME ZONE;
    v_code TEXT;
    i INTEGER;
    v_transaction_id UUID;
    new_transaction json;
BEGIN
    -- Get creator info
    v_creator_id := auth.uid();
    IF v_creator_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized';
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
    RETURNING id INTO v_transaction_id;

    -- Calculate expiry
    v_expires_at := NOW() + (p_expires_in_hours || ' hours')::INTERVAL;

    -- Create giveaway
    INSERT INTO giveaways (created_by, title, message, code_value, total_codes, total_amount, expires_at)
    VALUES (v_creator_id, p_title, p_message, p_code_value, p_total_codes, v_total_amount, v_expires_at)
    RETURNING id INTO v_giveaway_id;

    -- Generate unique codes
    FOR i IN 1..p_total_codes LOOP
        LOOP
            -- Generate random 8-character code
            v_code := UPPER(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));

            -- Try to insert, exit loop if successful
            BEGIN
                INSERT INTO giveaway_codes (giveaway_id, code, value, expires_at)
                VALUES (v_giveaway_id, v_code, p_code_value, v_expires_at);
                EXIT;
            EXCEPTION WHEN unique_violation THEN
                -- Code already exists, try again
                CONTINUE;
            END;
        END LOOP;
    END LOOP;

    -- Fetch the transaction
    SELECT row_to_json(t)
    INTO new_transaction
    FROM (
        SELECT * FROM transactions WHERE id = v_transaction_id
    ) t;

    RETURN json_build_object('transaction', new_transaction, 'giveaway_id', v_giveaway_id);
END;
$$;
