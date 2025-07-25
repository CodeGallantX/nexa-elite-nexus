/*
  # Update Grade and Tier System

  1. Database Changes
    - Update grade field to use new grade system (Legendary, Veteran, Pro, Elite, Rookie)
    - Update tier field to use numeric system (1, 2, 3, 4)
    - Add constraints for new values

  2. Data Migration
    - Migrate existing grade data to new system
    - Update tier values to numeric system
*/

-- Update existing grade values to new system
UPDATE public.profiles 
SET grade = CASE 
  WHEN grade = 'A' THEN 'Legendary'
  WHEN grade = 'B' THEN 'Veteran' 
  WHEN grade = 'C' THEN 'Pro'
  WHEN grade = 'D' THEN 'Elite'
  ELSE 'Rookie'
END;

-- Update existing tier values to numeric system
UPDATE public.profiles 
SET tier = CASE 
  WHEN tier = 'Legendary' THEN '1'
  WHEN tier = 'Veteran' THEN '2'
  WHEN tier = 'Pro' THEN '3'
  WHEN tier = 'Elite' THEN '4'
  ELSE '4'
END;

-- Add check constraints for new grade and tier values
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_grade_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_grade_check 
CHECK (grade IN ('Legendary', 'Veteran', 'Pro', 'Elite', 'Rookie'));

ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_tier_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_tier_check 
CHECK (tier IN ('1', '2', '3', '4'));

-- Update default values
ALTER TABLE public.profiles 
ALTER COLUMN grade SET DEFAULT 'Rookie';

ALTER TABLE public.profiles 
ALTER COLUMN tier SET DEFAULT '4';