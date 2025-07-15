
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePlayerLoadouts = () => {
  return useQuery({
    queryKey: ['player-loadouts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weapon_layouts')
        .select(`
          *,
          profiles (
            username,
            ign
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useDeleteLoadout = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (loadoutId: string) => {
      const { error } = await supabase
        .from('weapon_layouts')
        .delete()
        .eq('id', loadoutId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-loadouts'] });
      toast({
        title: "Success",
        description: "Loadout deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting loadout:', error);
      toast({
        title: "Error",
        description: "Failed to delete loadout",
        variant: "destructive",
      });
    },
  });
};
