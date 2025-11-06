CREATE EXTENSION IF NOT EXISTS moddatetime;

CREATE TABLE taxes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE taxes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin and clan_master to read taxes" ON taxes
    FOR SELECT
    USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'clan_master'));

CREATE POLICY "Allow admin and clan_master to insert taxes" ON taxes
    FOR INSERT
    WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'clan_master'));

CREATE POLICY "Allow admin and clan_master to update taxes" ON taxes
    FOR UPDATE
    USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'clan_master'));

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON taxes
FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');
