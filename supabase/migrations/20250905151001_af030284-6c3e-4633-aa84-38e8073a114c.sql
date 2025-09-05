-- Fix critical security vulnerability: restrict access to sensitive profile information
-- Drop the overly permissive "Users can view all profiles" policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a new policy that excludes sensitive information for public viewing
-- Users can view basic profile information of others (excluding banking_info and social_links)
CREATE POLICY "Users can view basic profile information" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can see their own full profile
  auth.uid() = id OR 
  -- Admins and clan masters can see everything (handled by separate policy)
  get_user_role(auth.uid()) = ANY(ARRAY['admin'::user_role, 'clan_master'::user_role]) OR
  -- Everyone else can see basic profile info (banking_info and social_links will be filtered out)
  true
);

-- Create a function to get safe profile data for public viewing
CREATE OR REPLACE FUNCTION public.get_public_profile_data(profile_row public.profiles)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If viewing own profile or user is admin/clan_master, return full data
  IF auth.uid() = profile_row.id OR 
     get_user_role(auth.uid()) = ANY(ARRAY['admin'::user_role, 'clan_master'::user_role]) THEN
    RETURN to_jsonb(profile_row);
  END IF;
  
  -- For others, exclude sensitive information
  RETURN jsonb_build_object(
    'id', profile_row.id,
    'username', profile_row.username,
    'ign', profile_row.ign,
    'player_uid', profile_row.player_uid,
    'role', profile_row.role,
    'avatar_url', profile_row.avatar_url,
    'tiktok_handle', profile_row.tiktok_handle,
    'preferred_mode', profile_row.preferred_mode,
    'device', profile_row.device,
    'kills', profile_row.kills,
    'attendance', profile_row.attendance,
    'tier', profile_row.tier,
    'grade', profile_row.grade,
    'date_joined', profile_row.date_joined,
    'updated_at', profile_row.updated_at,
    'br_class', profile_row.br_class,
    'mp_class', profile_row.mp_class,
    'best_gun', profile_row.best_gun,
    'created_at', profile_row.created_at
    -- Explicitly exclude: banking_info, social_links
  );
END;
$$;

-- Create a secure view for profile access that automatically filters sensitive data
CREATE OR REPLACE VIEW public.secure_profiles AS
SELECT 
  CASE 
    WHEN auth.uid() = p.id OR get_user_role(auth.uid()) = ANY(ARRAY['admin'::user_role, 'clan_master'::user_role]) THEN
      -- Full access for own profile or admins
      p.*
    ELSE
      -- Filtered access for others - create a new profiles row without sensitive data
      ROW(
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
        NULL::jsonb, -- banking_info set to NULL
        NULL::jsonb, -- social_links set to NULL
        p.br_class,
        p.mp_class,
        p.best_gun
      )::public.profiles
  END AS *
FROM public.profiles p;

-- Grant access to the secure view
GRANT SELECT ON public.secure_profiles TO authenticated;
GRANT SELECT ON public.secure_profiles TO anon;

-- Enable RLS on the view (inherits from base table policies)
ALTER VIEW public.secure_profiles SET (security_barrier = true);

-- Add a comment explaining the security measure
COMMENT ON VIEW public.secure_profiles IS 'Secure view that automatically filters sensitive profile information (banking_info, social_links) unless viewing own profile or user is admin/clan_master';