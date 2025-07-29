
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Download, Search, Filter, Star, StarOff } from 'lucide-react';

interface WeaponLayoutWithProfile {
  id: string;
  mode: string;
  weapon_type: string;
  weapon_name: string;
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

export const AdminWeaponLayouts: React.FC = () => {
  const { toast } = useToast();
  const [layouts, setLayouts] = useState<WeaponLayoutWithProfile[]>([]);
  const [filteredLayouts, setFilteredLayouts] = useState<WeaponLayoutWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [filterWeaponType, setFilterWeaponType] = useState('all');

  const weaponTypes = ['Assault', 'SMG', 'Sniper', 'LMG', 'Shotgun', 'Pistol', 'Marksman'];
  const modes = ['BR', 'MP', 'Both'];

  useEffect(() => {
    fetchLayouts();
  }, []);

  useEffect(() => {
    filterLayouts();
  }, [layouts, searchTerm, filterMode, filterWeaponType]);

  const fetchLayouts = async () => {
    try {
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
      setLayouts(data || []);
    } catch (error) {
      console.error('Error fetching layouts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch weapon layouts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterLayouts = () => {
    let filtered = layouts;

    if (searchTerm) {
      filtered = filtered.filter(layout =>
        layout.weapon_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        layout.profiles.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        layout.profiles.ign.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterMode !== 'all') {
      filtered = filtered.filter(layout => layout.mode === filterMode);
    }

    if (filterWeaponType !== 'all') {
      filtered = filtered.filter(layout => layout.weapon_type === filterWeaponType);
    }

    setFilteredLayouts(filtered);
  };

  const toggleFeatured = async (layoutId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('weapon_layouts')
        .update({ is_featured: !currentStatus })
        .eq('id', layoutId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Layout ${!currentStatus ? 'featured' : 'unfeatured'} successfully`,
      });

      await fetchLayouts();
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      });
    }
  };

  const downloadImage = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = imageName || 'weapon-layout.jpg';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-white">Loading weapon layouts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Weapon Layouts Management</h1>
      </div>

      {/* Filters */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                  placeholder="Search by player or weapon name..."
                />
              </div>
            </div>
            
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Mode</label>
              <Select value={filterMode} onValueChange={setFilterMode}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  {modes.map(mode => (
                    <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-2 block">Weapon Type</label>
              <Select value={filterWeaponType} onValueChange={setFilterWeaponType}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {weaponTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layouts Table */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Player</TableHead>
                <TableHead className="text-gray-300">Mode</TableHead>
                <TableHead className="text-gray-300">Weapon Type</TableHead>
                <TableHead className="text-gray-300">Weapon Name</TableHead>
                <TableHead className="text-gray-300">Views</TableHead>
                <TableHead className="text-gray-300">Featured</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLayouts.map((layout) => (
                <TableRow key={layout.id} className="border-gray-700">
                  <TableCell className="text-white">
                    <div>
                      <div className="font-medium">Ɲ・乂{layout.profiles.ign}</div>
                      <div className="text-sm text-gray-400">@{layout.profiles.username}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">{layout.mode}</TableCell>
                  <TableCell className="text-white">{layout.weapon_type}</TableCell>
                  <TableCell className="text-white">{layout.weapon_name}</TableCell>
                  <TableCell className="text-white">{layout.view_count}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFeatured(layout.id, layout.is_featured)}
                      className={layout.is_featured ? 'text-yellow-400' : 'text-gray-400'}
                    >
                      {layout.is_featured ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {layout.image_url && (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle className="text-white">
                                  {layout.weapon_name} - Ɲ・乂{layout.profiles.ign}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="flex flex-col items-center space-y-4">
                                <img
                                  src={layout.image_url}
                                  alt={layout.weapon_name}
                                  className="max-w-full max-h-96 object-contain rounded-lg"
                                />
                                <Button
                                  onClick={() => downloadImage(layout.image_url!, layout.image_name || 'weapon-layout.jpg')}
                                  className="bg-[#FF1F44] hover:bg-red-600 text-white"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => downloadImage(layout.image_url!, layout.image_name || 'weapon-layout.jpg')}
                            className="text-gray-400 hover:text-white"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredLayouts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No weapon layouts found</p>
        </div>
      )}
    </div>
  );
};
