CREATE OR REPLACE FUNCTION credit_wallet(
    p_user_id UUID,
    p_amount DECIMAL,
    p_reference TEXT,
    p_currency TEXT
)
RETURNS DECIMAL AS $$
DECLARE
    v_wallet_id UUID;
    v_new_balance DECIMAL;
BEGIN
    -- Get the user's wallet id
    SELECT id INTO v_wallet_id FROM wallets WHERE user_id = p_user_id;

    -- If the user doesn't have a wallet, create one
    IF v_wallet_id IS NULL THEN
        INSERT INTO wallets (user_id, balance)
        VALUES (p_user_id, 0)
        RETURNING id INTO v_wallet_id;
    END IF;

    -- Update the wallet balance
    UPDATE wallets
    SET balance = balance + p_amount
    WHERE id = v_wallet_id
    RETURNING balance INTO v_new_balance;

    -- Create a new transaction
    INSERT INTO transactions (wallet_id, amount, type, status, reference, currency)
    VALUES (v_wallet_id, p_amount, 'deposit', 'success', p_reference, p_currency);

    RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql;