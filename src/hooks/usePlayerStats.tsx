
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
          br_kills,
          mp_kills,
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
          br_kills,
          mp_kills,
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
        const totalBRKills = playerParticipation.reduce((sum, p) => sum + (p.br_kills || 0), 0);
        const totalMPKills = playerParticipation.reduce((sum, p) => sum + (p.mp_kills || 0), 0);
        const eventsParticipated = playerParticipation.length;
        const avgKillsPerEvent = eventsParticipated > 0 ? totalEventKills / eventsParticipated : 0;
        const avgBRKillsPerEvent = eventsParticipated > 0 ? totalBRKills / eventsParticipated : 0;
        const avgMPKillsPerEvent = eventsParticipated > 0 ? totalMPKills / eventsParticipated : 0;

        return {
          ...player,
          totalEventKills,
          totalBRKills,
          totalMPKills,
          eventsParticipated,
          avgKillsPerEvent: Math.round(avgKillsPerEvent * 100) / 100,
          avgBRKillsPerEvent: Math.round(avgBRKillsPerEvent * 100) / 100,
          avgMPKillsPerEvent: Math.round(avgMPKillsPerEvent * 100) / 100,
          participationData: playerParticipation
        };
      });

      return aggregatedStats || [];
    },
  });
};
