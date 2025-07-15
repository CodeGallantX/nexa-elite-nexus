
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
  XCircle,
  Download,
  CalendarDays
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type AttendanceMode = 'MP' | 'BR' | 'Event';

// Mock data
const mockPlayers = [
  { ign: 'slayerX', attendance: 85, lastSeen: '2024-07-14', status: 'active', kills: 127 },
  { ign: 'TacticalSniper', attendance: 78, lastSeen: '2024-07-13', status: 'active', kills: 98 },
  { ign: 'EliteWarrior', attendance: 65, lastSeen: '2024-07-12', status: 'inactive', kills: 84 },
  { ign: 'GhostAlpha', attendance: 95, lastSeen: '2024-07-14', status: 'active', kills: 156 },
  { ign: 'ProSniper', attendance: 72, lastSeen: '2024-07-11', status: 'active', kills: 112 }
];

const mockAttendanceRecords = [
  { id: '1', playerIgn: 'slayerX', eventName: 'Championship Qualifier', date: '2024-07-15', status: 'present', mode: 'BR' as AttendanceMode },
  { id: '2', playerIgn: 'TacticalSniper', eventName: 'Training Session', date: '2024-07-14', status: 'present', mode: 'MP' as AttendanceMode },
  { id: '3', playerIgn: 'EliteWarrior', eventName: 'Training Session', date: '2024-07-14', status: 'absent', mode: 'MP' as AttendanceMode }
];

export const AdminAttendance: React.FC = () => {
  const { toast } = useToast();
  const [players] = useState(mockPlayers);
  const [attendanceRecords, setAttendanceRecords] = useState(mockAttendanceRecords);
  const [attendanceMode, setAttendanceMode] = useState<AttendanceMode>('MP');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const handleMarkAttendance = (playerIgn: string, status: 'present' | 'absent') => {
    const newRecord = {
      id: Date.now().toString(),
      playerIgn,
      eventName: `${attendanceMode} Session`,
      date: selectedDate,
      status,
      mode: attendanceMode
    };

    setAttendanceRecords(prev => [...prev, newRecord]);

    toast({
      title: "Attendance Marked",
      description: `${playerIgn} marked as ${status} for ${attendanceMode} on ${new Date(selectedDate).toLocaleDateString()}`,
    });
  };

  const setToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const exportData = (format: 'csv' | 'xlsx') => {
    const filteredRecords = attendanceRecords.filter(record => 
      record.playerIgn.toLowerCase().includes(searchTerm.toLowerCase()) &&
      record.mode === attendanceMode
    );

    // Mock export functionality
    toast({
      title: "Export Started",
      description: `Exporting attendance data as ${format.toUpperCase()}...`,
    });
  };

  const scrollToPlayer = (playerIgn: string) => {
    const element = document.getElementById(`player-${playerIgn}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('bg-primary/20');
      setTimeout(() => {
        element.classList.remove('bg-primary/20');
      }, 2000);
    }
  };

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.ign.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || player.status === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredRecords = attendanceRecords.filter(record =>
    record.playerIgn.toLowerCase().includes(searchTerm.toLowerCase()) &&
    record.mode === attendanceMode
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

      {/* Attendance Mode Toggle */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Label className="font-rajdhani text-sm font-medium">Attendance Mode:</Label>
            <div className="flex rounded-lg bg-background/50 p-1">
              {(['MP', 'BR', 'Event'] as AttendanceMode[]).map((mode) => (
                <Button
                  key={mode}
                  variant={attendanceMode === mode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setAttendanceMode(mode)}
                  className={`font-rajdhani ${
                    attendanceMode === mode 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  {mode} Attendance
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date Selection & Filters */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Label className="font-rajdhani">Date:</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-background/50 border-border/50 font-rajdhani"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={setToday}
                className="font-rajdhani"
              >
                Today
              </Button>
            </div>
            
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 font-rajdhani"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40 bg-background/50 border-border/50">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Players</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportData('csv')}
                className="font-rajdhani"
              >
                <Download className="w-4 h-4 mr-1" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportData('xlsx')}
                className="font-rajdhani"
              >
                <Download className="w-4 h-4 mr-1" />
                Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Players Attendance Table */}
      <Card className="bg-card/50 border-border/30">
        <CardHeader>
          <CardTitle className="text-foreground font-orbitron flex items-center">
            <UserCheck className="w-5 h-5 mr-2 text-primary" />
            {attendanceMode} Attendance - {new Date(selectedDate).toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-card/90 backdrop-blur-sm">
                <TableRow className="border-border/30">
                  <TableHead className="text-muted-foreground font-rajdhani">Username</TableHead>
                  <TableHead className="text-muted-foreground font-rajdhani">Kills</TableHead>
                  <TableHead className="text-muted-foreground font-rajdhani">Present</TableHead>
                  <TableHead className="text-muted-foreground font-rajdhani">Absent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers.map(player => (
                  <TableRow 
                    key={player.ign} 
                    id={`player-${player.ign}`}
                    className="border-border/30 hover:bg-muted/20 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground font-rajdhani">{player.ign}</div>
                          <div className="text-sm text-muted-foreground font-rajdhani">
                            {player.attendance}% attendance
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-lg font-bold text-primary font-orbitron">
                        {player.kills}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => handleMarkAttendance(player.ign, 'present')}
                        className="bg-green-600 hover:bg-green-700 text-white font-rajdhani"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Present
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAttendance(player.ign, 'absent')}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10 font-rajdhani"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Absent
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Attendance Records */}
      <Card className="bg-card/50 border-border/30">
        <CardHeader>
          <CardTitle className="text-foreground font-orbitron flex items-center">
            <CalendarDays className="w-5 h-5 mr-2 text-primary" />
            Recent {attendanceMode} Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/30">
                <TableHead className="text-muted-foreground font-rajdhani">Player</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Event</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Date</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.slice(-10).reverse().map(record => (
                <TableRow key={record.id} className="border-border/30 hover:bg-muted/20">
                  <TableCell 
                    className="font-medium text-foreground font-rajdhani cursor-pointer hover:text-primary"
                    onClick={() => scrollToPlayer(record.playerIgn)}
                  >
                    {record.playerIgn}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-rajdhani">
                    {record.eventName}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-rajdhani">
                    {new Date(record.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={record.status === 'present' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/50'
                      : 'bg-red-500/20 text-red-400 border-red-500/50'
                    }>
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
