import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Clock, 
  User, 
  Target,
  Search,
  RefreshCw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ActivitySummary } from '@/components/ActivitySummary';
import { useToast } from '@/hooks/use-toast';

interface ActivityRecord {
  id: string;
  action_type: string;
  action_description: string;
  performed_by: string;
  target_user_id: string;
  old_value: any;
  new_value: any;
  created_at: string;
  performer?: {
    username: string;
    ign: string;
  };
  target?: {
    username: string;
    ign: string;
  };
}

export default function Activities() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Fetch activities with simpler query to avoid relation issues
  const { data: activities = [], isLoading, refetch } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      // Fetch performer and target profiles separately if needed
      const activitiesWithProfiles = await Promise.all(
        (data || []).map(async (activity) => {
          const activityWithProfiles = { ...activity } as any;
          
          if (activity.performed_by) {
            const { data: performer } = await supabase
              .from('profiles')
              .select('username, ign')
              .eq('id', activity.performed_by)
              .single();
            activityWithProfiles.performer = performer;
          }
          
          if (activity.target_user_id) {
            const { data: target } = await supabase
              .from('profiles')
              .select('username, ign')
              .eq('id', activity.target_user_id)
              .single();
            activityWithProfiles.target = target;
          }
          
          return activityWithProfiles;
        })
      );
      
      return activitiesWithProfiles as ActivityRecord[];
    },
  });

  // Real-time subscription
  React.useEffect(() => {
    const channel = supabase
      .channel('activities-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'activities' },
        (payload) => {
          console.log('Change received!', payload);
          queryClient.invalidateQueries({ queryKey: ['activities'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Clear activities mutation (optional - for cleanup)
  const clearActivitiesMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('activities')
        .delete()
        .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Older than 30 days

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: "Success",
        description: "Old activities cleared successfully",
      });
    },
    onError: (error) => {
      console.error('Error clearing activities:', error);
      toast({
        title: "Error",
        description: "Failed to clear activities",
        variant: "destructive",
      });
    }
  });

  // Only allow clan masters to access this page
  if (profile?.role !== 'clan_master') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Access Denied</p>
          <p className="text-sm text-gray-500">Only clan masters can view activities</p>
        </div>
      </div>
    );
  }

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.action_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.performer?.ign?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.target?.ign?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || activity.action_type === filterType;
    
    return matchesSearch && matchesType;
  });

  const getActionTypeColor = (type: string) => {
    switch (type) {
      case 'update_kills': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'create_event': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'update_event': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
      case 'delete_event': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'update_event_status': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'update_player': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'delete_player': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'update_kills': return Target;
      case 'create_event': 
      case 'update_event':
      case 'delete_event':
      case 'update_event_status': return Clock;
      case 'update_player': 
      case 'delete_player': return User;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-orbitron">Activities</h1>
          <p className="text-gray-400">Track moderator and admin actions</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="border-border text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={() => clearActivitiesMutation.mutate()}
            disabled={clearActivitiesMutation.isPending}
            variant="outline"
            className="border-border text-white"
          >
            Clear Old
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-blue-400" />
              Total Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activities.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-400" />
              Event Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {activities.filter(a => a.action_type.includes('event')).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <User className="w-4 h-4 mr-2 text-green-400" />
              Player Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {activities.filter(a => a.action_type.includes('player')).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-yellow-400" />
              Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {activities.filter(a => 
                new Date(a.created_at).toDateString() === new Date().toDateString()
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search activities, users..."
                  className="pl-10 bg-background/50"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48 bg-background/50">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="update_kills">Kill Updates</SelectItem>
                <SelectItem value="create_event">Event Creation</SelectItem>
                <SelectItem value="update_event">Event Updates</SelectItem>
                <SelectItem value="delete_event">Event Deletion</SelectItem>
                <SelectItem value="update_event_status">Event Status</SelectItem>
                <SelectItem value="update_player">Player Updates</SelectItem>
                <SelectItem value="delete_player">Player Deletion</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activities List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-white">Loading activities...</div>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No activities found</p>
            <p className="text-sm text-gray-500">Activity tracking will appear here as moderators take actions</p>
          </div>
        ) : (
          filteredActivities.map((activity) => {
            const ActionIcon = getActionIcon(activity.action_type);
            return (
              <Card key={activity.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      <ActionIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <ActivitySummary activity={activity} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}