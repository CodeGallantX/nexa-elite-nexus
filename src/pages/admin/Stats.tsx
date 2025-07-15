
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  TrendingUp, 
  Target, 
  Calendar,
  BarChart3,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PlayerStats {
  id: string;
  username: string;
  ign: string;
  kills: number;
  attendance: number;
  grade: string;
}

export const AdminStats: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [statsForm, setStatsForm] = useState({
    kills: '',
    attendance: '',
    grade: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all players with stats
  const { data: players = [], isLoading: playersLoading } = useQuery({
    queryKey: ['admin-players-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, ign, kills, attendance, grade')
        .eq('role', 'player')
        .order('kills', { ascending: false });

      if (error) {
        console.error('Error fetching players:', error);
        throw error;
      }
      return data as PlayerStats[];
    },
  });

  // Update player stats mutation
  const updateStatsMutation = useMutation({
    mutationFn: async ({ playerId, updates }: { playerId: string; updates: Partial<PlayerStats> }) => {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', playerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-players-stats'] });
      toast({
        title: "Stats Updated",
        description: "Player statistics have been updated successfully.",
      });
      setSelectedPlayerId('');
      setStatsForm({ kills: '', attendance: '', grade: '' });
    },
    onError: (error) => {
      console.error('Error updating stats:', error);
      toast({
        title: "Error",
        description: "Failed to update player statistics.",
        variant: "destructive",
      });
    }
  });

  const selectedPlayer = players.find(p => p.id === selectedPlayerId);
  const filteredPlayers = players.filter(player =>
    player.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.ign.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlayerSelect = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      setSelectedPlayerId(playerId);
      setStatsForm({
        kills: player.kills?.toString() || '0',
        attendance: player.attendance?.toString() || '0',
        grade: player.grade || 'D'
      });
    }
  };

  const handleStatsUpdate = () => {
    if (!selectedPlayerId) return;

    updateStatsMutation.mutate({
      playerId: selectedPlayerId,
      updates: {
        kills: parseInt(statsForm.kills) || 0,
        attendance: parseFloat(statsForm.attendance) || 0,
        grade: statsForm.grade as string
      }
    });
  };

  const getGradeColor = (grade: string) => {
    const colors = {
      'S': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      'A': 'bg-green-500/20 text-green-400 border-green-500/50',
      'B': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      'C': 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      'D': 'bg-red-500/20 text-red-400 border-red-500/50'
    };
    return colors[grade as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  };

  const totalKills = players.reduce((sum, player) => sum + (player.kills || 0), 0);
  const averageAttendance = players.length > 0 ? 
    Math.round(players.reduce((sum, player) => sum + (player.attendance || 0), 0) / players.length) : 0;

  if (playersLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading statistics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white font-orbitron mb-2">Statistics Management</h1>
        <p className="text-gray-400">Update player kill counts, attendance, and performance grades</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{totalKills.toLocaleString()}</div>
            <div className="text-sm text-gray-400 flex items-center justify-center">
              <Target className="w-4 h-4 mr-1" />
              Total Kills
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{averageAttendance}%</div>
            <div className="text-sm text-gray-400 flex items-center justify-center">
              <Calendar className="w-4 h-4 mr-1" />
              Avg Attendance
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {players.filter(p => p.grade === 'S').length}
            </div>
            <div className="text-sm text-gray-400">S-Grade Players</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{players.length}</div>
            <div className="text-sm text-gray-400 flex items-center justify-center">
              <Users className="w-4 h-4 mr-1" />
              Active Players
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Player Selection */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white font-orbitron flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary" />
              Select Player
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 text-foreground"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {filteredPlayers.map(player => (
              <div
                key={player.id}
                onClick={() => handlePlayerSelect(player.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedPlayerId === player.id
                    ? 'bg-primary/20 border border-primary/30'
                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">{player.username}</div>
                    <div className="text-gray-400 text-sm">{player.ign}</div>
                  </div>
                  <div className="text-right">
                    <Badge className={getGradeColor(player.grade || 'D')}>
                      {player.grade || 'D'}
                    </Badge>
                    <div className="text-xs text-gray-400 mt-1">
                      {(player.kills || 0).toLocaleString()} kills
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stats Input Form */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white font-orbitron flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-primary" />
              Update Statistics
            </CardTitle>
            {selectedPlayer && (
              <p className="text-gray-400">
                Editing stats for <span className="text-primary font-medium">{selectedPlayer.username}</span>
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedPlayer ? (
              <>
                <div>
                  <Label className="text-gray-300">Total Kills</Label>
                  <Input
                    type="number"
                    value={statsForm.kills}
                    onChange={(e) => setStatsForm(prev => ({ ...prev, kills: e.target.value }))}
                    className="bg-background/50 border-border/50 text-foreground font-mono"
                    placeholder="0"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Current: {(selectedPlayer.kills || 0).toLocaleString()}
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Attendance (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={statsForm.attendance}
                    onChange={(e) => setStatsForm(prev => ({ ...prev, attendance: e.target.value }))}
                    className="bg-background/50 border-border/50 text-foreground"
                    placeholder="0"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Current: {selectedPlayer.attendance || 0}%
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Performance Grade</Label>
                  <Select 
                    value={statsForm.grade} 
                    onValueChange={(value) => setStatsForm(prev => ({ ...prev, grade: value }))}
                  >
                    <SelectTrigger className="bg-background/50 border-border/50">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S">S - Elite</SelectItem>
                      <SelectItem value="A">A - Veteran</SelectItem>
                      <SelectItem value="B">B - Soldier</SelectItem>
                      <SelectItem value="C">C - Recruit</SelectItem>
                      <SelectItem value="D">D - Trainee</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-xs text-gray-400 mt-1">
                    Current: <Badge className={getGradeColor(selectedPlayer.grade || 'D')}>
                      {selectedPlayer.grade || 'D'}
                    </Badge>
                  </div>
                </div>

                <Button 
                  onClick={handleStatsUpdate}
                  disabled={updateStatsMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-rajdhani"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {updateStatsMutation.isPending ? 'Updating...' : 'Update Statistics'}
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Select a player to update their statistics</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
