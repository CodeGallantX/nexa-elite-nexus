CREATE OR REPLACE VIEW public.weekly_leaderboard AS
SELECT 
  p.id,
  p.username,
  p.ign,
  p.avatar_url,
  p.tier,
  p.grade,
  COALESCE(SUM(a.br_kills), 0) as weekly_br_kills,
  COALESCE(SUM(a.mp_kills), 0) as weekly_mp_kills,
  COALESCE(SUM(a.br_kills), 0) + COALESCE(SUM(a.mp_kills), 0) as weekly_total_kills,
  p.br_kills as total_br_kills,
  p.mp_kills as total_mp_kills,
  COALESCE(p.br_kills, 0) + COALESCE(p.mp_kills, 0) as total_kills,
  p.status
FROM public.profiles p
LEFT JOIN public.attendance a ON p.id = a.player_id 
  AND a.date >= CURRENT_DATE - INTERVAL '7 days'
  AND a.status = 'present'
GROUP BY p.id;
