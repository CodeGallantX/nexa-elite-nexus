DROP POLICY IF EXISTS "Clan masters and admins can create giveaways" ON public.giveaways;
DROP POLICY IF EXISTS "Allow authenticated users to read giveaways" ON public.giveaways;
DROP POLICY IF EXISTS "Allow authenticated users to read giveaway codes" ON public.giveaway_codes;
DROP POLICY IF EXISTS "Allow authenticated users to redeem giveaway codes" ON public.giveaway_codes;

-- Re-create policies
CREATE POLICY "Clan masters and admins can create giveaways"
ON public.giveaways
FOR INSERT
TO authenticated
WITH CHECK (
    get_user_role(auth.uid()) = ANY(ARRAY['admin'::user_role, 'clan_master'::user_role])
    AND auth.uid() = created_by
);

CREATE POLICY "Allow authenticated users to read giveaways"
ON public.giveaways
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to read giveaway codes"
ON public.giveaway_codes
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to redeem giveaway codes"
ON public.giveaway_codes
FOR UPDATE
TO authenticated
USING (
    NOT is_redeemed
    AND EXISTS (
        SELECT 1
        FROM public.giveaways
        WHERE giveaways.id = giveaway_codes.giveaway_id
        AND giveaways.expires_at > NOW()
    )
)
WITH CHECK (
    is_redeemed = true
    AND redeemed_by = auth.uid()
);
