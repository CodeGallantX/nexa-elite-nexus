
-- Create weapon_layouts table
CREATE TABLE public.weapon_layouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('BR', 'MP', 'Both')),
  weapon_type TEXT NOT NULL CHECK (weapon_type IN ('AR', 'SMG', 'Sniper', 'LMG', 'Shotgun', 'Pistol', 'Marksman')),
  weapon_name TEXT NOT NULL,
  image_url TEXT,
  image_name TEXT,
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on weapon_layouts
ALTER TABLE public.weapon_layouts ENABLE ROW LEVEL SECURITY;

-- Allow users to view all weapon layouts
CREATE POLICY "Anyone can view weapon layouts" ON public.weapon_layouts
  FOR SELECT USING (TRUE);

-- Allow users to manage their own weapon layouts
CREATE POLICY "Users can manage their own weapon layouts" ON public.weapon_layouts
  FOR ALL USING (auth.uid() = player_id);

-- Allow admins to manage all weapon layouts
CREATE POLICY "Admins can manage all weapon layouts" ON public.weapon_layouts
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Create storage bucket for weapon layout images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('weapon-layouts', 'weapon-layouts', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for weapon layouts bucket
CREATE POLICY "Users can upload weapon layout images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'weapon-layouts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view weapon layout images" ON storage.objects
  FOR SELECT USING (bucket_id = 'weapon-layouts');

CREATE POLICY "Users can update their own weapon layout images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'weapon-layouts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own weapon layout images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'weapon-layouts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Update profiles table to include avatar_url if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for avatars bucket
CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Update trigger function to handle new user creation properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username, ign, role, tier, kills, attendance, grade, date_joined)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'Player' || substring(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'ign', 'Player' || substring(NEW.id::text, 1, 8)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'player'),
    COALESCE(NEW.raw_user_meta_data->>'tier', 'Rookie'),
    COALESCE((NEW.raw_user_meta_data->>'kills')::integer, 0),
    COALESCE((NEW.raw_user_meta_data->>'attendance')::numeric, 0.00),
    COALESCE(NEW.raw_user_meta_data->>'grade', 'D'),
    CURRENT_DATE
  );
  RETURN NEW;
END;
$function$;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
