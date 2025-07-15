
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Star,
  Eye
} from 'lucide-react';

interface Loadout {
  id: string;
  player_id: string;
  weapon_name: string;
  weapon_type: string;
  mode: string;
  image_url?: string;
  image_name?: string;
  is_featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export const Loadouts: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLoadout, setEditingLoadout] = useState<Loadout | null>(null);
  const [formData, setFormData] = useState({
    weapon_name: '',
    weapon_type: '',
    mode: '',
    image_file: null as File | null
  });

  // Fetch user's loadouts
  const { data: loadouts = [], isLoading } = useQuery({
    queryKey: ['user-loadouts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('weapon_layouts')
        .select('*')
        .eq('player_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching loadouts:', error);
        return [];
      }
      return data as Loadout[];
    },
    enabled: !!user?.id,
  });

  // Create/Update loadout mutation
  const saveLoadoutMutation = useMutation({
    mutationFn: async (loadoutData: any) => {
      let imageUrl = null;
      
      // Upload image if provided
      if (formData.image_file) {
        const fileExt = formData.image_file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('weapon-layouts')
          .upload(fileName, formData.image_file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('weapon-layouts')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const payload = {
        weapon_name: formData.weapon_name,
        weapon_type: formData.weapon_type,
        mode: formData.mode,
        player_id: user?.id,
        ...(imageUrl && { 
          image_url: imageUrl, 
          image_name: formData.image_file?.name 
        })
      };

      if (editingLoadout) {
        // Update existing
        const { error } = await supabase
          .from('weapon_layouts')
          .update(payload)
          .eq('id', editingLoadout.id);
        
        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('weapon_layouts')
          .insert([payload]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-loadouts'] });
      setIsDialogOpen(false);
      setEditingLoadout(null);
      setFormData({
        weapon_name: '',
        weapon_type: '',
        mode: '',
        image_file: null
      });
      toast({
        title: editingLoadout ? "Loadout Updated" : "Loadout Created",
        description: `Your loadout has been ${editingLoadout ? 'updated' : 'created'} successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save loadout.",
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
      queryClient.invalidateQueries({ queryKey: ['user-loadouts'] });
      toast({
        title: "Loadout Deleted",
        description: "Your loadout has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete loadout.",
        variant: "destructive",
      });
    }
  });

  const filteredLoadouts = loadouts.filter(loadout => {
    const matchesSearch = loadout.weapon_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = filterMode === 'all' || loadout.mode === filterMode;
    return matchesSearch && matchesMode;
  });

  const handleEdit = (loadout: Loadout) => {
    setEditingLoadout(loadout);
    setFormData({
      weapon_name: loadout.weapon_name,
      weapon_type: loadout.weapon_type,
      mode: loadout.mode,
      image_file: null
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.weapon_name || !formData.weapon_type || !formData.mode) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    saveLoadoutMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Loadouts</h1>
          <p className="text-gray-400">Manage your weapon configurations</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingLoadout(null);
                setFormData({
                  weapon_name: '',
                  weapon_type: '',
                  mode: '',
                  image_file: null
                });
              }}
              className="bg-[#FF1F44] hover:bg-red-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Loadout
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingLoadout ? 'Edit Loadout' : 'Create New Loadout'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="weapon_name" className="text-white">Weapon Name</Label>
                <Input
                  id="weapon_name"
                  value={formData.weapon_name}
                  onChange={(e) => setFormData({...formData, weapon_name: e.target.value})}
                  placeholder="e.g., AK-47"
                  className="bg-background/50 border-border text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="weapon_type" className="text-white">Weapon Type</Label>
                <Select 
                  value={formData.weapon_type} 
                  onValueChange={(value) => setFormData({...formData, weapon_type: value})}
                >
                  <SelectTrigger className="bg-background/50 border-border text-white">
                    <SelectValue placeholder="Select weapon type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assault Rifle">Assault Rifle</SelectItem>
                    <SelectItem value="SMG">SMG</SelectItem>
                    <SelectItem value="Sniper">Sniper</SelectItem>
                    <SelectItem value="LMG">LMG</SelectItem>
                    <SelectItem value="Shotgun">Shotgun</SelectItem>
                    <SelectItem value="Pistol">Pistol</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="mode" className="text-white">Game Mode</Label>
                <Select 
                  value={formData.mode} 
                  onValueChange={(value) => setFormData({...formData, mode: value})}
                >
                  <SelectTrigger className="bg-background/50 border-border text-white">
                    <SelectValue placeholder="Select game mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MP">Multiplayer</SelectItem>
                    <SelectItem value="BR">Battle Royale</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="image" className="text-white">Loadout Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({...formData, image_file: e.target.files?.[0] || null})}
                  className="bg-background/50 border-border text-white"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="border-border text-white"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={saveLoadoutMutation.isPending}
                  className="bg-[#FF1F44] hover:bg-red-600 text-white"
                >
                  {saveLoadoutMutation.isPending ? 'Saving...' : (editingLoadout ? 'Update' : 'Create')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search loadouts..."
            className="pl-10 bg-background/50 border-border text-white"
          />
        </div>
        
        <Select value={filterMode} onValueChange={setFilterMode}>
          <SelectTrigger className="w-48 bg-background/50 border-border text-white">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="MP">Multiplayer</SelectItem>
            <SelectItem value="BR">Battle Royale</SelectItem>
            <SelectItem value="Mixed">Mixed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[#FF1F44] mb-1">{loadouts.length}</div>
            <div className="text-sm text-gray-400">Total Loadouts</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {loadouts.filter(l => l.is_featured).length}
            </div>
            <div className="text-sm text-gray-400">Featured</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {loadouts.reduce((acc, l) => acc + l.view_count, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Views</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {Array.from(new Set(loadouts.map(l => l.weapon_type))).length}
            </div>
            <div className="text-sm text-gray-400">Weapon Types</div>
          </CardContent>
        </Card>
      </div>

      {/* Loadouts Grid */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading loadouts...</div>
        </div>
      ) : filteredLoadouts.length === 0 ? (
        <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No loadouts found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterMode !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first loadout to get started'
              }
            </p>
            {!searchTerm && filterMode === 'all' && (
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-[#FF1F44] hover:bg-red-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Loadout
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLoadouts.map((loadout) => (
            <Card key={loadout.id} className="bg-card/50 border-border/30 backdrop-blur-sm hover:border-[#FF1F44]/30 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <span>{loadout.weapon_name}</span>
                      {loadout.is_featured && (
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      )}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline" className="border-border text-muted-foreground">
                        {loadout.weapon_type}
                      </Badge>
                      <Badge variant="outline" className="border-border text-muted-foreground">
                        {loadout.mode}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(loadout)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteLoadoutMutation.mutate(loadout.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {loadout.image_url && (
                  <div className="mb-4">
                    <img
                      src={loadout.image_url}
                      alt={loadout.weapon_name}
                      className="w-full h-32 object-cover rounded-lg bg-background/20"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {loadout.view_count} views
                  </span>
                  <span>{new Date(loadout.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
