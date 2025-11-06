DROP FUNCTION IF EXISTS update_wallet_and_create_transaction(UUID, DECIMAL, DECIMAL, TEXT, TEXT, TEXT);
CREATE OR REPLACE FUNCTION update_wallet_and_create_transaction(
    p_wallet_id UUID,
    p_new_balance DECIMAL(10, 2),
    p_transaction_amount DECIMAL(10, 2),
    p_transaction_type TEXT,
    p_transaction_status TEXT,
    p_transaction_reference TEXT
)
RETURNS UUID AS $$
DECLARE
    new_transaction_id UUID;
BEGIN
    UPDATE wallets SET balance = p_new_balance WHERE id = p_wallet_id;
    INSERT INTO transactions (wallet_id, amount, type, status, reference)
    VALUES (p_wallet_id, p_transaction_amount, p_transaction_type, p_transaction_status, p_transaction_reference)
    RETURNING id INTO new_transaction_id;
    RETURN new_transaction_id;
END;
$$ LANGUAGE plpgsql;
