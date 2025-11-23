-- Update redeem_giveaway_code function to enforce 1-minute cooldown
CREATE OR REPLACE FUNCTION public.redeem_giveaway_code(p_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    v_user_id UUID;
    v_code_record RECORD;
    v_wallet_id UUID;
    v_new_balance DECIMAL(10, 2);
    v_redeemer_ign TEXT;
    v_giveaway_title TEXT;
    v_last_redeemed TIMESTAMP WITH TIME ZONE;
    v_cooldown_seconds INTEGER := 60; -- 1 minute cooldown
    v_time_since_last INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    -- Check cooldown
    SELECT last_giveaway_redeemed_at INTO v_last_redeemed
    FROM profiles
    WHERE id = v_user_id;
    
    IF v_last_redeemed IS NOT NULL THEN
        v_time_since_last := EXTRACT(EPOCH FROM (NOW() - v_last_redeemed))::INTEGER;
        
        IF v_time_since_last < v_cooldown_seconds THEN
            RETURN jsonb_build_object(
                'success', false,
                'message', 'Cooldown active',
                'cooldown_seconds', v_cooldown_seconds - v_time_since_last
            );
        END IF;
    END IF;

    -- Get redeemer IGN
    SELECT ign INTO v_redeemer_ign FROM profiles WHERE id = v_user_id;

    -- Get code details with lock
    SELECT * INTO v_code_record
    FROM giveaway_codes
    WHERE code = UPPER(p_code)
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid code');
    END IF;

    IF v_code_record.is_redeemed THEN
        RETURN jsonb_build_object('success', false, 'message', 'Code already redeemed');
    END IF;

    IF v_code_record.expires_at < NOW() THEN
        RETURN jsonb_build_object('success', false, 'message', 'Code expired');
    END IF;

    -- Get giveaway title
    SELECT title INTO v_giveaway_title FROM giveaways WHERE id = v_code_record.giveaway_id;

    -- Get or create user wallet
    SELECT id INTO v_wallet_id FROM wallets WHERE user_id = v_user_id;
    IF NOT FOUND THEN
        INSERT INTO wallets (user_id, balance) VALUES (v_user_id, 0) RETURNING id INTO v_wallet_id;
    END IF;

    -- Credit wallet
    UPDATE wallets
    SET balance = balance + v_code_record.value, updated_at = NOW()
    WHERE id = v_wallet_id
    RETURNING balance INTO v_new_balance;

    -- Record transaction
    INSERT INTO transactions (wallet_id, amount, type, status, reference)
    VALUES (v_wallet_id, v_code_record.value, 'giveaway_redeemed', 'success', 'redeem_' || p_code);

    -- Mark code as redeemed
    UPDATE giveaway_codes
    SET is_redeemed = true, redeemed_by = v_user_id, redeemed_at = NOW()
    WHERE id = v_code_record.id;

    -- Update user's last redemption timestamp
    UPDATE profiles
    SET last_giveaway_redeemed_at = NOW()
    WHERE id = v_user_id;

    -- Update giveaway stats
    UPDATE giveaways
    SET redeemed_count = redeemed_count + 1,
        redeemed_amount = redeemed_amount + v_code_record.value,
        updated_at = NOW()
    WHERE id = v_code_record.giveaway_id;

    -- Create notifications for all other users about the redemption
    INSERT INTO notifications (type, title, message, data)
    SELECT 
        'giveaway_redeemed',
        '🎉 Code Redeemed!',
        v_redeemer_ign || ' just redeemed ₦' || v_code_record.value || ' from ' || v_giveaway_title,
        jsonb_build_object(
            'giveaway_id', v_code_record.giveaway_id,
            'redeemer', v_redeemer_ign,
            'amount', v_code_record.value
        )
    FROM profiles
    WHERE id != v_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'amount', v_code_record.value,
        'new_balance', v_new_balance,
        'message', 'Successfully redeemed ₦' || v_code_record.value
    );
END;
$function$;