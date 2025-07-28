
-- Create access codes table
CREATE TABLE public.access_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Insert the NEXA24 access code
INSERT INTO public.access_codes (code, is_active) VALUES ('NEXA24', TRUE);

-- Enable RLS on access_codes
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active access codes (for validation)
CREATE POLICY "Anyone can view active access codes" ON public.access_codes
  FOR SELECT USING (is_active = TRUE);

-- Only admins can manage access codes
CREATE POLICY "Admins can manage access codes" ON public.access_codes
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Insert some demo users with proper profiles data
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'admin@nexa.gg', crypt('adminmode123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"username": "CommanderX", "ign": "CommanderX", "role": "admin"}'),
  ('550e8400-e29b-41d4-a716-446655440001', 'slayer@nexa.gg', crypt('12345678', gen_salt('bf')), NOW(), NOW(), NOW(), '{"username": "TacticalSlayer", "ign": "TacticalSlayer", "role": "player"}')
ON CONFLICT (id) DO NOTHING;

-- Manually insert profiles for demo users (since trigger might not fire on direct insert)
INSERT INTO public.profiles (id, username, ign, role, tier, kills, attendance)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'CommanderX', 'CommanderX', 'admin', 'Elite', 250, 95.5),
  ('550e8400-e29b-41d4-a716-446655440001', 'TacticalSlayer', 'TacticalSlayer', 'player', 'Veteran', 180, 87.2)
ON CONFLICT (id) DO NOTHING;
