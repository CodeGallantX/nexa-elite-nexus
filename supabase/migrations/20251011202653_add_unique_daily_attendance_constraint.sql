-- Add created_at column to attendance table
ALTER TABLE public.attendance
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT NOW();

-- Create a function to cast timestamptz to date in a specific timezone (UTC)
-- This is necessary because the default `::date` cast is not immutable
CREATE OR REPLACE FUNCTION immutable_date(t timestamptz)
RETURNS date AS $$
  SELECT (t AT TIME ZONE 'UTC')::date;
$$ LANGUAGE sql IMMUTABLE;

-- Remove duplicate attendance records before creating the unique index.
-- This keeps the most recent attendance record for each lobby on a given day.
WITH duplicates AS (
    SELECT
        ctid,
        ROW_NUMBER() OVER (
            PARTITION BY lobby, immutable_date(created_at)
            ORDER BY created_at DESC
        ) as rn
    FROM
        public.attendance
)
DELETE FROM
    public.attendance
WHERE
    ctid IN (SELECT ctid FROM duplicates WHERE rn > 1);

-- Create a unique index on lobby and the date of creation using the immutable function
CREATE UNIQUE INDEX IF NOT EXISTS unique_daily_attendance_per_lobby
ON public.attendance (lobby, (immutable_date(created_at)));

-- Add a comment to the new column
COMMENT ON COLUMN public.attendance.created_at IS 'Timestamp of when the attendance was recorded';
