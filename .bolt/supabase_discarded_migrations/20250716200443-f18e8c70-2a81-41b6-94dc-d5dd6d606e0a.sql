-- Update access_codes table structure
ALTER TABLE public.access_codes 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '15 minutes'),
ADD COLUMN IF NOT EXISTS used BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS requested_by TEXT;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_access_codes_expires_at ON public.access_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_access_codes_requested_by ON public.access_codes(requested_by);

-- Create function to validate access code
CREATE OR REPLACE FUNCTION public.validate_access_code(code_input text, email_input text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.access_codes 
    WHERE code = code_input 
    AND requested_by = email_input
    AND used = false 
    AND expires_at > now()
    AND is_active = true
  );
END;
$$;

-- Create function to mark access code as used
CREATE OR REPLACE FUNCTION public.mark_access_code_used(code_input text, email_input text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.access_codes 
  SET used = true 
  WHERE code = code_input 
  AND requested_by = email_input
  AND used = false;
  
  RETURN FOUND;
END;
$$;

-- Update notifications table structure for admin alerts
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS action_data JSONB;

-- Create RLS policies for notifications
CREATE POLICY "Admins can manage all notifications" 
ON public.notifications 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id OR get_user_role(auth.uid()) = 'admin'::user_role);