import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useWeeklyLeaderboard = () => {
  return useQuery({
    queryKey: ['weekly-leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weekly_leaderboard')
        .select('*');

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
