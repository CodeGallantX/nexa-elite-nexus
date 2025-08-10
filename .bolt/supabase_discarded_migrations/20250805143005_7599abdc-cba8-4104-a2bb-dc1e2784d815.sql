-- Fix profiles grade constraint to allow proper values and create cumulative kill tracking

-- First, let's see what the current grade constraint is and drop it
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_grade_check;

-- Create a new constraint that allows the correct grade values
ALTER TABLE public.profiles ADD CONSTRAINT profiles_grade_check 
CHECK (grade IN ('Legendary', 'Master', 'Pro', 'Elite', 'Rookie'));

-- Function to calculate and update total kills from attendance records
CREATE OR REPLACE FUNCTION public.update_player_total_kills()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the player's total kills based on attendance records
  UPDATE public.profiles
  SET kills = (
    SELECT COALESCE(SUM(event_kills), 0)
    FROM public.attendance
    WHERE player_id = COALESCE(NEW.player_id, OLD.player_id)
    AND status = 'present'
  )
  WHERE id = COALESCE(NEW.player_id, OLD.player_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger to automatically update kills when attendance is added/updated/deleted
DROP TRIGGER IF EXISTS update_kills_on_attendance_change ON public.attendance;
CREATE TRIGGER update_kills_on_attendance_change
  AFTER INSERT OR UPDATE OR DELETE ON public.attendance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_player_total_kills();

-- Update all existing player kills based on current attendance records
UPDATE public.profiles
SET kills = (
  SELECT COALESCE(SUM(a.event_kills), 0)
  FROM public.attendance a
  WHERE a.player_id = profiles.id
  AND a.status = 'present'
);

-- Remove the manual increment_total_kills function since we now auto-calculate
DROP FUNCTION IF EXISTS public.increment_total_kills(uuid, integer);