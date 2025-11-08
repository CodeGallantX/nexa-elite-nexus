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
    fee DECIMAL(10, 2) := 50;
    total_deduction DECIMAL(10, 2) := amount + fee;
    sender_transaction_id UUID;
    sender_ign TEXT;
BEGIN
    -- Get sender's IGN
    SELECT ign INTO sender_ign FROM public.profiles WHERE id = sender_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Sender profile not found';
    END IF;

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
    IF sender_balance < total_deduction THEN
        RAISE EXCEPTION 'Insufficient funds for transfer and fee';
    END IF;

    -- Get recipient's wallet
    SELECT id INTO recipient_wallet_id FROM wallets WHERE user_id = recipient_id;
    IF NOT FOUND THEN
        -- Create a wallet for the recipient if they don't have one
        INSERT INTO wallets (user_id, balance) VALUES (recipient_id, 0) RETURNING id INTO recipient_wallet_id;
    END IF;

    -- Perform the transfer
    UPDATE wallets SET balance = balance - total_deduction WHERE id = sender_wallet_id;
    UPDATE wallets SET balance = balance + amount WHERE id = recipient_wallet_id;

    -- Log both transactions
    INSERT INTO transactions (wallet_id, amount, type, status, reference)
    VALUES
        (sender_wallet_id, amount, 'transfer_out', 'success', 'transfer_to_' || recipient_ign || '_' || now())
    RETURNING id INTO sender_transaction_id;

    INSERT INTO transactions (wallet_id, amount, type, status, reference)
    VALUES
        (recipient_wallet_id, amount, 'transfer_in', 'success', 'transfer_from_' || sender_ign || '_' || now());

    -- Log the fee
    INSERT INTO earnings (transaction_id, amount)
    VALUES (sender_transaction_id, fee);

END;
$$ LANGUAGE plpgsql;
