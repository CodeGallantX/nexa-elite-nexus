-- Create the bug report category enum
CREATE TYPE bug_category AS ENUM ('gameplay', 'ui', 'performance', 'other');

-- Create the bug report status enum
CREATE TYPE bug_status AS ENUM ('new', 'in_progress', 'resolved', 'not_a_bug');

-- Create the bug_reports table
CREATE TABLE public.bug_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category bug_category NOT NULL,
  description TEXT NOT NULL,
  file_url TEXT,
  status bug_status DEFAULT 'new' NOT NULL
);

-- Enable RLS
ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;

-- Grant access to the table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bug_reports TO authenticated;

-- RLS Policies
-- Players can insert their own bug reports
CREATE POLICY "Allow players to insert their own bug reports" ON public.bug_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Players can view their own bug reports
CREATE POLICY "Allow players to view their own bug reports" ON public.bug_reports FOR SELECT USING (auth.uid() = reporter_id);

-- Admins, clan masters, and moderators can view all bug reports
CREATE POLICY "Allow admins to view all bug reports" ON public.bug_reports FOR SELECT USING (get_user_role(auth.uid()) = ANY (ARRAY['admin'::user_role, 'clan_master'::user_role, 'moderator'::user_role]));

-- Admins, clan masters, and moderators can update all bug reports
CREATE POLICY "Allow admins to update all bug reports" ON public.bug_reports FOR UPDATE USING (get_user_role(auth.uid()) = ANY (ARRAY['admin'::user_role, 'clan_master'::user_role, 'moderator'::user_role]));
