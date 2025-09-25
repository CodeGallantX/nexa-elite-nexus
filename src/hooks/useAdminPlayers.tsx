
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

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;

      // Log the activity
      if (currentPlayer && data[0]) {
        await logPlayerProfileUpdate(id, currentPlayer.ign, currentPlayer, updates);
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

      const { data, error } = await supabase.rpc('delete_user_completely', {
        user_id_to_delete: playerId
      });

      if (error) throw error;
      if (!data) throw new Error('Failed to delete user');

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
