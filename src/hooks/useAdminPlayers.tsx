
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logPlayerProfileUpdate, logPlayerDelete } from '@/lib/activityLogger';

export const useAdminPlayers = () => {
  return useQuery({
    queryKey: ['admin-players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdatePlayer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      // Get current player data first for logging
      const { data: currentPlayer } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      const newUpdates = { ...updates };
      if (newUpdates.br_kills !== undefined || newUpdates.mp_kills !== undefined) {
        const br_kills = newUpdates.br_kills !== undefined ? newUpdates.br_kills : currentPlayer.br_kills;
        const mp_kills = newUpdates.mp_kills !== undefined ? newUpdates.mp_kills : currentPlayer.mp_kills;
        newUpdates.kills = (br_kills || 0) + (mp_kills || 0);
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(newUpdates)
        .eq('id', id)
        .select();

      if (error) throw error;

      // Log the activity with complete old and new data
      if (currentPlayer && data[0]) {
        await logPlayerProfileUpdate(id, currentPlayer.ign, currentPlayer, data[0]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-players'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: "Success",
        description: "Player updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating player:', error);
      toast({
        title: "Error",
        description: "Failed to update player",
        variant: "destructive",
      });
    },
  });
};

export const useDeletePlayer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (playerId: string) => {
      // Get player data first for logging
      const { data: player } = await supabase
        .from('profiles')
        .select('ign')
        .eq('id', playerId)
        .single();

      // Delete user data from database
      const { data, error } = await supabase.rpc('delete_user_completely', {
        user_id_to_delete: playerId
      });

      if (error) throw error;
      if (data === false) throw new Error('Failed to delete user data');

      // Delete auth user via admin API
      const { error: authError } = await supabase.auth.admin.deleteUser(playerId);
      if (authError) {
        console.error('Failed to delete auth user:', authError);
        // Continue anyway since profile data is deleted
      }

      // Log the activity
      if (player) {
        await logPlayerDelete(playerId, player.ign);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-players'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: "Success",
        description: "Player deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting player:', error);
      toast({
        title: "Error",
        description: "Failed to delete player",
        variant: "destructive",
      });
    },
  });
};
