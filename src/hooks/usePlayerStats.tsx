
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePlayerStats = () => {
  return useQuery({
    queryKey: ['player-stats'],
    queryFn: async () => {
      // Get player stats with kills and participation
      const { data: playerStats, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          ign,
          kills,
          attendance,
          tier,
          grade
        `)
        .eq('role', 'player');

      if (error) throw error;

      // Get event participation data
      const { data: participationData, error: participationError } = await supabase
        .from('event_participants')
        .select(`
          player_id,
          kills,
          events (
            id,
            name,
            type,
            date
          )
        `);

      if (participationError) throw participationError;

      // Calculate aggregated stats
      const aggregatedStats = playerStats?.map(player => {
        const playerParticipation = participationData?.filter(p => p.player_id === player.id) || [];
        const totalEventKills = playerParticipation.reduce((sum, p) => sum + (p.kills || 0), 0);
        const eventsParticipated = playerParticipation.length;
        const avgKillsPerEvent = eventsParticipated > 0 ? totalEventKills / eventsParticipated : 0;

        return {
          ...player,
          totalEventKills,
          eventsParticipated,
          avgKillsPerEvent: Math.round(avgKillsPerEvent * 100) / 100,
          participationData: playerParticipation
        };
      });

      return aggregatedStats || [];
    },
  });
};
