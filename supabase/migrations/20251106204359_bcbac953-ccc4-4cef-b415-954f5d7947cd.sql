-- Fix duplicate transaction reference issue by making references unique with UUID
DROP FUNCTION IF EXISTS public.execute_user_transfer(uuid, text, numeric);

CREATE OR REPLACE FUNCTION public.execute_user_transfer(sender_id uuid, recipient_ign text, amount numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    sender_wallet_id UUID;
    sender_balance DECIMAL(10, 2);
    recipient_id UUID;
    recipient_wallet_id UUID;
    transfer_ref TEXT;
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

    -- Generate unique reference using UUID
    transfer_ref := 'transfer_' || gen_random_uuid()::text;

    -- Log both transactions with unique references
    INSERT INTO transactions (wallet_id, amount, type, status, reference)
    VALUES
        (sender_wallet_id, amount, 'transfer_out', 'success', transfer_ref || '_out'),
        (recipient_wallet_id, amount, 'transfer_in', 'success', transfer_ref || '_in');

END;
$$;

-- Create giveaways table
CREATE TABLE IF NOT EXISTS public.giveaways (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    code_value DECIMAL(10, 2) NOT NULL CHECK (code_value > 0),
    total_codes INTEGER NOT NULL CHECK (total_codes > 0),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount > 0),
    redeemed_count INTEGER NOT NULL DEFAULT 0,
    redeemed_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create giveaway codes table
CREATE TABLE IF NOT EXISTS public.giveaway_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    giveaway_id UUID NOT NULL REFERENCES giveaways(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    value DECIMAL(10, 2) NOT NULL CHECK (value > 0),
    is_redeemed BOOLEAN NOT NULL DEFAULT false,
    redeemed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    redeemed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_giveaway_codes_code ON giveaway_codes(code);
CREATE INDEX IF NOT EXISTS idx_giveaway_codes_giveaway_id ON giveaway_codes(giveaway_id);
CREATE INDEX IF NOT EXISTS idx_giveaway_codes_redeemed ON giveaway_codes(is_redeemed);
CREATE INDEX IF NOT EXISTS idx_giveaways_created_by ON giveaways(created_by);
CREATE INDEX IF NOT EXISTS idx_giveaways_expires_at ON giveaways(expires_at);

-- Enable RLS
ALTER TABLE public.giveaways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.giveaway_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for giveaways
DROP POLICY IF EXISTS "Clan masters and admins can create giveaways" ON public.giveaways;
CREATE POLICY "Clan masters and admins can create giveaways"
ON public.giveaways
FOR INSERT
TO authenticated
WITH CHECK (
    get_user_role(auth.uid()) = ANY(ARRAY['admin'::user_role, 'clan_master'::user_role])
    AND auth.uid() = created_by
);

DROP POLICY IF EXISTS "Clan masters and admins can view their own giveaways" ON public.giveaways;
CREATE POLICY "Clan masters and admins can view their own giveaways"
ON public.giveaways
FOR SELECT
TO authenticated
USING (
    auth.uid() = created_by
    OR get_user_role(auth.uid()) = ANY(ARRAY['admin'::user_role, 'clan_master'::user_role])
);

DROP POLICY IF EXISTS "Clan masters and admins can update their own giveaways" ON public.giveaways;
CREATE POLICY "Clan masters and admins can update their own giveaways"
ON public.giveaways
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- RLS Policies for giveaway_codes
DROP POLICY IF EXISTS "Only system can insert codes" ON public.giveaway_codes;
CREATE POLICY "Only system can insert codes"
ON public.giveaway_codes
FOR INSERT
TO authenticated
WITH CHECK (false);

DROP POLICY IF EXISTS "Authenticated users can view unredeemed codes" ON public.giveaway_codes;
CREATE POLICY "Authenticated users can view unredeemed codes"
ON public.giveaway_codes
FOR SELECT
TO authenticated
USING (
    NOT is_redeemed
    OR redeemed_by = auth.uid()
    OR EXISTS (
        SELECT 1 FROM giveaways
        WHERE giveaways.id = giveaway_codes.giveaway_id
        AND giveaways.created_by = auth.uid()
    )
);

DROP POLICY IF EXISTS "System can update codes for redemption" ON public.giveaway_codes;
CREATE POLICY "System can update codes for redemption"
ON public.giveaway_codes
FOR UPDATE
TO authenticated
USING (NOT is_redeemed AND expires_at > NOW())
WITH CHECK (true);

-- Function to create giveaway with codes
CREATE OR REPLACE FUNCTION public.create_giveaway_with_codes(
    p_title TEXT,
    p_message TEXT,
    p_code_value DECIMAL,
    p_total_codes INTEGER,
    p_expires_in_hours NUMERIC
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_creator_id UUID;
    v_creator_role user_role;
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

    -- Check role
    SELECT role INTO v_creator_role FROM profiles WHERE id = v_creator_id;
    IF v_creator_role NOT IN ('admin', 'clan_master') THEN
        RAISE EXCEPTION 'Only clan masters and admins can create giveaways';
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

-- Function to redeem giveaway code
CREATE OR REPLACE FUNCTION public.redeem_giveaway_code(p_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_user_id UUID;
    v_code_record RECORD;
    v_wallet_id UUID;
    v_new_balance DECIMAL(10, 2);
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

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

    -- Update giveaway stats
    UPDATE giveaways
    SET redeemed_count = redeemed_count + 1,
        redeemed_amount = redeemed_amount + v_code_record.value,
        updated_at = NOW()
    WHERE id = v_code_record.giveaway_id;

    RETURN jsonb_build_object(
        'success', true,
        'amount', v_code_record.value,
        'new_balance', v_new_balance,
        'message', 'Successfully redeemed ₦' || v_code_record.value
    );
END;
$$;

-- Function to expire old codes and refund
CREATE OR REPLACE FUNCTION public.expire_giveaway_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_giveaway RECORD;
    v_expired_codes INTEGER;
    v_refund_amount DECIMAL(10, 2);
    v_wallet_id UUID;
BEGIN
    -- Process each expired giveaway
    FOR v_giveaway IN
        SELECT DISTINCT g.id, g.created_by, g.code_value
        FROM giveaways g
        INNER JOIN giveaway_codes gc ON gc.giveaway_id = g.id
        WHERE gc.expires_at < NOW()
        AND gc.is_redeemed = false
    LOOP
        -- Count and calculate refund
        SELECT COUNT(*), COALESCE(SUM(value), 0)
        INTO v_expired_codes, v_refund_amount
        FROM giveaway_codes
        WHERE giveaway_id = v_giveaway.id
        AND expires_at < NOW()
        AND is_redeemed = false;

        IF v_refund_amount > 0 THEN
            -- Get creator's wallet
            SELECT id INTO v_wallet_id
            FROM wallets WHERE user_id = v_giveaway.created_by;

            IF FOUND THEN
                -- Refund to creator
                UPDATE wallets
                SET balance = balance + v_refund_amount, updated_at = NOW()
                WHERE id = v_wallet_id;

                -- Record refund transaction
                INSERT INTO transactions (wallet_id, amount, type, status, reference)
                VALUES (v_wallet_id, v_refund_amount, 'giveaway_refund', 'success', 
                       'refund_giveaway_' || v_giveaway.id::text);
            END IF;

            -- Mark codes as expired (soft delete)
            UPDATE giveaway_codes
            SET is_redeemed = true, redeemed_at = NOW()
            WHERE giveaway_id = v_giveaway.id
            AND expires_at < NOW()
            AND is_redeemed = false;
        END IF;
    END LOOP;
END;
$$;

-- Trigger to update giveaway updated_at
CREATE OR REPLACE FUNCTION update_giveaway_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_giveaways_updated_at ON giveaways;
CREATE TRIGGER update_giveaways_updated_at
BEFORE UPDATE ON giveaways
FOR EACH ROW
EXECUTE FUNCTION update_giveaway_updated_at();