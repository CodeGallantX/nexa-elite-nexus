
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Edit, 
  Trash2, 
  Target,
  Filter,
  Plus,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock loadouts data
const mockLoadouts = [
  {
    id: '1',
    playerName: 'slayerX',
    title: 'Assault Domination',
    description: 'High damage assault rifle setup for MP matches',
    mode: 'MP',
    primaryWeapon: 'AK-47',
    attachments: 'Red Dot, Extended Mag, Compensator',
    secondaryWeapon: 'MW11',
    lethal: 'Frag Grenade',
    tactical: 'Smoke Grenade',
    dateCreated: '2024-07-10',
    assignedScrims: ['Championship Qualifier', 'Training Match']
  },
  {
    id: '2',
    playerName: 'TacticalSniper',
    title: 'BR Ninja Setup',
    description: 'Stealth-focused loadout for Battle Royale',
    mode: 'BR',
    primaryWeapon: 'M4',
    attachments: 'Holographic Sight, Foregrip, Extended Mag',
    secondaryWeapon: 'J358',
    lethal: 'Trip Mine',
    tactical: 'Smoke Bomb',
    dateCreated: '2024-07-12',
    assignedScrims: ['Clan War vs Thunder']
  }
];

export const AdminLoadouts: React.FC = () => {
  const { toast } = useToast();
  const [loadouts, setLoadouts] = useState(mockLoadouts);
  const [searchTerm, setSearchTerm] = useState('');
  const [modeFilter, setModeFilter] = useState('all');
  const [editingLoadout, setEditingLoadout] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getModeColor = (mode: string) => {
    return mode === 'BR' 
      ? 'bg-green-500/20 text-green-400 border-green-500/50' 
      : 'bg-purple-500/20 text-purple-400 border-purple-500/50';
  };

  const filteredLoadouts = loadouts.filter(loadout => {
    const matchesSearch = loadout.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loadout.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = modeFilter === 'all' || loadout.mode === modeFilter;
    
    return matchesSearch && matchesMode;
  });

  const handleDelete = (loadoutId: string) => {
    setLoadouts(prev => prev.filter(l => l.id !== loadoutId));
    toast({
      title: "Loadout Deleted",
      description: "The loadout has been removed successfully.",
    });
  };

  const handleEdit = (loadout: any) => {
    setEditingLoadout(loadout);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingLoadout) {
      setLoadouts(prev => prev.map(l => 
        l.id === editingLoadout.id ? editingLoadout : l
      ));
      toast({
        title: "Loadout Updated",
        description: "Changes have been saved successfully.",
      });
    }
    setIsDialogOpen(false);
    setEditingLoadout(null);
  };

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
            <div className="text-2xl font-bold text-green-400 mb-1 font-orbitron">
              {loadouts.filter(l => l.mode === 'BR').length}
            </div>
            <div className="text-sm text-muted-foreground font-rajdhani">BR Loadouts</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1 font-orbitron">
              {loadouts.filter(l => l.mode === 'MP').length}
            </div>
            <div className="text-sm text-muted-foreground font-rajdhani">MP Loadouts</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1 font-orbitron">
              {loadouts.filter(l => l.assignedScrims.length > 0).length}
            </div>
            <div className="text-sm text-muted-foreground font-rajdhani">Assigned</div>
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
                placeholder="Search by player or loadout name..."
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
                <TableHead className="text-muted-foreground font-rajdhani">Loadout</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Mode</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Primary</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Assigned Scrims</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoadouts.map(loadout => (
                <TableRow key={loadout.id} className="border-border/30 hover:bg-muted/20">
                  <TableCell>
                    <div className="font-medium text-foreground font-rajdhani">{loadout.playerName}</div>
                    <div className="text-sm text-muted-foreground font-rajdhani">
                      {new Date(loadout.dateCreated).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground font-rajdhani">{loadout.title}</div>
                    <div className="text-sm text-muted-foreground font-rajdhani max-w-xs truncate">
                      {loadout.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getModeColor(loadout.mode)}>
                      {loadout.mode}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground font-rajdhani">{loadout.primaryWeapon}</div>
                    <div className="text-sm text-muted-foreground font-rajdhani">{loadout.attachments}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {loadout.assignedScrims.map((scrim, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-border/50">
                          {scrim}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
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
                  <Label htmlFor="title" className="font-rajdhani">Loadout Name</Label>
                  <Input
                    id="title"
                    value={editingLoadout.title}
                    onChange={(e) => setEditingLoadout(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-background/50 border-border/50 font-rajdhani"
                  />
                </div>
                <div>
                  <Label htmlFor="mode" className="font-rajdhani">Game Mode</Label>
                  <Select 
                    value={editingLoadout.mode} 
                    onValueChange={(value) => setEditingLoadout(prev => ({ ...prev, mode: value }))}
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
              </div>
              
              <div>
                <Label htmlFor="description" className="font-rajdhani">Description</Label>
                <Textarea
                  id="description"
                  value={editingLoadout.description}
                  onChange={(e) => setEditingLoadout(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-background/50 border-border/50 font-rajdhani"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryWeapon" className="font-rajdhani">Primary Weapon</Label>
                  <Input
                    id="primaryWeapon"
                    value={editingLoadout.primaryWeapon}
                    onChange={(e) => setEditingLoadout(prev => ({ ...prev, primaryWeapon: e.target.value }))}
                    className="bg-background/50 border-border/50 font-rajdhani"
                  />
                </div>
                <div>
                  <Label htmlFor="attachments" className="font-rajdhani">Attachments</Label>
                  <Input
                    id="attachments"
                    value={editingLoadout.attachments}
                    onChange={(e) => setEditingLoadout(prev => ({ ...prev, attachments: e.target.value }))}
                    className="bg-background/50 border-border/50 font-rajdhani"
                  />
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
                  onClick={handleSave}
                  className="bg-primary hover:bg-primary/90 font-rajdhani"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
