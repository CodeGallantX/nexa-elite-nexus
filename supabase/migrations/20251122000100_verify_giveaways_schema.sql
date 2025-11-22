-- Ensure giveaways table has the correct code_value column
-- and not value_per_code (which doesn't exist in the schema)

-- This migration verifies the column exists with the correct name
DO $$ 
BEGIN
  -- Migrate any data from value_per_code to code_value if value_per_code exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'giveaways' 
    AND column_name = 'value_per_code'
  ) THEN
    -- Check if code_value already exists
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'giveaways' 
      AND column_name = 'code_value'
    ) THEN
      -- Rename the column
      ALTER TABLE public.giveaways RENAME COLUMN value_per_code TO code_value;
    ELSE
      -- Both columns exist (unlikely), copy data and drop old column
      UPDATE public.giveaways SET code_value = value_per_code WHERE code_value IS NULL;
      ALTER TABLE public.giveaways DROP COLUMN value_per_code;
    END IF;
  END IF;
  
  -- Ensure code_value column exists with correct constraints
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'giveaways' 
    AND column_name = 'code_value'
  ) THEN
    -- Table exists but missing code_value - this should not happen with proper migrations
    -- Add it with a default value temporarily, then remove the default
    ALTER TABLE public.giveaways ADD COLUMN code_value DECIMAL(10, 2) DEFAULT 0 NOT NULL;
    ALTER TABLE public.giveaways ALTER COLUMN code_value DROP DEFAULT;
    ALTER TABLE public.giveaways ADD CONSTRAINT giveaways_code_value_check CHECK (code_value > 0);
  END IF;
END $$;
