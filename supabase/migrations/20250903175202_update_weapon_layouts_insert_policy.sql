
-- Update the RLS policy for uploading to weapon-layouts to include the owner check

-- Drop the old policy
DROP POLICY IF EXISTS "Allow authenticated users to upload to weapon-layouts" ON storage.objects;

-- Create the new policy
CREATE POLICY "Allow authenticated users to upload to weapon-layouts"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'weapon-layouts' AND owner = auth.uid());
