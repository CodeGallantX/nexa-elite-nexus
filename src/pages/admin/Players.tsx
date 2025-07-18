
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAdminPlayers, useUpdatePlayer, useDeletePlayer } from '@/hooks/useAdminPlayers';
import { Search, Edit, Trash2, Eye, UserPlus } from 'lucide-react';

export const AdminPlayers: React.FC = () => {
  const { data: players, isLoading } = useAdminPlayers();
  const updatePlayer = useUpdatePlayer();
  const deletePlayer = useDeletePlayer();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [editingPlayer, setEditingPlayer] = useState<any>(null);

  const filteredPlayers = players?.filter(player => {
    const matchesSearch = player.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.ign?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || player.role === filterRole;
    return matchesSearch && matchesRole;
  }) || [];

  const handleUpdatePlayer = async (updates: any) => {
    if (!editingPlayer) return;
    
    await updatePlayer.mutateAsync({
      id: editingPlayer.id,
      updates
    });
    setEditingPlayer(null);
  };

  const handleDeletePlayer = async (playerId: string) => {
    await deletePlayer.mutateAsync(playerId);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-yellow-100 text-yellow-800';
      case 'player': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'elite': return 'bg-purple-100 text-purple-800';
      case 'veteran': return 'bg-blue-100 text-blue-800';
      case 'rookie': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-white">Loading players...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Players Management</h1>
        <Button className="bg-[#FF1F44] hover:bg-red-600 text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Player
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white"
                placeholder="Search by username or IGN..."
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="player">Player</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Players Table */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Player</TableHead>
                <TableHead className="text-gray-300">Role</TableHead>
                <TableHead className="text-gray-300">Tier</TableHead>
                <TableHead className="text-gray-300">Kills</TableHead>
                <TableHead className="text-gray-300">Attendance</TableHead>
                <TableHead className="text-gray-300">Joined</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.map((player) => (
                <TableRow key={player.id} className="border-gray-700">
                  <TableCell className="text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        {player.avatar_url ? (
                          <img src={player.avatar_url} alt={player.username} className="w-8 h-8 rounded-full" />
                        ) : (
                          <span className="text-sm">{player.username?.[0]?.toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">Ɲ・乂{player.ign}</div>
                        <div className="text-sm text-gray-400">@{player.username}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(player.role)}>
                      {player.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTierColor(player.tier || 'rookie')}>
                      {player.tier || 'Rookie'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white">{player.kills || 0}</TableCell>
                  <TableCell className="text-white">{player.attendance || 0}%</TableCell>
                  <TableCell className="text-white">
                    {player.date_joined ? new Date(player.date_joined).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-gray-400 hover:text-white"
                            onClick={() => setSelectedPlayer(player)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-white">Player Details</DialogTitle>
                          </DialogHeader>
                          {selectedPlayer && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-gray-300 text-sm">Username</label>
                                  <p className="text-white">{selectedPlayer.username}</p>
                                </div>
                                <div>
                                  <label className="text-gray-300 text-sm">IGN</label>
                                  <p className="text-white">Ɲ・乂{selectedPlayer.ign}</p>
                                </div>
                                <div>
                                  <label className="text-gray-300 text-sm">Device</label>
                                  <p className="text-white">{selectedPlayer.device || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="text-gray-300 text-sm">Preferred Mode</label>
                                  <p className="text-white">{selectedPlayer.preferred_mode || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="text-gray-300 text-sm">TikTok Handle</label>
                                  <p className="text-white">{selectedPlayer.tiktok_handle || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="text-gray-300 text-sm">Grade</label>
                                  <p className="text-white">{selectedPlayer.grade || 'N/A'}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-gray-400 hover:text-white"
                        onClick={() => setEditingPlayer(player)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Player</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {player.username}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePlayer(player.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Player Dialog */}
      {editingPlayer && (
        <Dialog open={!!editingPlayer} onOpenChange={() => setEditingPlayer(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-white">Edit Player</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm">Tier</label>
                  <Select 
                    value={editingPlayer.tier} 
                    onValueChange={(value) => setEditingPlayer({...editingPlayer, tier: value})}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rookie">Rookie</SelectItem>
                      <SelectItem value="Veteran">Veteran</SelectItem>
                      <SelectItem value="Elite">Elite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-gray-300 text-sm">Grade</label>
                  <Select 
                    value={editingPlayer.grade} 
                    onValueChange={(value) => setEditingPlayer({...editingPlayer, grade: value})}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="F">F</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingPlayer(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleUpdatePlayer({
                    tier: editingPlayer.tier,
                    grade: editingPlayer.grade
                  })}
                  className="bg-[#FF1F44] hover:bg-red-600"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {filteredPlayers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No players found</p>
        </div>
      )}
    </div>
  );
};
