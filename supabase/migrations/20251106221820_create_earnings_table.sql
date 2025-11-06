CREATE TABLE earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id),
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin access to earnings" ON earnings
    FOR SELECT
    USING (auth.role() = 'service_role' OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'clan_master'));
