import { supabase } from '@/integrations/supabase/client';

export interface ActivityLog {
  action_type: string;
  action_description: string;
  target_user_id?: string;
  old_value?: any;
  new_value?: any;
}

export const logActivity = async (activity: ActivityLog) => {
  try {
    const { error } = await supabase
      .from('activities')
      .insert([{
        ...activity,
        performed_by: (await supabase.auth.getUser()).data.user?.id,
      }]);

    if (error) {
      console.error('Error logging activity:', error);
    }
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Helper functions for common activity types
export const logPlayerUpdate = async (playerId: string, playerIGN: string, oldValues: any, newValues: any) => {
  await logActivity({
    action_type: 'update_player',
    action_description: `Updated player ${playerIGN}`,
    target_user_id: playerId,
    old_value: oldValues,
    new_value: newValues,
  });
};

export const logPlayerDelete = async (playerId: string, playerIGN: string) => {
  await logActivity({
    action_type: 'delete_player',
    action_description: `Deleted player ${playerIGN}`,
    target_user_id: playerId,
  });
};

export const logEventCreate = async (eventName: string, eventData: any) => {
  await logActivity({
    action_type: 'create_event',
    action_description: `Created event "${eventName}"`,
    new_value: eventData,
  });
};

export const logEventUpdate = async (eventName: string, oldValues: any, newValues: any) => {
  await logActivity({
    action_type: 'update_event',
    action_description: `Updated event "${eventName}"`,
    old_value: oldValues,
    new_value: newValues,
  });
};

export const logEventDelete = async (eventName: string) => {
  await logActivity({
    action_type: 'delete_event',
    action_description: `Deleted event "${eventName}"`,
  });
};

export const logEventStatusUpdate = async (eventName: string, oldStatus: string, newStatus: string) => {
  await logActivity({
    action_type: 'update_event_status',
    action_description: `Changed event "${eventName}" status from ${oldStatus} to ${newStatus}`,
    old_value: { status: oldStatus },
    new_value: { status: newStatus },
  });
};

export const logPlayerBan = async (playerId: string, playerIGN: string, reason: string) => {
  await logActivity({
    action_type: 'ban_player',
    action_description: `Banned player ${playerIGN}`,
    target_user_id: playerId,
    new_value: { reason, banned_at: new Date().toISOString() },
  });
};

export const logPlayerUnban = async (playerId: string, playerIGN: string) => {
  await logActivity({
    action_type: 'unban_player',
    action_description: `Unbanned player ${playerIGN}`,
    target_user_id: playerId,
  });
};

export const logRoleChange = async (playerId: string, playerIGN: string, oldRole: string, newRole: string) => {
  await logActivity({
    action_type: 'change_role',
    action_description: `Changed ${playerIGN}'s role from ${oldRole} to ${newRole}`,
    target_user_id: playerId,
    old_value: { role: oldRole },
    new_value: { role: newRole },
  });
};