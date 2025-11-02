import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useWeeklyLeaderboard = () => {
  return useQuery({
    queryKey: ['weekly-leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('total_kills', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
  });
};
