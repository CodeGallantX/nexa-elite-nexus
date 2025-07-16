-- Allow anyone to insert access codes (needed for signup flow)
CREATE POLICY "Anyone can request access codes" 
ON public.access_codes 
FOR INSERT 
WITH CHECK (true);