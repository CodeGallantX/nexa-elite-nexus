-- Add lobby column to attendance table
ALTER TABLE public.attendance 
ADD COLUMN IF NOT EXISTS lobby integer DEFAULT 1;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_attendance_lobby ON public.attendance(lobby);

-- Add comment
COMMENT ON COLUMN public.attendance.lobby IS 'Lobby number for the attendance session (1-4)';