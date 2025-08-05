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
  Eye,
  Copy,
  Upload
} from 'lucide-react';

interface WeaponLayout {
  id: string;
  player_id: string;
  weapon_name: string;
  weapon_type: string;
  mode: string;
  image_url?: string;
  image_name?: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    ign: string;
  };
}

export const WeaponLoadouts: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [filterWeaponType, setFilterWeaponType] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLayout, setEditingLayout] = useState<WeaponLayout | null>(null);
  const [selectedLayout, setSelectedLayout] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    weapon_name: '',
    weapon_type: '',
    mode: '',
    image_file: null as File | null
  });

  // Fetch all weapon layouts (both user's and others')
  const { data: layouts = [], isLoading } = useQuery({
    queryKey: ['weapon-layouts'],
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

      if (error) throw error;
      return data as WeaponLayout[];
    },
  });

  // Create/Update layout mutation
  const saveLayoutMutation = useMutation({
    mutationFn: async (layoutData: any) => {
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

      if (editingLayout) {
        // Update existing
        const { error } = await supabase
          .from('weapon_layouts')
          .update(payload)
          .eq('id', editingLayout.id);
        
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
      queryClient.invalidateQueries({ queryKey: ['weapon-layouts'] });
      setIsDialogOpen(false);
      setEditingLayout(null);
      setFormData({
        weapon_name: '',
        weapon_type: '',
        mode: '',
        image_file: null
      });
      toast({
        title: editingLayout ? "Layout Updated" : "Layout Created",
        description: `Your weapon layout has been ${editingLayout ? 'updated' : 'created'} successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save weapon layout.",
        variant: "destructive",
      });
    }
  });

  // Delete layout mutation
  const deleteLayoutMutation = useMutation({
    mutationFn: async (layoutId: string) => {
      const { error } = await supabase
        .from('weapon_layouts')
        .delete()
        .eq('id', layoutId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weapon-layouts'] });
      toast({
        title: "Layout Deleted",
        description: "Your weapon layout has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete weapon layout.",
        variant: "destructive",
      });
    }
  });

  // Copy layout mutation
  const copyLayoutMutation = useMutation({
    mutationFn: async (layout: any) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('weapon_layouts')
        .insert({
          weapon_name: layout.weapon_name,
          weapon_type: layout.weapon_type,
          mode: layout.mode,
          player_id: user.id,
          image_url: layout.image_url
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weapon-layouts'] });
      toast({
        title: "Success",
        description: "Layout copied to your collection",
      });
    },
    onError: (error) => {
      console.error('Error copying layout:', error);
      toast({
        title: "Error",
        description: "Failed to copy layout",
        variant: "destructive",
      });
    },
  });

  // Update view count mutation
  const updateViewCountMutation = useMutation({
    mutationFn: async (layoutId: string) => {
      const { error } = await supabase
        .from('weapon_layouts')
        .update({ 
          view_count: layouts.find(l => l.id === layoutId)?.view_count + 1 || 1 
        })
        .eq('id', layoutId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weapon-layouts'] });
    }
  });

  const filteredLayouts = layouts.filter(layout => {
    const matchesSearch = layout.weapon_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = filterMode === 'all' || layout.mode === filterMode;
    const matchesWeaponType = filterWeaponType === 'all' || layout.weapon_type === filterWeaponType;
    return matchesSearch && matchesMode && matchesWeaponType;
  });

  const userLayouts = filteredLayouts.filter(layout => layout.player_id === user?.id);
  const otherLayouts = filteredLayouts.filter(layout => layout.player_id !== user?.id);

  const handleEdit = (layout: WeaponLayout) => {
    setEditingLayout(layout);
    setFormData({
      weapon_name: layout.weapon_name,
      weapon_type: layout.weapon_type,
      mode: layout.mode,
      image_file: null
    });
    setIsDialogOpen(true);
  };

  const handleView = (layout: WeaponLayout) => {
    setSelectedLayout(layout);
    setIsViewDialogOpen(true);
    updateViewCountMutation.mutate(layout.id);
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
    saveLayoutMutation.mutate(formData);
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'MP': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'BR': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'Tournament': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Scrims': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getWeaponTypeColor = (type: string) => {
    switch (type) {
      case 'Assault': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'SMG': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'Sniper': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'LMG': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'Shotgun': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white font-orbitron">Weapon Loadouts</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingLayout(null);
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
              Create Layout
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingLayout ? 'Edit Weapon Layout' : 'Create New Weapon Layout'}
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
                    <SelectItem value="Assault">Assault</SelectItem>
                    <SelectItem value="SMG">SMG</SelectItem>
                    <SelectItem value="Sniper">Sniper</SelectItem>
                    <SelectItem value="LMG">LMG</SelectItem>
                    <SelectItem value="Shotgun">Shotgun</SelectItem>
                    <SelectItem value="Melee">Melee</SelectItem>
                    <SelectItem value="Pistol">Pistol</SelectItem>
                    <SelectItem value="Launcher">Launcher</SelectItem>
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
                    <SelectItem value="Tournament">Tournament</SelectItem>
                    <SelectItem value="Scrims">Scrims</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="image" className="text-white">Layout Image</Label>
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
                  disabled={saveLayoutMutation.isPending}
                  className="bg-[#FF1F44] hover:bg-red-600 text-white"
                >
                  {saveLayoutMutation.isPending ? 'Saving...' : (editingLayout ? 'Update' : 'Create')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                  placeholder="Search weapon layouts..."
                  className="pl-10 bg-background/50"
                />
              </div>
            </div>
            <Select value={filterMode} onValueChange={setFilterMode}>
              <SelectTrigger className="w-full sm:w-40 bg-background/50">
                <SelectValue placeholder="Filter by mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="MP">Multiplayer</SelectItem>
                <SelectItem value="BR">Battle Royale</SelectItem>
                <SelectItem value="Tournament">Tournament</SelectItem>
                <SelectItem value="Scrims">Scrims</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterWeaponType} onValueChange={setFilterWeaponType}>
              <SelectTrigger className="w-full sm:w-40 bg-background/50">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Assault">Assault</SelectItem>
                <SelectItem value="SMG">SMG</SelectItem>
                <SelectItem value="Sniper">Sniper</SelectItem>
                <SelectItem value="LMG">LMG</SelectItem>
                <SelectItem value="Shotgun">Shotgun</SelectItem>
                <SelectItem value="Melee">Melee</SelectItem>
                <SelectItem value="Pistol">Pistol</SelectItem>
                <SelectItem value="Launcher">Launcher</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* My Layouts Section */}
      {userLayouts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white font-orbitron">My Layouts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userLayouts.map((layout) => (
              <Card key={layout.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white text-lg">{layout.weapon_name}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleView(layout)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(layout)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this layout?')) {
                            deleteLayoutMutation.mutate(layout.id);
                          }
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {layout.image_url && (
                    <img
                      src={layout.image_url}
                      alt={layout.weapon_name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={getModeColor(layout.mode)}>
                      {layout.mode}
                    </Badge>
                    <Badge className={getWeaponTypeColor(layout.weapon_type)}>
                      {layout.weapon_type}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-400">
                    Views: {layout.view_count || 0} • {new Date(layout.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Community Layouts Section */}
      {otherLayouts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white font-orbitron">Community Layouts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherLayouts.map((layout) => (
              <Card key={layout.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-lg">{layout.weapon_name}</CardTitle>
                      <p className="text-gray-300 text-sm">by Ɲ・乂{layout.profiles?.ign || 'Unknown'}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleView(layout)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => copyLayoutMutation.mutate(layout)}
                        disabled={copyLayoutMutation.isPending}
                        className="bg-[#FF1F44] hover:bg-red-600 text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {layout.image_url && (
                    <img
                      src={layout.image_url}
                      alt={layout.weapon_name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={getModeColor(layout.mode)}>
                      {layout.mode}
                    </Badge>
                    <Badge className={getWeaponTypeColor(layout.weapon_type)}>
                      {layout.weapon_type}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-400">
                    Views: {layout.view_count || 0} • {new Date(layout.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* View Layout Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white font-orbitron">
              {selectedLayout?.weapon_name}
            </DialogTitle>
          </DialogHeader>
          {selectedLayout && (
            <div className="space-y-4">
              {selectedLayout.image_url && (
                <img
                  src={selectedLayout.image_url}
                  alt={selectedLayout.weapon_name}
                  className="w-full h-64 object-contain rounded-lg bg-black/20"
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Weapon Type</Label>
                  <p className="text-white">{selectedLayout.weapon_type}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Mode</Label>
                  <p className="text-white">{selectedLayout.mode}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Created by</Label>
                  <p className="text-white">Ɲ・乂{selectedLayout.profiles?.ign || 'Unknown'}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Views</Label>
                  <p className="text-white">{selectedLayout.view_count || 0}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {layouts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No weapon layouts yet</p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-[#FF1F44] hover:bg-red-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Layout
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-12">
          <div className="text-white">Loading weapon layouts...</div>
        </div>
      )}
    </div>
  );
};