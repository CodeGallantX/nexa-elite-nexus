import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*');

      if (error) throw error;
      return data || [];
    },
  });
};
