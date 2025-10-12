UPDATE public.profiles
SET kills = COALESCE(br_kills, 0) + COALESCE(mp_kills, 0);
