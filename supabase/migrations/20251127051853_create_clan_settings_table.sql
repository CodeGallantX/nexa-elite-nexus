-- Create clan_settings table to store configurable settings for the clan master
CREATE TABLE IF NOT EXISTS clan_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE clan_settings ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can read settings
CREATE POLICY "Anyone can read clan settings"
    ON clan_settings FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Only clan_master and admin can update settings
CREATE POLICY "Clan master and admin can update settings"
    ON clan_settings FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('clan_master', 'admin')
        )
    );

-- Policy: Only clan_master and admin can insert settings
CREATE POLICY "Clan master and admin can insert settings"
    ON clan_settings FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('clan_master', 'admin')
        )
    );

-- Insert default settings for withdrawals and deposits
INSERT INTO clan_settings (key, value, description) VALUES
    ('withdrawals_enabled', true, 'Enable or disable wallet withdrawals for all users'),
    ('deposits_enabled', true, 'Enable or disable wallet deposits/funding for all users')
ON CONFLICT (key) DO NOTHING;

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_clan_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clan_settings_updated_at_trigger
    BEFORE UPDATE ON clan_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_clan_settings_updated_at();
