
-- Add any missing columns to profiles table for full integration
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS banking_info JSONB;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_links JSONB;

-- Create indexes for better performance on admin queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_event_participants_player_id ON public.event_participants(player_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_event_id ON public.event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_attendance_player_id ON public.attendance(player_id);
CREATE INDEX IF NOT EXISTS idx_weapon_layouts_player_id ON public.weapon_layouts(player_id);

-- Add a view for admin dashboard statistics
CREATE OR REPLACE VIEW public.admin_dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'player') as total_players,
  (SELECT COUNT(*) FROM public.events) as total_events,
  (SELECT COALESCE(SUM(kills), 0) FROM public.event_participants) as total_kills,
  (SELECT COALESCE(AVG(attendance), 0) FROM public.profiles WHERE role = 'player') as avg_attendance,
  (SELECT COUNT(*) FROM public.weapon_layouts) as total_loadouts;

-- Grant select permissions on the view
GRANT SELECT ON public.admin_dashboard_stats TO authenticated;
