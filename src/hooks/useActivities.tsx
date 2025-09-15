import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useActivities = () => {
  return useQuery({
    queryKey: ['unread-activities-count'],
    queryFn: async () => {
      // Get activities from the last 24 hours
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
      
      const { data, error } = await supabase
        .from('activities')
        .select('id')
        .gte('created_at', twentyFourHoursAgo.toISOString());

      if (error) throw error;
      return data?.length || 0;
    },
  });
};