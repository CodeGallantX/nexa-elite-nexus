-- Drop the incorrect unique index that uses created_at
DROP INDEX IF EXISTS unique_user_daily_attendance;

-- Create the correct unique index using the 'date' column
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_daily_attendance_on_date
ON public.attendance (player_id, lobby, attendance_type, date);
