-- Add is_private field to giveaways table
ALTER TABLE public.giveaways 
ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false;

-- Add comment to explain the field
COMMENT ON COLUMN public.giveaways.is_private IS 'If true, giveaway codes are generated but not broadcast in notifications';
