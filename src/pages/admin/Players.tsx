
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  Filter,
  Crown,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Player {
  id: string;
  username: string;
  ign: string;
  role: string;
  grade: string;
  tier: string;
  kills: number;
  attendance: number;
  device: string;
  date_joined: string;
  avatar_url?: string;
  tiktok_handle?: string;
  preferred_mode?: string;
}

export const AdminPlayers: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch all players
  const { data: players = [], isLoading } = useQuery({
    queryKey: ['admin-players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching players:', error);
        throw error;
      }
      return data as Player[];
    },
  });

  // Update player mutation
  const updatePlayerMutation = useMutation({
    mutationFn: async ({ playerId, updates }: { playerId: string; updates: Partial<Player> }) => {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', playerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-players'] });
      toast({
        title: "Player Updated",
        description: "Player information has been updated successfully.",
      });
      setIsDialogOpen(false);
      setEditingPlayer(null);
    },
    onError: (error) => {
      console.error('Error updating player:', error);
      toast({
        title: "Error",
        description: "Failed to update player information.",
        variant: "destructive",
      });
    }
  });

  // Delete player mutation
  const deletePlayerMutation = useMutation({
    mutationFn: async (playerId: string) => {
      const { error } = await supabase.auth.admin.deleteUser(playerId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-players'] });
      toast({
        title: "Player Removed",
        description: "Player has been removed from the system.",
      });
    },
    onError: (error) => {
      console.error('Error deleting player:', error);
      toast({
        title: "Error",
        description: "Failed to remove player. Please try again.",
        variant: "destructive",
      });
    }
  });

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

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.ign.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'all' || player.grade === gradeFilter;
    const matchesRole = roleFilter === 'all' || player.role === roleFilter;
    
    return matchesSearch && matchesGrade && matchesRole;
  });

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setIsDialogOpen(true);
  };

  const handleSavePlayer = () => {
    if (!editingPlayer) return;

    updatePlayerMutation.mutate({
      playerId: editingPlayer.id,
      updates: {
        username: editingPlayer.username,
        ign: editingPlayer.ign,
        role: editingPlayer.role,
        grade: editingPlayer.grade,
        tier: editingPlayer.tier,
        device: editingPlayer.device,
        preferred_mode: editingPlayer.preferred_mode,
        tiktok_handle: editingPlayer.tiktok_handle
      }
    });
  };

  const handlePromoteUser = (playerId: string, currentRole: string) => {
    const newRole = currentRole === 'player' ? 'admin' : 'player';
    updatePlayerMutation.mutate({
      playerId,
      updates: { role: newRole }
    });
  };

  const handleDeleteUser = (playerId: string) => {
    if (confirm('Are you sure you want to delete this player? This action cannot be undone.')) {
      deletePlayerMutation.mutate(playerId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading players...</div>
        </div>
      </div>
    );
  }

  const activePlayers = players.filter(p => p.role === 'player').length;
  const admins = players.filter(p => p.role === 'admin').length;
  const sGradePlayers = players.filter(p => p.grade === 'S').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-orbitron mb-2">Player Management</h1>
          <p className="text-gray-400">Manage clan members and their permissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{players.length}</div>
            <div className="text-sm text-gray-400">Total Users</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{activePlayers}</div>
            <div className="text-sm text-gray-400">Players</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{admins}</div>
            <div className="text-sm text-gray-400">Admins</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">{sGradePlayers}</div>
            <div className="text-sm text-gray-400">S-Grade</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by username or IGN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 text-foreground"
              />
            </div>
            
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-40 bg-background/50 border-border/50">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="S">S Grade</SelectItem>
                <SelectItem value="A">A Grade</SelectItem>
                <SelectItem value="B">B Grade</SelectItem>
                <SelectItem value="C">C Grade</SelectItem>
                <SelectItem value="D">D Grade</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40 bg-background/50 border-border/50">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="player">Players</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Players Table */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white font-orbitron">Player Roster</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-gray-300">Player</TableHead>
                <TableHead className="text-gray-300">Role</TableHead>
                <TableHead className="text-gray-300">Grade</TableHead>
                <TableHead className="text-gray-300">Tier</TableHead>
                <TableHead className="text-gray-300">Kills</TableHead>
                <TableHead className="text-gray-300">Attendance</TableHead>
                <TableHead className="text-gray-300">Joined</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.map(player => (
                <TableRow key={player.id} className="border-white/10 hover:bg-white/5">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={player.avatar_url || "/placeholder.svg"}
                        alt={player.username}
                        className="w-8 h-8 rounded-full border border-primary/30"
                      />
                      <div>
                        <div className="text-white font-medium">{player.username}</div>
                        <div className="text-gray-400 text-sm">{player.ign}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {player.role === 'admin' ? (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          <Crown className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-white/30 text-gray-300">
                          Player
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getGradeColor(player.grade || 'D')}>
                      {player.grade || 'D'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{player.tier || 'Rookie'}</TableCell>
                  <TableCell className="text-white font-mono">{(player.kills || 0).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-white mr-2">{player.attendance || 0}%</span>
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${Math.min(player.attendance || 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(player.date_joined).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEditPlayer(player)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handlePromoteUser(player.id, player.role)}
                        className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                        disabled={updatePlayerMutation.isPending}
                      >
                        <Shield className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDeleteUser(player.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        disabled={deletePlayerMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Player Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border/50 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-orbitron">Edit Player</DialogTitle>
          </DialogHeader>
          
          {editingPlayer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username" className="font-rajdhani">Username</Label>
                  <Input
                    id="username"
                    value={editingPlayer.username}
                    onChange={(e) => setEditingPlayer(prev => prev ? { ...prev, username: e.target.value } : null)}
                    className="bg-background/50 border-border/50 font-rajdhani"
                  />
                </div>
                <div>
                  <Label htmlFor="ign" className="font-rajdhani">IGN</Label>
                  <Input
                    id="ign"
                    value={editingPlayer.ign}
                    onChange={(e) => setEditingPlayer(prev => prev ? { ...prev, ign: e.target.value } : null)}
                    className="bg-background/50 border-border/50 font-rajdhani"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role" className="font-rajdhani">Role</Label>
                  <Select 
                    value={editingPlayer.role} 
                    onValueChange={(value) => setEditingPlayer(prev => prev ? { ...prev, role: value } : null)}
                  >
                    <SelectTrigger className="bg-background/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="player">Player</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="grade" className="font-rajdhani">Grade</Label>
                  <Select 
                    value={editingPlayer.grade || 'D'} 
                    onValueChange={(value) => setEditingPlayer(prev => prev ? { ...prev, grade: value } : null)}
                  >
                    <SelectTrigger className="bg-background/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S">S - Elite</SelectItem>
                      <SelectItem value="A">A - Veteran</SelectItem>
                      <SelectItem value="B">B - Soldier</SelectItem>
                      <SelectItem value="C">C - Recruit</SelectItem>
                      <SelectItem value="D">D - Trainee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="font-rajdhani"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePlayer}
                  disabled={updatePlayerMutation.isPending}
                  className="bg-primary hover:bg-primary/90 font-rajdhani"
                >
                  {updatePlayerMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
