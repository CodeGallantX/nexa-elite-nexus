DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'wallet_balance') THEN
        -- Create a wallet for each user and copy the wallet_balance from the profiles table to the wallets table.
        INSERT INTO wallets (user_id, balance)
        SELECT id, wallet_balance FROM profiles WHERE wallet_balance > 0;

        -- Remove the wallet_balance column from the profiles table.
        ALTER TABLE profiles DROP COLUMN wallet_balance;
    END IF;
END $$;
