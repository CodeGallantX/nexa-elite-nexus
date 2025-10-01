-- Add BR and MP kills columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS br_kills INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS mp_kills INTEGER DEFAULT 0;

-- Add BR and MP kills columns to attendance
ALTER TABLE public.attendance
ADD COLUMN IF NOT EXISTS br_kills INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS mp_kills INTEGER DEFAULT 0;

-- Add BR and MP kills columns to event_participants
ALTER TABLE public.event_participants
ADD COLUMN IF NOT EXISTS br_kills INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS mp_kills INTEGER DEFAULT 0;

-- Update existing kills to be distributed (for now, put all in total)
-- In production, you'd want to migrate data properly
UPDATE public.profiles SET br_kills = 0, mp_kills = 0 WHERE br_kills IS NULL OR mp_kills IS NULL;
UPDATE public.attendance SET br_kills = 0, mp_kills = 0 WHERE br_kills IS NULL OR mp_kills IS NULL;
UPDATE public.event_participants SET br_kills = 0, mp_kills = 0 WHERE br_kills IS NULL OR mp_kills IS NULL;

-- Update the trigger function to calculate total kills from BR + MP kills
CREATE OR REPLACE FUNCTION public.update_player_total_kills()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the player's total kills and BR/MP kills based on attendance records
  UPDATE public.profiles
  SET 
    br_kills = (
      SELECT COALESCE(SUM(br_kills), 0)
      FROM public.attendance
      WHERE player_id = COALESCE(NEW.player_id, OLD.player_id)
      AND status = 'present'
    ),
    mp_kills = (
      SELECT COALESCE(SUM(mp_kills), 0)
      FROM public.attendance
      WHERE player_id = COALESCE(NEW.player_id, OLD.player_id)
      AND status = 'present'
    ),
    kills = (
      SELECT COALESCE(SUM(br_kills), 0) + COALESCE(SUM(mp_kills), 0)
      FROM public.attendance
      WHERE player_id = COALESCE(NEW.player_id, OLD.player_id)
      AND status = 'present'
    )
  WHERE id = COALESCE(NEW.player_id, OLD.player_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create view for weekly leaderboard
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
  p.kills as total_kills
FROM public.profiles p
LEFT JOIN public.attendance a ON p.id = a.player_id 
  AND a.date >= CURRENT_DATE - INTERVAL '7 days'
  AND a.status = 'present'
WHERE p.role = 'player'
GROUP BY p.id, p.username, p.ign, p.avatar_url, p.tier, p.grade, p.br_kills, p.mp_kills, p.kills
ORDER BY weekly_total_kills DESC;

-- Grant access to the view
GRANT SELECT ON public.weekly_leaderboard TO authenticated;