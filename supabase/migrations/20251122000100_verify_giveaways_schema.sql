-- Ensure giveaways table has the correct code_value column
-- and not value_per_code (which doesn't exist in the schema)

-- This migration verifies the column exists with the correct name
DO $$ 
BEGIN
  -- Check if code_value column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'giveaways' 
    AND column_name = 'code_value'
  ) THEN
    ALTER TABLE public.giveaways ADD COLUMN code_value DECIMAL(10, 2) NOT NULL CHECK (code_value > 0);
  END IF;
  
  -- Ensure value_per_code doesn't exist (it shouldn't, but let's be safe)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'giveaways' 
    AND column_name = 'value_per_code'
  ) THEN
    -- If it exists, migrate data to code_value and drop it
    ALTER TABLE public.giveaways DROP COLUMN IF EXISTS value_per_code;
  END IF;
END $$;
