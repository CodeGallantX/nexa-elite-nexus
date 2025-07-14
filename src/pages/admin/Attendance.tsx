
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  UserCheck, 
  UserX,
  Calendar,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockPlayers = [
  { ign: 'slayerX', attendance: 85, lastSeen: '2024-07-14', status: 'active' },
  { ign: 'TacticalSniper', attendance: 78, lastSeen: '2024-07-13', status: 'active' },
  { ign: 'EliteWarrior', attendance: 65, lastSeen: '2024-07-12', status: 'inactive' },
  { ign: 'GhostAlpha', attendance: 95, lastSeen: '2024-07-14', status: 'active' },
  { ign: 'ProSniper', attendance: 72, lastSeen: '2024-07-11', status: 'active' }
];

const mockScrims = [
  { id: '1', name: 'Clan War vs Thunder', date: '2024-07-15' },
  { id: '2', name: 'Training Scrim', date: '2024-07-14' },
  { id: '3', name: 'Championship Qualifier', date: '2024-07-13' }
];

const mockAttendanceRecords = [
  { id: '1', playerIgn: 'slayerX', scrimName: 'Clan War vs Thunder', date: '2024-07-15', status: 'present' },
  { id: '2', playerIgn: 'TacticalSniper', scrimName: 'Training Scrim', date: '2024-07-14', status: 'present' },
  { id: '3', playerIgn: 'EliteWarrior', scrimName: 'Training Scrim', date: '2024-07-14', status: 'absent' }
];

export const AdminAttendance: React.FC = () => {
  const { toast } = useToast();
  const [players] = useState(mockPlayers);
  const [scrims] = useState(mockScrims);
  const [attendanceRecords, setAttendanceRecords] = useState(mockAttendanceRecords);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedScrim, setSelectedScrim] = useState('');
  const [attendanceDate, setAttendanceDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 80) return 'text-green-400';
    if (attendance >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusColor = (status: string) => {
    return status === 'present' 
      ? 'bg-green-500/20 text-green-400 border-green-500/50' 
      : 'bg-red-500/20 text-red-400 border-red-500/50';
  };

  const markAttendance = (status: 'present' | 'absent') => {
    if (!selectedPlayer || !selectedScrim || !attendanceDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before marking attendance.",
        variant: "destructive"
      });
      return;
    }

    const selectedScrimData = scrims.find(s => s.id === selectedScrim);
    const newRecord = {
      id: Date.now().toString(),
      playerIgn: selectedPlayer,
      scrimName: selectedScrimData?.name || '',
      date: attendanceDate,
      status
    };

    setAttendanceRecords(prev => [...prev, newRecord]);
    
    // Clear form
    setSelectedPlayer('');
    setSelectedScrim('');
    setAttendanceDate('');

    toast({
      title: "Attendance Marked",
      description: `${selectedPlayer} marked as ${status} for ${selectedScrimData?.name}`,
    });
  };

  const filteredPlayers = players.filter(player => 
    player.ign.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRecords = attendanceRecords.filter(record =>
    record.playerIgn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgAttendance = Math.round(players.reduce((sum, p) => sum + p.attendance, 0) / players.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-orbitron mb-2">Attendance Management</h1>
          <p className="text-muted-foreground font-rajdhani">Track and manage player attendance</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1 font-orbitron">{players.length}</div>
            <div className="text-sm text-muted-foreground font-rajdhani">Total Players</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1 font-orbitron">{avgAttendance}%</div>
            <div className="text-sm text-muted-foreground font-rajdhani">Avg Attendance</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1 font-orbitron">
              {attendanceRecords.filter(r => r.status === 'present').length}
            </div>
            <div className="text-sm text-muted-foreground font-rajdhani">Present Records</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400 mb-1 font-orbitron">
              {attendanceRecords.filter(r => r.status === 'absent').length}
            </div>
            <div className="text-sm text-muted-foreground font-rajdhani">Absent Records</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mark Attendance Form */}
        <Card className="bg-card/50 border-border/30">
          <CardHeader>
            <CardTitle className="text-foreground font-orbitron flex items-center">
              <UserCheck className="w-5 h-5 mr-2 text-primary" />
              Mark Attendance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="player" className="font-rajdhani">Select Player</Label>
              <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Choose a player..." />
                </SelectTrigger>
                <SelectContent>
                  {players.map(player => (
                    <SelectItem key={player.ign} value={player.ign}>
                      {player.ign}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="scrim" className="font-rajdhani">Select Scrim</Label>
              <Select value={selectedScrim} onValueChange={setSelectedScrim}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Choose a scrim..." />
                </SelectTrigger>
                <SelectContent>
                  {scrims.map(scrim => (
                    <SelectItem key={scrim.id} value={scrim.id}>
                      {scrim.name} - {new Date(scrim.date).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date" className="font-rajdhani">Date</Label>
              <Input
                id="date"
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="bg-background/50 border-border/50 font-rajdhani"
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                onClick={() => markAttendance('present')}
                className="flex-1 bg-green-600 hover:bg-green-700 font-rajdhani"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Present
              </Button>
              <Button
                onClick={() => markAttendance('absent')}
                variant="outline"
                className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10 font-rajdhani"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Mark Absent
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Player Attendance Overview */}
        <Card className="bg-card/50 border-border/30">
          <CardHeader>
            <CardTitle className="text-foreground font-orbitron flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Attendance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 font-rajdhani"
              />
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredPlayers.map(player => (
                <div key={player.ign} className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground font-rajdhani">{player.ign}</div>
                      <div className="text-sm text-muted-foreground font-rajdhani">
                        Last seen: {new Date(player.lastSeen).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold font-orbitron ${getAttendanceColor(player.attendance)}`}>
                      {player.attendance}%
                    </div>
                    <div className="text-xs text-muted-foreground font-rajdhani">attendance</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Records */}
      <Card className="bg-card/50 border-border/30">
        <CardHeader>
          <CardTitle className="text-foreground font-orbitron flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-primary" />
            Recent Attendance Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/30">
                <TableHead className="text-muted-foreground font-rajdhani">Player</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Scrim</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Date</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.slice(-10).reverse().map(record => (
                <TableRow key={record.id} className="border-border/30 hover:bg-muted/20">
                  <TableCell className="font-medium text-foreground font-rajdhani">
                    {record.playerIgn}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-rajdhani">
                    {record.scrimName}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-rajdhani">
                    {new Date(record.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status === 'present' ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Present
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Absent
                        </>
                      )}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
