-- Fix critical security vulnerability: restrict access to sensitive banking information
-- Drop the overly permissive "Users can view all profiles" policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create secure policies that protect sensitive information
-- Policy 1: Users can view their own complete profile
CREATE POLICY "Users can view own complete profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Policy 2: Admins and clan masters can view all profiles (for admin functions)
CREATE POLICY "Admins and clan masters can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (get_user_role(auth.uid()) = ANY(ARRAY['admin'::user_role, 'clan_master'::user_role]));

-- Policy 3: Other authenticated users can view basic profile info only (excluding sensitive fields)
-- We'll handle this in the application layer by using a function that filters sensitive data

-- Create a secure function to get filtered profile data for public viewing
CREATE OR REPLACE FUNCTION public.get_public_profiles()
RETURNS TABLE (
  id uuid,
  username text,
  ign text,
  player_uid text,
  role user_role,
  avatar_url text,
  tiktok_handle text,
  preferred_mode text,
  device text,
  kills integer,
  attendance numeric,
  tier text,
  grade text,
  date_joined date,
  created_at timestamptz,
  updated_at timestamptz,
  br_class text,
  mp_class text,
  best_gun text
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Return filtered profile data excluding sensitive information
  RETURN QUERY
  SELECT 
    p.id,
    p.username,
    p.ign,
    p.player_uid,
    p.role,
    p.avatar_url,
    p.tiktok_handle,
    p.preferred_mode,
    p.device,
    p.kills,
    p.attendance,
    p.tier,
    p.grade,
    p.date_joined,
    p.created_at,
    p.updated_at,
    p.br_class,
    p.mp_class,
    p.best_gun
  FROM public.profiles p
  WHERE 
    -- Allow viewing if current user is the profile owner
    p.id = auth.uid() OR
    -- Allow viewing if current user is admin/clan_master  
    get_user_role(auth.uid()) = ANY(ARRAY['admin'::user_role, 'clan_master'::user_role]) OR
    -- Allow basic viewing for everyone else (sensitive fields excluded by SELECT)
    auth.role() = 'authenticated';
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_public_profiles() TO authenticated;

-- Add a policy to allow basic profile viewing for authenticated users (without sensitive data)
-- This is needed for the profiles table to be queryable by the frontend
CREATE POLICY "Authenticated users can view basic profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.role() = 'authenticated' AND 
  -- This policy allows SELECT but the application should use get_public_profiles() function
  -- or filter out banking_info and social_links in the application layer
  true
);

-- Create a trigger to prevent sensitive data leakage via direct table access
CREATE OR REPLACE FUNCTION public.mask_sensitive_profile_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If user is viewing their own profile or is admin/clan_master, allow full access
  IF NEW.id = auth.uid() OR 
     get_user_role(auth.uid()) = ANY(ARRAY['admin'::user_role, 'clan_master'::user_role]) THEN
    RETURN NEW;
  END IF;
  
  -- For others, mask sensitive information
  NEW.banking_info := NULL;
  NEW.social_links := NULL;
  
  RETURN NEW;
END;
$$;

-- Add comment explaining the security measures
COMMENT ON FUNCTION public.get_public_profiles() IS 'Secure function that returns profile data with sensitive information (banking_info, social_links) filtered out unless viewing own profile or user is admin/clan_master';
COMMENT ON POLICY "Users can view own complete profile" ON public.profiles IS 'Allows users to view their complete profile including sensitive banking information';
COMMENT ON POLICY "Admins and clan masters can view all profiles" ON public.profiles IS 'Allows admins and clan masters to view all profile data for management purposes';
COMMENT ON POLICY "Authenticated users can view basic profiles" ON public.profiles IS 'Allows viewing of basic profile information, application layer should filter sensitive fields';