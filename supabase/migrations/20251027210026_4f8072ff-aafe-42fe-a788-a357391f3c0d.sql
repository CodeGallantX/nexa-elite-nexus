-- Enable RLS on wallets table
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- Enable RLS on transactions table
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own wallet
CREATE POLICY "Users can view their own wallet"
ON public.wallets
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to view their own transactions
CREATE POLICY "Users can view their own transactions"
ON public.transactions
FOR SELECT
USING (
  wallet_id IN (
    SELECT id FROM public.wallets WHERE user_id = auth.uid()
  )
);

-- Allow admins to view all wallets
CREATE POLICY "Admins can view all wallets"
ON public.wallets
FOR SELECT
USING (get_user_role(auth.uid()) = ANY(ARRAY['admin'::user_role, 'clan_master'::user_role]));

-- Allow admins to view all transactions
CREATE POLICY "Admins can view all transactions"
ON public.transactions
FOR SELECT
USING (get_user_role(auth.uid()) = ANY(ARRAY['admin'::user_role, 'clan_master'::user_role]));