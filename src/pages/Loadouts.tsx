
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Target, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Loadout {
  id: string;
  name: string;
  description: string;
  mode: 'BR' | 'MP';
  primaryWeapon: string;
  secondaryWeapon: string;
  perks: string[];
  scorestreaks: string[];
  createdAt: string;
}

export const Loadouts: React.FC = () => {
  const { toast } = useToast();
  const [loadouts, setLoadouts] = useState<Loadout[]>([
    {
      id: '1',
      name: 'Assault Domination',
      description: 'Aggressive loadout for MP domination matches',
      mode: 'MP',
      primaryWeapon: 'AK-47 - Red Dot, Extended Mag, Compensator',
      secondaryWeapon: 'MW11 - Extended Mag',
      perks: ['Lightweight', 'Ghost', 'Dead Silence'],
      scorestreaks: ['UAV', 'Predator Missile', 'Vtol'],
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'BR Ninja Setup',
      description: 'Stealth-focused Battle Royale loadout',
      mode: 'BR',
      primaryWeapon: 'M4 - Holographic Sight, Foregrip, Extended Mag',
      secondaryWeapon: 'BY15 - Choke, Extended Mag',
      perks: ['Ninja', 'Medic', 'Engineer'],
      scorestreaks: [],
      createdAt: '2024-01-20'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLoadout, setEditingLoadout] = useState<Loadout | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mode: 'MP' as 'BR' | 'MP',
    primaryWeapon: '',
    secondaryWeapon: '',
    perks: '',
    scorestreaks: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLoadout: Loadout = {
      id: editingLoadout?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      mode: formData.mode,
      primaryWeapon: formData.primaryWeapon,
      secondaryWeapon: formData.secondaryWeapon,
      perks: formData.perks.split(',').map(p => p.trim()).filter(Boolean),
      scorestreaks: formData.scorestreaks.split(',').map(s => s.trim()).filter(Boolean),
      createdAt: editingLoadout?.createdAt || new Date().toISOString().split('T')[0]
    };

    if (editingLoadout) {
      setLoadouts(prev => prev.map(l => l.id === editingLoadout.id ? newLoadout : l));
      toast({
        title: "Loadout Updated",
        description: "Your loadout has been successfully updated.",
      });
    } else {
      setLoadouts(prev => [...prev, newLoadout]);
      toast({
        title: "Loadout Created",
        description: "Your new loadout has been added.",
      });
    }

    setIsDialogOpen(false);
    setEditingLoadout(null);
    setFormData({
      name: '',
      description: '',
      mode: 'MP',
      primaryWeapon: '',
      secondaryWeapon: '',
      perks: '',
      scorestreaks: ''
    });
  };

  const handleEdit = (loadout: Loadout) => {
    setEditingLoadout(loadout);
    setFormData({
      name: loadout.name,
      description: loadout.description,
      mode: loadout.mode,
      primaryWeapon: loadout.primaryWeapon,
      secondaryWeapon: loadout.secondaryWeapon,
      perks: loadout.perks.join(', '),
      scorestreaks: loadout.scorestreaks.join(', ')
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setLoadouts(prev => prev.filter(l => l.id !== id));
    toast({
      title: "Loadout Deleted",
      description: "The loadout has been removed.",
      variant: "destructive",
    });
  };

  const getModeColor = (mode: string) => {
    return mode === 'BR' 
      ? 'bg-green-500/20 text-green-400 border-green-500/50' 
      : 'bg-blue-500/20 text-blue-400 border-blue-500/50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-orbitron mb-2">Loadouts</h1>
          <p className="text-muted-foreground font-rajdhani">Manage your weapon configurations and setups</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 font-rajdhani">
              <Plus className="w-4 h-4 mr-2" />
              Create Loadout
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border/50 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-orbitron">
                {editingLoadout ? 'Edit Loadout' : 'Create New Loadout'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="font-rajdhani">Loadout Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-background/50 border-border/50 font-rajdhani"
                    placeholder="Assault Domination"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="mode" className="font-rajdhani">Game Mode</Label>
                  <select
                    id="mode"
                    value={formData.mode}
                    onChange={(e) => setFormData(prev => ({ ...prev, mode: e.target.value as 'BR' | 'MP' }))}
                    className="w-full p-2 bg-background/50 border border-border/50 rounded-md font-rajdhani"
                    required
                  >
                    <option value="MP">Multiplayer</option>
                    <option value="BR">Battle Royale</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description" className="font-rajdhani">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-background/50 border-border/50 font-rajdhani"
                  placeholder="Describe your loadout strategy..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="primaryWeapon" className="font-rajdhani">Primary Weapon</Label>
                <Input
                  id="primaryWeapon"
                  value={formData.primaryWeapon}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryWeapon: e.target.value }))}
                  className="bg-background/50 border-border/50 font-rajdhani"
                  placeholder="AK-47 - Red Dot, Extended Mag, Compensator"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="secondaryWeapon" className="font-rajdhani">Secondary Weapon</Label>
                <Input
                  id="secondaryWeapon"
                  value={formData.secondaryWeapon}
                  onChange={(e) => setFormData(prev => ({ ...prev, secondaryWeapon: e.target.value }))}
                  className="bg-background/50 border-border/50 font-rajdhani"
                  placeholder="MW11 - Extended Mag"
                />
              </div>
              
              <div>
                <Label htmlFor="perks" className="font-rajdhani">Perks (comma-separated)</Label>
                <Input
                  id="perks"
                  value={formData.perks}
                  onChange={(e) => setFormData(prev => ({ ...prev, perks: e.target.value }))}
                  className="bg-background/50 border-border/50 font-rajdhani"
                  placeholder="Lightweight, Ghost, Dead Silence"
                />
              </div>
              
              {formData.mode === 'MP' && (
                <div>
                  <Label htmlFor="scorestreaks" className="font-rajdhani">Scorestreaks (comma-separated)</Label>
                  <Input
                    id="scorestreaks"
                    value={formData.scorestreaks}
                    onChange={(e) => setFormData(prev => ({ ...prev, scorestreaks: e.target.value }))}
                    className="bg-background/50 border-border/50 font-rajdhani"
                    placeholder="UAV, Predator Missile, Vtol"
                  />
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="font-rajdhani"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90 font-rajdhani">
                  {editingLoadout ? 'Update' : 'Create'} Loadout
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1 font-orbitron">{loadouts.length}</div>
            <div className="text-sm text-muted-foreground font-rajdhani">Total Loadouts</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1 font-orbitron">
              {loadouts.filter(l => l.mode === 'MP').length}
            </div>
            <div className="text-sm text-muted-foreground font-rajdhani">MP Loadouts</div>
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
      </div>

      {/* Loadouts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadouts.map(loadout => (
          <Card key={loadout.id} className="bg-card/50 border-border/30 hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-orbitron text-lg">{loadout.name}</CardTitle>
                <Badge className={getModeColor(loadout.mode)}>
                  {loadout.mode}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm font-rajdhani">{loadout.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center mb-2">
                  <Target className="w-4 h-4 text-primary mr-2" />
                  <span className="font-medium text-foreground font-rajdhani">Weapons</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1 font-rajdhani">
                  <div><strong>Primary:</strong> {loadout.primaryWeapon}</div>
                  <div><strong>Secondary:</strong> {loadout.secondaryWeapon}</div>
                </div>
              </div>
              
              {loadout.perks.length > 0 && (
                <div>
                  <div className="flex items-center mb-2">
                    <Zap className="w-4 h-4 text-primary mr-2" />
                    <span className="font-medium text-foreground font-rajdhani">Perks</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {loadout.perks.map(perk => (
                      <Badge key={perk} variant="outline" className="text-xs font-rajdhani">
                        {perk}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {loadout.scorestreaks.length > 0 && (
                <div>
                  <div className="flex items-center mb-2">
                    <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                    <span className="font-medium text-foreground font-rajdhani">Scorestreaks</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {loadout.scorestreaks.map(streak => (
                      <Badge key={streak} variant="outline" className="text-xs font-rajdhani border-yellow-400/50 text-yellow-400">
                        {streak}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-2 border-t border-border/30">
                <span className="text-xs text-muted-foreground font-rajdhani">
                  Created: {new Date(loadout.createdAt).toLocaleDateString()}
                </span>
                <div className="space-x-2">
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loadouts.length === 0 && (
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-12 text-center">
            <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-orbitron text-foreground mb-2">No Loadouts Yet</h3>
            <p className="text-muted-foreground mb-4 font-rajdhani">
              Create your first loadout to get started with your tactical setups.
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 font-rajdhani"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Loadout
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
