-- Fix activity triggers to use correct columns
DROP TRIGGER IF EXISTS log_profile_changes ON profiles;
DROP TRIGGER IF EXISTS log_event_changes ON events;
DROP TRIGGER IF EXISTS log_attendance_changes ON attendance;

-- Recreate profile activity function with correct schema
CREATE OR REPLACE FUNCTION log_profile_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO activities (
            action_type,
            category,
            performed_by,
            target_user_id,
            details
        ) VALUES (
            'update_player',
            'profile',
            auth.uid(),
            NEW.id,
            jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW))
        );
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO activities (
            action_type,
            category,
            performed_by,
            target_user_id,
            details
        ) VALUES (
            'delete_player',
            'profile',
            auth.uid(),
            OLD.id,
            jsonb_build_object('deleted', row_to_json(OLD))
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate event activity function with correct schema
CREATE OR REPLACE FUNCTION log_event_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO activities (
            action_type,
            category,
            performed_by,
            details
        ) VALUES (
            'create_event',
            'event',
            auth.uid(),
            jsonb_build_object('event', row_to_json(NEW))
        );
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO activities (
            action_type,
            category,
            performed_by,
            details
        ) VALUES (
            'update_event',
            'event',
            auth.uid(),
            jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW))
        );
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO activities (
            action_type,
            category,
            performed_by,
            details
        ) VALUES (
            'delete_event',
            'event',
            auth.uid(),
            jsonb_build_object('deleted', row_to_json(OLD))
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate attendance activity function with correct schema
CREATE OR REPLACE FUNCTION log_attendance_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.event_kills IS DISTINCT FROM NEW.event_kills THEN
        INSERT INTO activities (
            action_type,
            category,
            performed_by,
            target_user_id,
            details
        ) VALUES (
            'update_kills',
            'attendance',
            auth.uid(),
            NEW.player_id,
            jsonb_build_object(
                'old_kills', OLD.event_kills,
                'new_kills', NEW.event_kills,
                'event_id', NEW.event_id
            )
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate triggers
CREATE TRIGGER log_profile_changes
    AFTER UPDATE OR DELETE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION log_profile_activity();

CREATE TRIGGER log_event_changes
    AFTER INSERT OR UPDATE OR DELETE ON events
    FOR EACH ROW
    EXECUTE FUNCTION log_event_activity();

CREATE TRIGGER log_attendance_changes
    AFTER UPDATE ON attendance
    FOR EACH ROW
    EXECUTE FUNCTION log_attendance_activity();

-- Function to delete user completely with proper cleanup
CREATE OR REPLACE FUNCTION public.delete_user_completely(user_id_to_delete uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_role user_role;
BEGIN
  -- Get current user's role
  SELECT role INTO current_user_role 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  -- Only allow admins and clan masters to delete users
  IF current_user_role NOT IN ('admin', 'clan_master') THEN
    RAISE EXCEPTION 'Only admins and clan masters can delete users';
  END IF;
  
  -- Delete related records first (in order of dependencies)
  DELETE FROM public.notifications WHERE user_id = user_id_to_delete;
  DELETE FROM public.push_subscriptions WHERE user_id = user_id_to_delete;
  DELETE FROM public.activities WHERE performed_by = user_id_to_delete OR target_user_id = user_id_to_delete;
  DELETE FROM public.bug_reports WHERE reporter_id = user_id_to_delete;
  DELETE FROM public.chat_messages WHERE user_id = user_id_to_delete;
  DELETE FROM public.attendance WHERE player_id = user_id_to_delete OR marked_by = user_id_to_delete;
  DELETE FROM public.event_participants WHERE player_id = user_id_to_delete;
  DELETE FROM public.events WHERE created_by = user_id_to_delete;
  DELETE FROM public.loadouts WHERE player_id = user_id_to_delete;
  DELETE FROM public.weapon_layouts WHERE player_id = user_id_to_delete;
  UPDATE public.giveaway_codes SET redeemed_by = NULL WHERE redeemed_by = user_id_to_delete;
  DELETE FROM public.giveaways WHERE created_by = user_id_to_delete;
  DELETE FROM public.wallets WHERE user_id = user_id_to_delete;
  DELETE FROM public.profiles WHERE id = user_id_to_delete;
  DELETE FROM auth.users WHERE id = user_id_to_delete;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error deleting user: %', SQLERRM;
    RETURN false;
END;
$$;

-- Drop and recreate redeem_giveaway_code to add notification creation
DROP FUNCTION IF EXISTS public.redeem_giveaway_code(TEXT);

CREATE OR REPLACE FUNCTION public.redeem_giveaway_code(p_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_user_id UUID;
    v_code_record RECORD;
    v_wallet_id UUID;
    v_new_balance DECIMAL(10, 2);
    v_redeemer_ign TEXT;
    v_giveaway_title TEXT;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    -- Get redeemer IGN
    SELECT ign INTO v_redeemer_ign FROM profiles WHERE id = v_user_id;

    -- Get code details with lock
    SELECT * INTO v_code_record
    FROM giveaway_codes
    WHERE code = UPPER(p_code)
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid code');
    END IF;

    IF v_code_record.is_redeemed THEN
        RETURN jsonb_build_object('success', false, 'message', 'Code already redeemed');
    END IF;

    IF v_code_record.expires_at < NOW() THEN
        RETURN jsonb_build_object('success', false, 'message', 'Code expired');
    END IF;

    -- Get giveaway title
    SELECT title INTO v_giveaway_title FROM giveaways WHERE id = v_code_record.giveaway_id;

    -- Get or create user wallet
    SELECT id INTO v_wallet_id FROM wallets WHERE user_id = v_user_id;
    IF NOT FOUND THEN
        INSERT INTO wallets (user_id, balance) VALUES (v_user_id, 0) RETURNING id INTO v_wallet_id;
    END IF;

    -- Credit wallet
    UPDATE wallets
    SET balance = balance + v_code_record.value, updated_at = NOW()
    WHERE id = v_wallet_id
    RETURNING balance INTO v_new_balance;

    -- Record transaction
    INSERT INTO transactions (wallet_id, amount, type, status, reference)
    VALUES (v_wallet_id, v_code_record.value, 'giveaway_redeemed', 'success', 'redeem_' || p_code);

    -- Mark code as redeemed
    UPDATE giveaway_codes
    SET is_redeemed = true, redeemed_by = v_user_id, redeemed_at = NOW()
    WHERE id = v_code_record.id;

    -- Update giveaway stats
    UPDATE giveaways
    SET redeemed_count = redeemed_count + 1,
        redeemed_amount = redeemed_amount + v_code_record.value,
        updated_at = NOW()
    WHERE id = v_code_record.giveaway_id;

    -- Create notifications for all other users about the redemption
    INSERT INTO notifications (type, title, message, data)
    SELECT 
        'giveaway_redeemed',
        '🎉 Code Redeemed!',
        v_redeemer_ign || ' just redeemed ₦' || v_code_record.value || ' from ' || v_giveaway_title,
        jsonb_build_object(
            'giveaway_id', v_code_record.giveaway_id,
            'redeemer', v_redeemer_ign,
            'amount', v_code_record.value
        )
    FROM profiles
    WHERE id != v_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'amount', v_code_record.value,
        'new_balance', v_new_balance,
        'message', 'Successfully redeemed ₦' || v_code_record.value
    );
END;
$$;