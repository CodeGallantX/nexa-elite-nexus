
-- Drop the deprecated columns from the activities table
ALTER TABLE public.activities
DROP COLUMN IF EXISTS action_description,
DROP COLUMN IF EXISTS old_value,
DROP COLUMN IF EXISTS new_value;
