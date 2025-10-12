import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export const useActivities = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('activities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activities',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['unread-activities-count'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

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

      if (error) {
        console.error('Error fetching activities:', error);
        return 0;
      }
      return data?.length || 0;
    },
  });
};