-- Drop existing policies first to recreate them properly
DROP POLICY IF EXISTS "Users can view their own wallet" ON public.wallets;
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can view all wallets" ON public.wallets;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;

-- Wallets policies
CREATE POLICY "Users can view their own wallet"
ON public.wallets
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all wallets"
ON public.wallets
FOR SELECT
USING (get_user_role(auth.uid()) = ANY(ARRAY['admin'::user_role, 'clan_master'::user_role]));

-- Allow edge functions to insert wallets (via service role)
CREATE POLICY "Service role can insert wallets"
ON public.wallets
FOR INSERT
WITH CHECK (true);

-- Allow edge functions to update wallet balances (via service role)
CREATE POLICY "Service role can update wallets"
ON public.wallets
FOR UPDATE
USING (true);

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
ON public.transactions
FOR SELECT
USING (
  wallet_id IN (
    SELECT id FROM public.wallets WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all transactions"
ON public.transactions
FOR SELECT
USING (get_user_role(auth.uid()) = ANY(ARRAY['admin'::user_role, 'clan_master'::user_role]));

-- Allow edge functions to insert transactions (via service role)
CREATE POLICY "Service role can insert transactions"
ON public.transactions
FOR INSERT
WITH CHECK (true);

-- Ensure the RPC functions have proper security
-- Fix execute_user_transfer to be more secure
CREATE OR REPLACE FUNCTION public.execute_user_transfer(sender_id uuid, recipient_ign text, amount numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    sender_wallet_id UUID;
    sender_balance DECIMAL(10, 2);
    recipient_id UUID;
    recipient_wallet_id UUID;
BEGIN
    -- Verify the sender is the authenticated user
    IF sender_id != auth.uid() THEN
        RAISE EXCEPTION 'Unauthorized: You can only transfer from your own wallet';
    END IF;

    -- Verify amount is positive
    IF amount <= 0 THEN
        RAISE EXCEPTION 'Amount must be greater than zero';
    END IF;

    -- Find recipient's user ID from their IGN in the profiles table
    SELECT id INTO recipient_id FROM profiles WHERE ign = recipient_ign;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Recipient not found';
    END IF;

    -- Prevent self-transfers
    IF sender_id = recipient_id THEN
        RAISE EXCEPTION 'Cannot transfer to yourself';
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

    -- Get or create recipient's wallet
    SELECT id INTO recipient_wallet_id FROM wallets WHERE user_id = recipient_id;
    IF NOT FOUND THEN
        INSERT INTO wallets (user_id, balance) VALUES (recipient_id, 0) RETURNING id INTO recipient_wallet_id;
    END IF;

    -- Perform the transfer
    UPDATE wallets SET balance = balance - amount, updated_at = NOW() WHERE id = sender_wallet_id;
    UPDATE wallets SET balance = balance + amount, updated_at = NOW() WHERE id = recipient_wallet_id;

    -- Log both transactions
    INSERT INTO transactions (wallet_id, amount, type, status, reference)
    VALUES
        (sender_wallet_id, amount, 'transfer_out', 'success', 'transfer_to_' || recipient_ign),
        (recipient_wallet_id, amount, 'transfer_in', 'success', 'transfer_from_' || (SELECT ign FROM profiles WHERE id = sender_id));

END;
$function$;

-- Update the update_wallet_and_create_transaction function for security
CREATE OR REPLACE FUNCTION public.update_wallet_and_create_transaction(
    wallet_id uuid, 
    new_balance numeric, 
    transaction_amount numeric, 
    transaction_type text, 
    transaction_status text, 
    transaction_reference text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    UPDATE wallets SET balance = new_balance, updated_at = NOW() WHERE id = wallet_id;
    INSERT INTO transactions (wallet_id, amount, type, status, reference)
    VALUES (wallet_id, transaction_amount, transaction_type, transaction_status, transaction_reference);
END;
$function$;