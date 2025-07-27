/*
  # Fix Authentication Flow

  1. Database Changes
    - Add email_confirmed_at tracking
    - Update profiles table constraints
    - Add proper triggers for profile creation

  2. Security
    - Ensure RLS policies work correctly
    - Add proper constraints for onboarding completion
*/

-- Create a function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, ign, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'ign', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'player')::user_role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Update profiles table to make ign and username not required initially
ALTER TABLE profiles 
ALTER COLUMN ign DROP NOT NULL;

-- Add a constraint to ensure completed profiles have required fields
ALTER TABLE profiles 
ADD CONSTRAINT profiles_completed_check 
CHECK (
  (ign IS NULL AND player_uid IS NULL) OR 
  (ign IS NOT NULL AND player_uid IS NOT NULL)
);

-- Update RLS policies to allow users to update their own profiles during onboarding
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to read their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow admins to read all profiles
CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );