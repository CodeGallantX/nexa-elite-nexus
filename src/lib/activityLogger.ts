import { supabase } from '@/integrations/supabase/client';

export interface ActivityLog {
  action_type: string;
  category: string;
  details: any;
  target_user_id?: string;
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
export const logPlayerProfileUpdate = async (playerId: string, playerIGN: string, oldValues: any, newValues: any) => {
  await logActivity({
    action_type: 'update_player_profile',
    category: 'Player Management',
    details: {
      description: `Updated ${playerIGN}'s profile information`,
      old_value: oldValues,
      new_value: newValues,
    },
    target_user_id: playerId,
  });
};

export const logPlayerKillsUpdate = async (playerId: string, playerIGN: string, oldKills: number, newKills: number, method: 'manual' | 'attendance') => {
  const actionType = method === 'manual' ? 'update_player_kills_manual' : 'update_player_kills_attendance';
  const description = method === 'manual' 
    ? `Manually updated ${playerIGN}'s total kill count from ${oldKills} to ${newKills}`
    : `Updated ${playerIGN}'s kill count via attendance from ${oldKills} to ${newKills}`;
    
  await logActivity({
    action_type: actionType,
    category: 'Player Management',
    details: {
      description: description,
      old_value: { kills: oldKills, method },
      new_value: { kills: newKills, method },
    },
    target_user_id: playerId,
  });
};

export const logAttendanceUpdate = async (playerId: string, playerIGN: string, eventName: string, status: string, kills?: number) => {
  const description = kills !== undefined 
    ? `Set ${playerIGN}'s attendance for "${eventName}" to ${status} with ${kills} kills`
    : `Set ${playerIGN}'s attendance for "${eventName}" to ${status}`;
    
  await logActivity({
    action_type: 'update_attendance',
    category: 'Attendance',
    details: {
      description: description,
      event: eventName,
      status: status,
      kills: kills,
    },
    target_user_id: playerId,
  });
};

export const logPlayerDelete = async (playerId: string, playerIGN: string) => {
  await logActivity({
    action_type: 'delete_player',
    category: 'Player Management',
    details: { description: `Deleted player ${playerIGN}` },
    target_user_id: playerId,
  });
};

export const logEventCreate = async (eventName: string, eventData: any) => {
  await logActivity({
    action_type: 'create_event',
    category: 'Events',
    details: { 
      description: `Created event "${eventName}"`,
      event_data: eventData,
    },
  });
};

export const logEventUpdate = async (eventName: string, oldValues: any, newValues: any) => {
  await logActivity({
    action_type: 'update_event',
    category: 'Events',
    details: {
      description: `Updated event "${eventName}"`,
      old_value: oldValues,
      new_value: newValues,
    },
  });
};

export const logEventDelete = async (eventName: string) => {
  await logActivity({
    action_type: 'delete_event',
    category: 'Events',
    details: { description: `Deleted event "${eventName}"` },
  });
};

export const logEventStatusUpdate = async (eventName: string, oldStatus: string, newStatus: string) => {
  await logActivity({
    action_type: 'update_event_status',
    category: 'Events',
    details: {
      description: `Changed event "${eventName}" status from ${oldStatus} to ${newStatus}`,
      old_value: { status: oldStatus },
      new_value: { status: newStatus },
    },
  });
};

export const logPlayerBan = async (playerId: string, playerIGN: string, reason: string) => {
  await logActivity({
    action_type: 'ban_player',
    category: 'Moderation',
    details: {
      description: `Banned player ${playerIGN}`,
      reason: reason,
      banned_at: new Date().toISOString(),
    },
    target_user_id: playerId,
  });
};

export const logPlayerUnban = async (playerId: string, playerIGN: string) => {
  await logActivity({
    action_type: 'unban_player',
    category: 'Moderation',
    details: { description: `Unbanned player ${playerIGN}` },
    target_user_id: playerId,
  });
};

export const logRoleChange = async (playerId: string, playerIGN: string, oldRole: string, newRole: string) => {
  await logActivity({
    action_type: 'change_role',
    category: 'Player Management',
    details: {
      description: `Changed ${playerIGN}'s role from ${oldRole} to ${newRole}`,
      old_value: { role: oldRole },
      new_value: { role: newRole },
    },
    target_user_id: playerId,
  });
};

export const logKillReset = async () => {
  await logActivity({
    action_type: 'reset_all_kills',
    category: 'Superadmin',
    details: { description: 'Superadmin reset all player kills' },
  });
};

export const logAttendanceReset = async () => {
  await logActivity({
    action_type: 'reset_all_attendance',
    category: 'Superadmin',
    details: { description: 'Superadmin reset all player attendance' },
  });
};