-- Drop the old unique index
DROP INDEX IF EXISTS unique_daily_attendance_per_lobby;

-- Create a new unique index that includes the attendance_type
CREATE UNIQUE INDEX IF NOT EXISTS unique_daily_attendance_per_lobby_and_type
ON public.attendance (lobby, attendance_type, (immutable_date(created_at)));
