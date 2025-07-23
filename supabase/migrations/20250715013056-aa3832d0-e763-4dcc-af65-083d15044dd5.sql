
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'player', 'moderator');
CREATE TYPE event_type AS ENUM ('MP', 'BR');
CREATE TYPE attendance_status AS ENUM ('present', 'absent');

-- Added more event_types
ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'Tournament';
ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'Scrims';


-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  ign TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'player',
  avatar_url TEXT,
  tiktok_handle TEXT,
  preferred_mode TEXT,
  device TEXT,
  kills INTEGER DEFAULT 0,
  attendance DECIMAL(5,2) DEFAULT 0.00,
  tier TEXT DEFAULT 'Rookie',
  grade CHAR(1) DEFAULT 'D',
  date_joined DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type event_type NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'upcoming',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create event_groups table for organizing players
CREATE TABLE public.event_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  max_players INTEGER DEFAULT 4,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create event_participants table
CREATE TABLE public.event_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.event_groups(id) ON DELETE SET NULL,
  role TEXT,
  kills INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, player_id)
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  status attendance_status NOT NULL,
  attendance_type event_type NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  marked_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, event_id)
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  channel TEXT NOT NULL DEFAULT 'general',
  message TEXT NOT NULL,
  attachment_url TEXT,
  attachment_type TEXT,
  attachment_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id),
  scheduled_for TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for events
CREATE POLICY "Anyone can view events" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage events" ON public.events
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for event_groups
CREATE POLICY "Anyone can view event groups" ON public.event_groups
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage event groups" ON public.event_groups
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for event_participants
CREATE POLICY "Anyone can view event participants" ON public.event_participants
  FOR SELECT USING (true);

CREATE POLICY "Players can update own participation" ON public.event_participants
  FOR UPDATE USING (auth.uid() = player_id);

CREATE POLICY "Admins can manage all participants" ON public.event_participants
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for attendance
CREATE POLICY "Anyone can view attendance" ON public.attendance
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage attendance" ON public.attendance
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages in accessible channels" ON public.chat_messages
  FOR SELECT USING (
    channel = 'general' OR 
    (channel = 'admin' AND public.get_user_role(auth.uid()) = 'admin')
  );

CREATE POLICY "Users can send messages" ON public.chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    (channel = 'general' OR 
     (channel = 'admin' AND public.get_user_role(auth.uid()) = 'admin'))
  );

-- RLS Policies for announcements
CREATE POLICY "Anyone can view published announcements" ON public.announcements
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage announcements" ON public.announcements
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Create storage bucket for chat attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-attachments', 'chat-attachments', true);

-- Storage policies for chat attachments
CREATE POLICY "Anyone can view chat attachments" ON storage.objects
  FOR SELECT USING (bucket_id = 'chat-attachments');

CREATE POLICY "Authenticated users can upload chat attachments" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'chat-attachments' AND 
    auth.role() = 'authenticated'
  );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, ign, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'Player' || substring(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'ign', 'Player' || substring(NEW.id::text, 1, 8)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'player')
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update attendance percentage
CREATE OR REPLACE FUNCTION public.update_attendance_percentage()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.profiles
  SET attendance = (
    SELECT COALESCE(
      ROUND(
        (COUNT(*) FILTER (WHERE status = 'present')::DECIMAL / 
         NULLIF(COUNT(*), 0)) * 100, 2
      ), 0.00
    )
    FROM public.attendance
    WHERE player_id = COALESCE(NEW.player_id, OLD.player_id)
  )
  WHERE id = COALESCE(NEW.player_id, OLD.player_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger to update attendance percentage
CREATE TRIGGER update_attendance_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.attendance
  FOR EACH ROW EXECUTE FUNCTION public.update_attendance_percentage();
