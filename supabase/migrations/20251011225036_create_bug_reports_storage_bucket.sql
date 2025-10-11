-- Create the storage bucket for bug reports
INSERT INTO storage.buckets (id, name, public) VALUES ('bug-reports', 'bug-reports', true);

-- Create RLS policies for the bug-reports bucket
-- Allow users to upload files to their own folder
CREATE POLICY "Allow users to upload to their own folder" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'bug-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view their own files
CREATE POLICY "Allow users to view their own files" ON storage.objects FOR SELECT USING (bucket_id = 'bug-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow admins to view all files
CREATE POLICY "Allow admins to view all files" ON storage.objects FOR SELECT USING (bucket_id = 'bug-reports' AND get_user_role(auth.uid()) = ANY (ARRAY['admin'::user_role, 'clan_master'::user_role, 'moderator'::user_role]));
