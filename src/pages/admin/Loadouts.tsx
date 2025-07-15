
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Edit, 
  Trash2, 
  Target,
  Filter,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Loadout {
  id: string;
  player_id: string;
  weapon_name: string;
  weapon_type: string;
  mode: string;
  image_url?: string;
  image_name?: string;
  view_count: number;
  is_featured: boolean;
  created_at: string;
  profiles: {
    username: string;
    ign: string;
  };
}

export const AdminLoadouts: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [modeFilter, setModeFilter] = useState('all');
  const [editingLoadout, setEditingLoadout] = useState<Loadout | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch all loadouts with player info
  const { data: loadouts = [], isLoading } = useQuery({
    queryKey: ['admin-loadouts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weapon_layouts')
        .select(`
          *,
          profiles (
            username,
            ign
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching loadouts:', error);
        throw error;
      }
      return data as Loadout[];
    },
  });

  // Update loadout mutation
  const updateLoadoutMutation = useMutation({
    mutationFn: async ({ loadoutId, updates }: { loadoutId: string; updates: Partial<Loadout> }) => {
      const { error } = await supabase
        .from('weapon_layouts')
        .update(updates)
        .eq('id', loadoutId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-loadouts'] });
      toast({
        title: "Loadout Updated",
        description: "Loadout has been updated successfully.",
      });
      setIsDialogOpen(false);
      setEditingLoadout(null);
    },
    onError: (error) => {
      console.error('Error updating loadout:', error);
      toast({
        title: "Error",
        description: "Failed to update loadout.",
        variant: "destructive",
      });
    }
  });

  // Delete loadout mutation
  const deleteLoadoutMutation = useMutation({
    mutationFn: async (loadoutId: string) => {
      const { error } = await supabase
        .from('weapon_layouts')
        .delete()
        .eq('id', loadoutId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-loadouts'] });
      toast({
        title: "Loadout Deleted",
        description: "Loadout has been removed successfully.",
      });
    },
    onError: (error) => {
      console.error('Error deleting loadout:', error);
      toast({
        title: "Error",
        description: "Failed to delete loadout.",
        variant: "destructive",
      });
    }
  });

  const getModeColor = (mode: string) => {
    return mode === 'BR' 
      ? 'bg-green-500/20 text-green-400 border-green-500/50' 
      : 'bg-purple-500/20 text-purple-400 border-purple-500/50';
  };

  const filteredLoadouts = loadouts.filter(loadout => {
    const matchesSearch = loadout.profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loadout.profiles?.ign?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loadout.weapon_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = modeFilter === 'all' || loadout.mode === modeFilter;
    
    return matchesSearch && matchesMode;
  });

  const handleEdit = (loadout: Loadout) => {
    setEditingLoadout(loadout);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!editingLoadout) return;

    updateLoadoutMutation.mutate({
      loadoutId: editingLoadout.id,
      updates: {
        weapon_name: editingLoadout.weapon_name,
        weapon_type: editingLoadout.weapon_type,
        mode: editingLoadout.mode,
        is_featured: editingLoadout.is_featured
      }
    });
  };

  const handleDelete = (loadoutId: string) => {
    if (confirm('Are you sure you want to delete this loadout?')) {
      deleteLoadoutMutation.mutate(loadoutId);
    }
  };

  const toggleFeatured = (loadout: Loadout) => {
    updateLoadoutMutation.mutate({
      loadoutId: loadout.id,
      updates: { is_featured: !loadout.is_featured }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading loadouts...</div>
        </div>
      </div>
    );
  }

  const brLoadouts = loadouts.filter(l => l.mode === 'BR').length;
  const mpLoadouts = loadouts.filter(l => l.mode === 'MP').length;
  const featuredLoadouts = loadouts.filter(l => l.is_featured).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-orbitron mb-2">Loadouts Management</h1>
          <p className="text-muted-foreground font-rajdhani">Manage all player loadout configurations</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1 font-orbitron">{loadouts.length}</div>
            <div className="text-sm text-muted-foreground font-rajdhani">Total Loadouts</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1 font-orbitron">{brLoadouts}</div>
            <div className="text-sm text-muted-foreground font-rajdhani">BR Loadouts</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1 font-orbitron">{mpLoadouts}</div>
            <div className="text-sm text-muted-foreground font-rajdhani">MP Loadouts</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1 font-orbitron">{featuredLoadouts}</div>
            <div className="text-sm text-muted-foreground font-rajdhani">Featured</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by player or weapon name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 font-rajdhani"
              />
            </div>
            
            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger className="w-40 bg-background/50 border-border/50">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="BR">Battle Royale</SelectItem>
                <SelectItem value="MP">Multiplayer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loadouts Table */}
      <Card className="bg-card/50 border-border/30">
        <CardHeader>
          <CardTitle className="text-foreground font-orbitron flex items-center">
            <Target className="w-5 h-5 mr-2 text-primary" />
            Player Loadouts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/30">
                <TableHead className="text-muted-foreground font-rajdhani">Player</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Weapon</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Type</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Mode</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Views</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Featured</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoadouts.map(loadout => (
                <TableRow key={loadout.id} className="border-border/30 hover:bg-muted/20">
                  <TableCell>
                    <div className="font-medium text-foreground font-rajdhani">
                      {loadout.profiles?.username || 'Unknown'}
                    </div>
                    <div className="text-sm text-muted-foreground font-rajdhani">
                      {loadout.profiles?.ign || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {loadout.image_url && (
                        <img 
                          src={loadout.image_url} 
                          alt={loadout.weapon_name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div className="font-medium text-foreground font-rajdhani">
                        {loadout.weapon_name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-foreground font-rajdhani">{loadout.weapon_type}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getModeColor(loadout.mode)}>
                      {loadout.mode}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-foreground font-rajdhani">{loadout.view_count}</div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={loadout.is_featured ? "default" : "outline"}
                      onClick={() => toggleFeatured(loadout)}
                      disabled={updateLoadoutMutation.isPending}
                      className="font-rajdhani"
                    >
                      {loadout.is_featured ? 'Featured' : 'Feature'}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {loadout.image_url && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(loadout.image_url, '_blank')}
                          className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEdit(loadout)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDelete(loadout.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        disabled={deleteLoadoutMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredLoadouts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No loadouts found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border/50 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-orbitron">Edit Loadout</DialogTitle>
          </DialogHeader>
          
          {editingLoadout && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weapon_name" className="font-rajdhani">Weapon Name</Label>
                  <Input
                    id="weapon_name"
                    value={editingLoadout.weapon_name}
                    onChange={(e) => setEditingLoadout(prev => prev ? { ...prev, weapon_name: e.target.value } : null)}
                    className="bg-background/50 border-border/50 font-rajdhani"
                  />
                </div>
                <div>
                  <Label htmlFor="weapon_type" className="font-rajdhani">Weapon Type</Label>
                  <Input
                    id="weapon_type"
                    value={editingLoadout.weapon_type}
                    onChange={(e) => setEditingLoadout(prev => prev ? { ...prev, weapon_type: e.target.value } : null)}
                    className="bg-background/50 border-border/50 font-rajdhani"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="mode" className="font-rajdhani">Game Mode</Label>
                <Select 
                  value={editingLoadout.mode} 
                  onValueChange={(value) => setEditingLoadout(prev => prev ? { ...prev, mode: value } : null)}
                >
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MP">Multiplayer</SelectItem>
                    <SelectItem value="BR">Battle Royale</SelectItem>
                  </SelectContent>
                </Select>
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
                  onClick={handleSave}
                  disabled={updateLoadoutMutation.isPending}
                  className="bg-primary hover:bg-primary/90 font-rajdhani"
                >
                  {updateLoadoutMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
