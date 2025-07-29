
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { usePlayerLoadouts, useDeleteLoadout } from '@/hooks/usePlayerLoadouts';
import { Search, Eye, Trash2, Star, StarOff, Download } from 'lucide-react';

export const AdminLoadouts: React.FC = () => {
  const { data: loadouts, isLoading } = usePlayerLoadouts();
  const deleteLoadout = useDeleteLoadout();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [filterWeaponType, setFilterWeaponType] = useState('all');
  const [selectedLoadout, setSelectedLoadout] = useState<any>(null);

  const weaponTypes = ['Assault', 'SMG', 'Sniper', 'LMG', 'Shotgun', 'Pistol', 'Marksman'];
  const modes = ['BR', 'MP', 'Both'];

  const filteredLoadouts = loadouts?.filter(loadout => {
    const matchesSearch = loadout.weapon_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loadout.profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loadout.profiles?.ign?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = filterMode === 'all' || loadout.mode === filterMode;
    const matchesWeaponType = filterWeaponType === 'all' || loadout.weapon_type === filterWeaponType;
    return matchesSearch && matchesMode && matchesWeaponType;
  }) || [];

  const handleDeleteLoadout = async (loadoutId: string) => {
    await deleteLoadout.mutateAsync(loadoutId);
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
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'BR': return 'bg-green-100 text-green-800';
      case 'MP': return 'bg-blue-100 text-blue-800';
      case 'Both': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWeaponTypeColor = (type: string) => {
    switch (type) {
      case 'Assault': return 'bg-red-100 text-red-800';
      case 'SMG': return 'bg-yellow-100 text-yellow-800';
      case 'Sniper': return 'bg-purple-100 text-purple-800';
      case 'LMG': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-white">Loading loadouts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Player Loadouts</h1>
      </div>

      {/* Filters */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white"
                placeholder="Search by player or weapon name..."
              />
            </div>
            
            <Select value={filterMode} onValueChange={setFilterMode}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Filter by mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                {modes.map(mode => (
                  <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterWeaponType} onValueChange={setFilterWeaponType}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Filter by weapon type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {weaponTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loadouts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLoadouts.map((loadout) => (
          <Card key={loadout.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {loadout.is_featured && <Star className="w-4 h-4 text-yellow-400" />}
                  <h3 className="text-white font-semibold">{loadout.weapon_name}</h3>
                </div>
                <div className="flex space-x-1">
                  {loadout.image_url && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-gray-400 hover:text-white"
                          onClick={() => setSelectedLoadout(loadout)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle className="text-white">
                            {selectedLoadout?.weapon_name} - {selectedLoadout?.profiles?.ign}
                          </DialogTitle>
                        </DialogHeader>
                        {selectedLoadout && (
                          <div className="space-y-4">
                            <div className="flex flex-col items-center space-y-4">
                              <img
                                src={selectedLoadout.image_url}
                                alt={selectedLoadout.weapon_name}
                                className="max-w-full max-h-96 object-contain rounded-lg"
                              />
                              <div className="flex space-x-4">
                                <Button
                                  onClick={() => downloadImage(selectedLoadout.image_url, selectedLoadout.image_name || 'weapon-layout.jpg')}
                                  className="bg-[#FF1F44] hover:bg-red-600 text-white"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-gray-300 text-sm">Player</label>
                                <p className="text-white">Ɲ・乂{selectedLoadout.profiles?.ign} (@{selectedLoadout.profiles?.username})</p>
                              </div>
                              <div>
                                <label className="text-gray-300 text-sm">Mode</label>
                                <Badge className={getModeColor(selectedLoadout.mode)}>{selectedLoadout.mode}</Badge>
                              </div>
                              <div>
                                <label className="text-gray-300 text-sm">Weapon Type</label>
                                <Badge className={getWeaponTypeColor(selectedLoadout.weapon_type)}>{selectedLoadout.weapon_type}</Badge>
                              </div>
                              <div>
                                <label className="text-gray-300 text-sm">Views</label>
                                <p className="text-white">{selectedLoadout.view_count || 0}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  )}
                  
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
                        <AlertDialogTitle>Delete Loadout</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this loadout? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteLoadout(loadout.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Player</span>
                  <span className="text-white text-sm">Ɲ・乂{loadout.profiles?.ign}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Mode</span>
                  <Badge className={getModeColor(loadout.mode)}>{loadout.mode}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Type</span>
                  <Badge className={getWeaponTypeColor(loadout.weapon_type)}>{loadout.weapon_type}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Views</span>
                  <span className="text-white font-semibold">{loadout.view_count || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Created</span>
                  <span className="text-white text-sm">
                    {loadout.created_at ? new Date(loadout.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLoadouts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No loadouts found</p>
        </div>
      )}
    </div>
  );
};
