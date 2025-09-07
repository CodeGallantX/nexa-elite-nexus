-- Fix admin dashboard stats view to correctly calculate total kills from profiles
CREATE OR REPLACE VIEW public.admin_dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'player') as total_players,
  (SELECT COUNT(*) FROM public.events) as total_events,
  (SELECT COALESCE(SUM(kills), 0) FROM public.profiles) as total_kills,
  (SELECT COALESCE(AVG(attendance), 0) FROM public.profiles WHERE role = 'player') as avg_attendance,
  (SELECT COUNT(*) FROM public.weapon_layouts) as total_loadouts;

-- Grant select permissions on the view
GRANT SELECT ON public.admin_dashboard_stats TO authenticated;