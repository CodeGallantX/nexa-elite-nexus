
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Search, 
  AlertTriangle,
  ArrowLeft,
  Save
} from 'lucide-react';

interface Player {
  id: string;
  username: string;
  ign: string;
  role: Database['public']['Enums']['user_role'] | 'clan_master';
}

interface EventGroup {
  id: string;
  name: string;
  max_players: number;
  participants: {
    id: string;
    player_id: string;
    role?: string;
    profiles: Player;
  }[];
}

interface Event {
  id: string;
  name: string;
  type: string;
  date: string;
  time: string;
}

export const EventAssignment: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [newGroupName, setNewGroupName] = useState('');

  // Use eventId from URL params, fallback to a default if not provided
  const currentEventId = eventId || 'default-event';

  // Fetch event details
  const { data: event } = useQuery({
    queryKey: ['event', currentEventId],
    queryFn: async () => {
      if (currentEventId === 'default-event') {
        // Return mock data for default route
        return {
          id: 'default-event',
          name: 'General Event Assignment',
          type: 'Scrim',
          date: new Date().toISOString().split('T')[0],
          time: '20:00'
        } as Event;
      }

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', currentEventId)
        .single();

      if (error) {
        console.error('Error fetching event:', error);
        throw error;
      }
      return data as Event;
    },
  });

  // Fetch all users (players, admins, clan_masters)
  const { data: players = [] } = useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, ign, role')
        .in('role', ['player', 'admin', 'moderator', 'clan_master']);

      if (error) {
        console.error('Error fetching players:', error);
        return [];
      }
      return data as Player[];
    },
  });

  // Fetch event groups
  const { data: groups = [] } = useQuery({
    queryKey: ['event-groups', currentEventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_groups')
        .select(`
          *,
          event_participants (
            id,
            player_id,
            role,
            profiles (
              id,
              username,
              ign,
              role
            )
          )
        `)
        .eq('event_id', currentEventId);

      if (error) {
        console.error('Error fetching event groups:', error);
        return [];
      }
      return data.map(group => ({
        ...group,
        participants: group.event_participants || []
      })) as EventGroup[];
    },
  });

  // Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: async (groupName: string) => {
      const { data, error } = await supabase
        .from('event_groups')
        .insert([{
          event_id: currentEventId,
          name: groupName,
          max_players: 4
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-groups'] });
      setNewGroupName('');
      toast({
        title: "Group Created",
        description: "New group has been created successfully.",
      });
    },
    onError: (error) => {
      console.error('Error creating group:', error);
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Add player to group mutation
  const addPlayerMutation = useMutation({
    mutationFn: async ({ groupId, playerId }: { groupId: string; playerId: string }) => {
      const { error } = await supabase
        .from('event_participants')
        .insert([{
          event_id: currentEventId,
          player_id: playerId,
          group_id: groupId
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-groups'] });
      toast({
        title: "Player Added",
        description: "Player has been added to the group.",
      });
    },
    onError: (error) => {
      console.error('Error adding player:', error);
      toast({
        title: "Error",
        description: "Failed to add player. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Remove player from group mutation
  const removePlayerMutation = useMutation({
    mutationFn: async (participantId: string) => {
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('id', participantId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-groups'] });
      toast({
        title: "Player Removed",
        description: "Player has been removed from the group.",
      });
    },
    onError: (error) => {
      console.error('Error removing player:', error);
      toast({
        title: "Error",
        description: "Failed to remove player. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete group mutation
  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      // Check if group has players
      const group = groups.find(g => g.id === groupId);
      if (group && group.participants.length > 0) {
        throw new Error('Cannot delete group with assigned players');
      }

      const { error } = await supabase
        .from('event_groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-groups'] });
      toast({
        title: "Group Deleted",
        description: "Group has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error('Error deleting group:', error);
      toast({
        title: "Error",
        description: error.message === 'Cannot delete group with assigned players' 
          ? "Cannot delete group with assigned players. Remove all players first."
          : "Failed to delete group. Please try again.",
        variant: "destructive",
      });
    }
  });

  const filteredPlayers = players.filter(player =>
    player.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.ign.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const assignedPlayerIds = groups.flatMap(group => 
    group.participants.map(p => p.player_id)
  );

  const availablePlayers = filteredPlayers.filter(player => 
    !assignedPlayerIds.includes(player.id)
  );

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    createGroupMutation.mutate(newGroupName);
  };

  const handleAddPlayerToGroup = (groupId: string, playerId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group && group.participants.length >= group.max_players) {
      toast({
        title: "Group Full",
        description: "This group already has the maximum number of players.",
        variant: "destructive",
      });
      return;
    }
    addPlayerMutation.mutate({ groupId, playerId });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/events')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Event Assignment</h1>
            <p className="text-muted-foreground">
              {event?.name} - {event?.type} ({event?.date})
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Players */}
        <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span>Available Users</span>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="pl-10 bg-background/50"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availablePlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-2 bg-background/20 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-white">Ɲ・乂{player.ign}</div>
                    <div className="text-sm text-muted-foreground">@{player.username}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (selectedPlayers.includes(player.id)) {
                        setSelectedPlayers(prev => prev.filter(id => id !== player.id));
                      } else {
                        setSelectedPlayers(prev => [...prev, player.id]);
                      }
                    }}
                    className={selectedPlayers.includes(player.id) ? 'bg-primary/20' : ''}
                  >
                    {selectedPlayers.includes(player.id) ? 'Selected' : 'Select'}
                  </Button>
                </div>
              ))}
              
              {availablePlayers.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  {searchTerm ? 'No users found' : 'All users are assigned'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Groups */}
        <div className="lg:col-span-2 space-y-4">
          {/* Create New Group */}
          <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Create New Group</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Group name (e.g., Alpha Squad)"
                  className="bg-background/50"
                />
                <Button 
                  onClick={handleCreateGroup}
                  disabled={!newGroupName.trim() || createGroupMutation.isPending}
                >
                  Create Group
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Groups */}
          {groups.map((group) => (
            <Card key={group.id} className="bg-card/50 border-border/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{group.name}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant={group.participants.length >= group.max_players ? "destructive" : "secondary"}>
                      {group.participants.length}/{group.max_players}
                    </Badge>
                    {group.participants.length > group.max_players && (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteGroupMutation.mutate(group.id)}
                      className="text-red-400 hover:text-red-300"
                      disabled={group.participants.length > 0}
                    >
                      Delete
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Current Members */}
                  <div className="space-y-2">
                    {group.participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between p-2 bg-background/20 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-white">
                            Ɲ・乂{participant.profiles.ign}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            @{participant.profiles.username}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removePlayerMutation.mutate(participant.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <UserMinus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Add Users */}
                  {selectedPlayers.length > 0 && group.participants.length < group.max_players && (
                    <Button
                      onClick={() => {
                        selectedPlayers.forEach(playerId => {
                          handleAddPlayerToGroup(group.id, playerId);
                        });
                        setSelectedPlayers([]);
                      }}
                      className="w-full"
                      variant="outline"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Selected Users ({selectedPlayers.length})
                    </Button>
                  )}

                  {group.participants.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground border-2 border-dashed border-border/30 rounded-lg">
                      No users assigned yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {groups.length === 0 && (
            <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
              <CardContent className="text-center py-8">
                <div className="text-muted-foreground">
                  No groups created yet. Create your first group to start assigning users.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
