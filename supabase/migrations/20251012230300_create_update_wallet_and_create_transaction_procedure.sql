CREATE OR REPLACE FUNCTION update_wallet_and_create_transaction(
    wallet_id UUID,
    new_balance DECIMAL(10, 2),
    transaction_amount DECIMAL(10, 2),
    transaction_type TEXT,
    transaction_status TEXT,
    transaction_reference TEXT,
    transaction_currency TEXT
)
RETURNS void AS $$
BEGIN
    UPDATE wallets SET balance = new_balance WHERE id = wallet_id;
    INSERT INTO transactions (wallet_id, amount, type, status, reference, currency)
    VALUES (wallet_id, transaction_amount, transaction_type, transaction_status, transaction_reference, transaction_currency);
END;
$$ LANGUAGE plpgsql;
