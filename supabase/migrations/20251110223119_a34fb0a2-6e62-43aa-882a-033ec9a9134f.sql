-- Allow all authenticated users to create and redeem giveaways
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Clan masters and admins can create giveaways" ON public.giveaways;
DROP POLICY IF EXISTS "Clan masters and admins can view their own giveaways" ON public.giveaways;
DROP POLICY IF EXISTS "Clan masters and admins can update their own giveaways" ON public.giveaways;

-- Create new policies for all authenticated users
CREATE POLICY "Authenticated users can create giveaways" 
ON public.giveaways 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view their own giveaways" 
ON public.giveaways 
FOR SELECT 
USING (auth.uid() = created_by OR get_user_role(auth.uid()) = ANY (ARRAY['admin'::user_role, 'clan_master'::user_role]));

CREATE POLICY "Users can update their own giveaways" 
ON public.giveaways 
FOR UPDATE 
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Update create_giveaway_with_codes function to allow all authenticated users
CREATE OR REPLACE FUNCTION public.create_giveaway_with_codes(
    p_title text, 
    p_message text, 
    p_code_value numeric, 
    p_total_codes integer, 
    p_expires_in_hours numeric
)
RETURNS uuid
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
    VALUES (v_wallet_id, v_total_amount, 'giveaway_created', 'success', 'giveaway_' || gen_random_uuid()::text);

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

    RETURN v_giveaway_id;
END;
$$;

-- Add source column to earnings table to track earning types
ALTER TABLE public.earnings ADD COLUMN IF NOT EXISTS source TEXT;

-- Update existing earnings to have a source
UPDATE public.earnings SET source = 'transfer_fee' WHERE source IS NULL;

-- Update credit_wallet function to charge 4% fee instead of flat 50
CREATE OR REPLACE FUNCTION public.credit_wallet(
    p_user_id uuid, 
    p_amount numeric, 
    p_reference text, 
    p_currency text
)
RETURNS numeric
LANGUAGE plpgsql
AS $$
DECLARE
    v_wallet_id UUID;
    v_new_balance DECIMAL;
    v_fee DECIMAL := p_amount * 0.04; -- 4% fee
    v_net_amount DECIMAL := p_amount - v_fee;
    v_transaction_id UUID;
    v_min_deposit_limit NUMERIC := 500;
    v_max_deposit_limit NUMERIC := 100000;
    v_daily_deposit_limit NUMERIC := 100000;
    v_today_deposits NUMERIC;
BEGIN
    -- Check minimum deposit limit
    IF p_amount < v_min_deposit_limit THEN
        RAISE EXCEPTION 'Deposit amount must be at least ₦%', v_min_deposit_limit;
    END IF;

    -- Check maximum deposit limit per transaction
    IF p_amount > v_max_deposit_limit THEN
        RAISE EXCEPTION 'Deposit amount cannot exceed ₦%', v_max_deposit_limit;
    END IF;

    -- Calculate total deposits for today
    SELECT COALESCE(SUM(amount), 0) INTO v_today_deposits
    FROM transactions
    WHERE wallet_id = (SELECT id FROM wallets WHERE user_id = p_user_id)
      AND type = 'deposit'
      AND status = 'success'
      AND created_at >= CURRENT_DATE;

    -- Check daily deposit limit
    IF (v_today_deposits + p_amount) > v_daily_deposit_limit THEN
        RAISE EXCEPTION 'Daily deposit limit of ₦% exceeded. You have deposited ₦% today.', v_daily_deposit_limit, v_today_deposits;
    END IF;

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
    SET balance = balance + v_net_amount
    WHERE id = v_wallet_id
    RETURNING balance INTO v_new_balance;

    -- Create a new transaction
    INSERT INTO transactions (wallet_id, amount, type, status, reference, currency)
    VALUES (v_wallet_id, p_amount, 'deposit', 'success', p_reference, p_currency)
    RETURNING id INTO v_transaction_id;

    -- Log the fee with source
    INSERT INTO earnings (transaction_id, amount, source)
    VALUES (v_transaction_id, v_fee, 'deposit_fee');

    RETURN v_new_balance;
END;
$$;

-- Update execute_user_transfer to keep 50 fee and mark source
CREATE OR REPLACE FUNCTION public.execute_user_transfer(
    sender_id uuid, 
    recipient_ign text, 
    amount numeric
)
RETURNS void
LANGUAGE plpgsql
AS $$
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

    -- Log the fee with source
    INSERT INTO earnings (transaction_id, amount, source)
    VALUES (sender_transaction_id, fee, 'transfer_fee');
END;
$$;