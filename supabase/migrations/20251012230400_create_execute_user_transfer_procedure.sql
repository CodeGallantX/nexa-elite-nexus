CREATE OR REPLACE FUNCTION execute_user_transfer(
    sender_id UUID,
    recipient_ign TEXT,
    amount DECIMAL(10, 2)
)
RETURNS void AS $$
DECLARE
    sender_wallet_id UUID;
    sender_balance DECIMAL(10, 2);
    recipient_id UUID;
    recipient_wallet_id UUID;
BEGIN
    -- Find recipient's user ID from their IGN in the profiles table
    SELECT id INTO recipient_id FROM profiles WHERE ign = recipient_ign;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Recipient not found';
    END IF;

    -- Get sender's wallet and balance
    SELECT id, balance INTO sender_wallet_id, sender_balance FROM wallets WHERE user_id = sender_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Sender wallet not found';
    END IF;

    -- Check for sufficient funds
    IF sender_balance < amount THEN
        RAISE EXCEPTION 'Insufficient funds';
    END IF;

    -- Get recipient's wallet
    SELECT id INTO recipient_wallet_id FROM wallets WHERE user_id = recipient_id;
    IF NOT FOUND THEN
        -- Create a wallet for the recipient if they don't have one
        INSERT INTO wallets (user_id, balance) VALUES (recipient_id, 0) RETURNING id INTO recipient_wallet_id;
    END IF;

    -- Perform the transfer
    UPDATE wallets SET balance = balance - amount WHERE id = sender_wallet_id;
    UPDATE wallets SET balance = balance + amount WHERE id = recipient_wallet_id;

    -- Log both transactions
    INSERT INTO transactions (wallet_id, amount, type, status, reference)
    VALUES
        (sender_wallet_id, -amount, 'transfer', 'success', 'transfer_to_' || recipient_ign),
        (recipient_wallet_id, amount, 'transfer', 'success', 'transfer_from_' || (SELECT email FROM auth.users WHERE id = sender_id));

END;
$$ LANGUAGE plpgsql;
