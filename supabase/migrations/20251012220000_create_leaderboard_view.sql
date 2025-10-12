DROP VIEW IF EXISTS public.weekly_leaderboard;
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  id,
  username,
  ign,
  avatar_url,
  tier,
  grade,
  status,
  br_kills,
  mp_kills,
  kills as total_kills
FROM public.profiles;
