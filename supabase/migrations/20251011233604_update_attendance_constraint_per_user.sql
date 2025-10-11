-- Drop the old unique index
DROP INDEX IF EXISTS unique_daily_attendance_per_lobby_and_type;

-- Create a new unique index that includes the player_id
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_daily_attendance
ON public.attendance (player_id, lobby, attendance_type, (immutable_date(created_at)));
