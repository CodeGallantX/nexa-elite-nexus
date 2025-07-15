
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Edit, 
  Save, 
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface EventParticipation {
  id: string;
  kills: number;
  verified: boolean;
  events: {
    id: string;
    name: string;
    date: string;
    type: string;
  };
}

export const KillPerformanceTracker: React.FC = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [newKillCount, setNewKillCount] = useState<number>(0);

  // Fetch user's event participations
  const { data: participations = [] } = useQuery({
    queryKey: ['user-participations', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('event_participants')
        .select(`
          id,
          kills,
          verified,
          events (
            id,
            name,
            date,
            type
          )
        `)
        .eq('player_id', profile.id)
        .order('events(date)', { ascending: false });

      if (error) throw error;
      return data as EventParticipation[];
    },
    enabled: !!profile?.id,
  });

  // Update kills mutation
  const updateKillsMutation = useMutation({
    mutationFn: async ({ participationId, kills }: { participationId: string; kills: number }) => {
      const { error } = await supabase
        .from('event_participants')
        .update({ 
          kills,
          verified: false // Reset verification when kills are updated
        })
        .eq('id', participationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-participations'] });
      setEditingEvent(null);
      toast({
        title: "Kills Updated",
        description: "Your kill count has been updated and is pending admin verification.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEditKills = (participation: EventParticipation) => {
    setEditingEvent(participation.id);
    setNewKillCount(participation.kills);
  };

  const handleSaveKills = (participationId: string) => {
    updateKillsMutation.mutate({ participationId, kills: newKillCount });
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setNewKillCount(0);
  };

  // Calculate statistics
  const totalKills = participations.reduce((sum, p) => sum + p.kills, 0);
  const averageKills = participations.length > 0 ? totalKills / participations.length : 0;
  const recentEvents = participations.slice(0, 3);
  
  // Calculate performance trend
  const getPerformanceTrend = (currentKills: number) => {
    if (averageKills === 0) return { percentage: 0, isImprovement: true };
    
    const percentage = ((currentKills - averageKills) / averageKills) * 100;
    return {
      percentage: Math.abs(percentage),
      isImprovement: percentage >= 0
    };
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Kills</p>
                <p className="text-2xl font-bold text-white">{totalKills}</p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Kills</p>
                <p className="text-2xl font-bold text-white">{averageKills.toFixed(1)}</p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Events Played</p>
                <p className="text-2xl font-bold text-white">{participations.length}</p>
              </div>
              <Target className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events Summary */}
      <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Recent Events Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No events participated yet. Join events to track your performance!
            </div>
          ) : (
            <div className="space-y-4">
              {recentEvents.map((participation) => {
                const trend = getPerformanceTrend(participation.kills);
                
                return (
                  <div key={participation.id} className="flex items-center justify-between p-4 bg-background/20 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="font-medium text-white">{participation.events.name}</h4>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{new Date(participation.events.date).toLocaleDateString()}</span>
                            <Badge variant="outline" className="text-xs">
                              {participation.events.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Performance indicator */}
                      <div className="flex items-center space-x-2">
                        {trend.isImprovement ? (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`text-sm font-medium ${
                          trend.isImprovement ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {trend.isImprovement ? '+' : '-'}{trend.percentage.toFixed(1)}%
                        </span>
                      </div>

                      {/* Kills display/edit */}
                      <div className="flex items-center space-x-2">
                        {editingEvent === participation.id ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              value={newKillCount}
                              onChange={(e) => setNewKillCount(parseInt(e.target.value) || 0)}
                              className="w-20 h-8"
                              min="0"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleSaveKills(participation.id)}
                              disabled={updateKillsMutation.isPending}
                            >
                              <Save className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <div className="text-right">
                              <div className="text-lg font-bold text-white">
                                {participation.kills}
                              </div>
                              <div className="text-xs text-muted-foreground">kills</div>
                            </div>
                            <div className="flex flex-col items-center space-y-1">
                              {participation.verified ? (
                                <div title="Verified by admin">
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                </div>
                              ) : (
                                <div title="Pending verification">
                                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                                </div>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditKills(participation)}
                                className="p-1 h-6"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Tips */}
      <Card className="bg-gradient-to-r from-primary/10 to-red-600/5 border-primary/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-primary">Performance Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Only current or most recent event kills can be edited</p>
            <p>• Kill counts require admin verification before updating global stats</p>
            <p>• Performance percentage compares your kills to your personal average</p>
            <p>• Green indicators show improvement, red shows decline from average</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
