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
  
  -- Migrate any data from value_per_code to code_value if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'giveaways' 
    AND column_name = 'value_per_code'
  ) THEN
    -- First ensure code_value column exists
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'giveaways' 
      AND column_name = 'code_value'
    ) THEN
      -- Copy data from value_per_code to new code_value column
      ALTER TABLE public.giveaways ADD COLUMN code_value DECIMAL(10, 2);
      UPDATE public.giveaways SET code_value = value_per_code;
      ALTER TABLE public.giveaways ALTER COLUMN code_value SET NOT NULL;
      ALTER TABLE public.giveaways ADD CONSTRAINT giveaways_code_value_check CHECK (code_value > 0);
    END IF;
    -- Now drop the old column
    ALTER TABLE public.giveaways DROP COLUMN IF EXISTS value_per_code;
  END IF;
END $$;
