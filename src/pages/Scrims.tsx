
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Users, Target, Trophy, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Scrim {
  id: string;
  title: string;
  date: string;
  time: string;
  mode: 'BR' | 'MP';
  status: 'upcoming' | 'ongoing' | 'completed';
  playerAssignment: {
    squad: string;
    role: string;
  };
  kills?: number;
  placement?: number;
  teamScore?: number;
}

export const Scrims: React.FC = () => {
  const { toast } = useToast();
  const [scrims, setScrims] = useState<Scrim[]>([
    {
      id: '1',
      title: 'Clan War vs Thunder',
      date: '2024-07-15',
      time: '20:00',
      mode: 'BR',
      status: 'upcoming',
      playerAssignment: {
        squad: 'Alpha Squad',
        role: 'Assault'
      }
    },
    {
      id: '2',
      title: 'Training Scrim - Hardpoint',
      date: '2024-07-14',
      time: '19:00',
      mode: 'MP',
      status: 'completed',
      playerAssignment: {
        squad: 'Beta Squad',
        role: 'Objective'
      },
      kills: 18,
      teamScore: 150
    },
    {
      id: '3',
      title: 'Championship Qualifier',
      date: '2024-07-13',
      time: '21:00',
      mode: 'BR',
      status: 'completed',
      playerAssignment: {
        squad: 'Alpha Squad',
        role: 'Support'
      },
      kills: 12,
      placement: 3
    }
  ]);

  const [isKillTrackerOpen, setIsKillTrackerOpen] = useState(false);
  const [selectedScrim, setSelectedScrim] = useState<Scrim | null>(null);
  const [killCount, setKillCount] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'ongoing':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getModeColor = (mode: string) => {
    return mode === 'BR' 
      ? 'bg-green-500/20 text-green-400 border-green-500/50' 
      : 'bg-purple-500/20 text-purple-400 border-purple-500/50';
  };

  const handleUpdateKills = () => {
    if (!selectedScrim || !killCount) return;

    setScrims(prev => prev.map(scrim => 
      scrim.id === selectedScrim.id 
        ? { ...scrim, kills: parseInt(killCount) }
        : scrim
    ));

    toast({
      title: "Kills Updated",
      description: `Updated kills for ${selectedScrim.title}`,
    });

    setIsKillTrackerOpen(false);
    setSelectedScrim(null);
    setKillCount('');
  };

  const openKillTracker = (scrim: Scrim) => {
    setSelectedScrim(scrim);
    setKillCount(scrim.kills?.toString() || '');
    setIsKillTrackerOpen(true);
  };

  const upcomingScrims = scrims.filter(s => s.status === 'upcoming');
  const completedScrims = scrims.filter(s => s.status === 'completed');
  const totalKills = completedScrims.reduce((sum, scrim) => sum + (scrim.kills || 0), 0);
  const avgKills = completedScrims.length > 0 ? (totalKills / completedScrims.length).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-orbitron mb-2">Scrims</h1>
          <p className="text-muted-foreground font-rajdhani">Track your performance and upcoming matches</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1 font-orbitron">{upcomingScrims.length}</div>
            <div className="text-sm text-muted-foreground font-rajdhani">Upcoming</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-400 mb-1 font-orbitron">{completedScrims.length}</div>
            <div className="text-sm text-muted-foreground font-rajdhani">Completed</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1 font-orbitron">{totalKills}</div>
            <div className="text-sm text-muted-foreground font-rajdhani">Total Kills</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1 font-orbitron">{avgKills}</div>
            <div className="text-sm text-muted-foreground font-rajdhani">Avg Kills</div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Scrims */}
      {upcomingScrims.length > 0 && (
        <div>
          <h2 className="text-xl font-orbitron text-foreground mb-4">Upcoming Scrims</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingScrims.map(scrim => (
              <Card key={scrim.id} className="bg-card/50 border-border/30 hover:border-primary/30 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-orbitron text-lg">{scrim.title}</CardTitle>
                    <div className="flex space-x-2">
                      <Badge className={getModeColor(scrim.mode)}>{scrim.mode}</Badge>
                      <Badge className={getStatusColor(scrim.status)}>{scrim.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-rajdhani">{new Date(scrim.date).toLocaleDateString()}</span>
                    <Clock className="w-4 h-4 ml-4 mr-2" />
                    <span className="font-rajdhani">{scrim.time}</span>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="font-rajdhani">{scrim.playerAssignment.squad} - {scrim.playerAssignment.role}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Scrims */}
      <div>
        <h2 className="text-xl font-orbitron text-foreground mb-4">Match History</h2>
        <div className="space-y-4">
          {completedScrims.map(scrim => (
            <Card key={scrim.id} className="bg-card/50 border-border/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="font-orbitron text-foreground text-lg">{scrim.title}</h3>
                      <Badge className={getModeColor(scrim.mode)}>{scrim.mode}</Badge>
                      <Badge className={getStatusColor(scrim.status)}>{scrim.status}</Badge>
                    </div>
                    
                    <div className="flex items-center text-muted-foreground space-x-6">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="font-rajdhani">{new Date(scrim.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span className="font-rajdhani">{scrim.playerAssignment.squad}</span>
                      </div>
                      <div className="flex items-center">
                        <Target className="w-4 h-4 mr-1" />
                        <span className="font-rajdhani">{scrim.playerAssignment.role}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    {scrim.kills !== undefined && (
                      <div className="text-center">
                        <div className="text-xl font-bold text-primary font-orbitron">{scrim.kills}</div>
                        <div className="text-xs text-muted-foreground font-rajdhani">Kills</div>
                      </div>
                    )}
                    
                    {scrim.placement && (
                      <div className="text-center">
                        <div className="text-xl font-bold text-yellow-400 font-orbitron">#{scrim.placement}</div>
                        <div className="text-xs text-muted-foreground font-rajdhani">Place</div>
                      </div>
                    )}
                    
                    {scrim.teamScore && (
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-400 font-orbitron">{scrim.teamScore}</div>
                        <div className="text-xs text-muted-foreground font-rajdhani">Score</div>
                      </div>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openKillTracker(scrim)}
                      className="border-border/50 hover:bg-muted/50 font-rajdhani"
                    >
                      <Target className="w-4 h-4 mr-1" />
                      Update
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Kill Tracker Dialog */}
      <Dialog open={isKillTrackerOpen} onOpenChange={setIsKillTrackerOpen}>
        <DialogContent className="bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="font-orbitron">Update Kill Count</DialogTitle>
          </DialogHeader>
          
          {selectedScrim && (
            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground font-rajdhani mb-2">Match: {selectedScrim.title}</p>
                <p className="text-muted-foreground font-rajdhani">Date: {new Date(selectedScrim.date).toLocaleDateString()}</p>
              </div>
              
              <div>
                <Label htmlFor="killCount" className="font-rajdhani">Number of Kills</Label>
                <Input
                  id="killCount"
                  type="number"
                  value={killCount}
                  onChange={(e) => setKillCount(e.target.value)}
                  className="bg-background/50 border-border/50 font-rajdhani"
                  placeholder="Enter kill count"
                  min="0"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsKillTrackerOpen(false)}
                  className="font-rajdhani"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateKills}
                  className="bg-primary hover:bg-primary/90 font-rajdhani"
                >
                  Update Kills
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {scrims.length === 0 && (
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-12 text-center">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-orbitron text-foreground mb-2">No Scrims Available</h3>
            <p className="text-muted-foreground font-rajdhani">
              Scrims will appear here when they are scheduled by the admin.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
