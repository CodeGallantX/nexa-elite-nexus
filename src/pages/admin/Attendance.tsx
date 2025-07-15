
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type AttendanceMode = 'MP' | 'BR' | 'Mixed';

interface Player {
  id: string;
  username: string;
  ign: string;
  kills: number;
  attendance: number;
}

interface Event {
  id: string;
  name: string;
  type: string;
  date: string;
}

interface AttendanceRecord {
  id: string;
  player_id: string;
  event_id: string;
  status: 'present' | 'absent';
  attendance_type: AttendanceMode;
  date: string;
  profiles: {
    username: string;
    ign: string;
  };
  events: {
    name: string;
    type: string;
  };
}

export const AdminAttendance: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [attendanceMode, setAttendanceMode] = useState<AttendanceMode>('MP');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all players
  const { data: players = [] } = useQuery({
    queryKey: ['admin-attendance-players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, ign, kills, attendance')
        .eq('role', 'player')
        .order('username');

      if (error) {
        console.error('Error fetching players:', error);
        throw error;
      }
      return data as Player[];
    },
  });

  // Fetch all events
  const { data: events = [] } = useQuery({
    queryKey: ['admin-attendance-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id, name, type, date')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }
      return data as Event[];
    },
  });

  // Fetch attendance records
  const { data: attendanceRecords = [] } = useQuery({
    queryKey: ['admin-attendance-records', selectedDate, attendanceMode],
    queryFn: async () => {
      let query = supabase
        .from('attendance')
        .select(`
          *,
          profiles!attendance_player_id_fkey (username, ign),
          events (name, type)
        `)
        .eq('date', selectedDate);

      // Only filter by attendance_type if it's not "Mixed" (Event mode)
      if (attendanceMode !== 'Mixed') {
        query = query.eq('attendance_type', attendanceMode);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching attendance records:', error);
        throw error;
      }
      return (data || []) as AttendanceRecord[];
    },
  });

  // Mark attendance mutation
  const markAttendanceMutation = useMutation({
    mutationFn: async ({ 
      playerId, 
      status, 
      eventId 
    }: { 
      playerId: string; 
      status: 'present' | 'absent';
      eventId?: string;
    }) => {
      const attendanceData = {
        player_id: playerId,
        status,
        attendance_type: attendanceMode === 'Mixed' ? 'Mixed' : attendanceMode,
        date: selectedDate,
        event_id: eventId || null
      };

      // Check if attendance already exists for this player/date/event
      let existingQuery = supabase
        .from('attendance')
        .select('id')
        .eq('player_id', playerId)
        .eq('date', selectedDate)
        .eq('attendance_type', attendanceData.attendance_type);

      if (eventId) {
        existingQuery = existingQuery.eq('event_id', eventId);
      } else {
        existingQuery = existingQuery.is('event_id', null);
      }

      const { data: existing } = await existingQuery.single();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('attendance')
          .update({ status })
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('attendance')
          .insert([attendanceData]);
        
        if (error) throw error;
      }
    },
    onSuccess: (_, { playerId, status }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-attendance-records'] });
      queryClient.invalidateQueries({ queryKey: ['admin-attendance-players'] });
      
      const player = players.find(p => p.id === playerId);
      toast({
        title: "Attendance Marked",
        description: `${player?.ign || 'Player'} marked as ${status} for ${attendanceMode} on ${new Date(selectedDate).toLocaleDateString()}`,
      });
    },
    onError: (error) => {
      console.error('Error marking attendance:', error);
      toast({
        title: "Error",
        description: "Failed to mark attendance. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleMarkAttendance = (playerId: string, status: 'present' | 'absent') => {
    markAttendanceMutation.mutate({ 
      playerId, 
      status, 
      eventId: selectedEventId || undefined 
    });
  };

  const getPlayerAttendanceStatus = (playerId: string) => {
    const record = attendanceRecords.find(r => r.player_id === playerId);
    return record?.status || null;
  };

  const setToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const exportData = (format: 'csv' | 'xlsx') => {
    const csvData = attendanceRecords.map(record => ({
      Player: record.profiles?.ign || 'Unknown',
      Event: record.events?.name || 'N/A',
      Status: record.status,
      Date: record.date,
      Type: record.attendance_type
    }));

    const csvContent = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance_${selectedDate}_${attendanceMode}.csv`;
    link.click();

    toast({
      title: "Export Complete",
      description: `Attendance data exported as ${format.toUpperCase()}`,
    });
  };

  const filteredPlayers = players.filter(player =>
    player.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.ign.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
  const totalMarked = presentCount + absentCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-orbitron mb-2">Attendance Management</h1>
          <p className="text-gray-400">Mark and track player attendance for events</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => exportData('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{presentCount}</div>
            <div className="text-sm text-gray-400 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Present
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">{absentCount}</div>
            <div className="text-sm text-gray-400 flex items-center justify-center">
              <XCircle className="w-4 h-4 mr-1" />
              Absent
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{totalMarked}</div>
            <div className="text-sm text-gray-400 flex items-center justify-center">
              <Users className="w-4 h-4 mr-1" />
              Total Marked
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Attendance Rate
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-gray-300 mb-2 block">Attendance Type</Label>
              <Select value={attendanceMode} onValueChange={(value: AttendanceMode) => setAttendanceMode(value)}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MP">Multiplayer</SelectItem>
                  <SelectItem value="BR">Battle Royale</SelectItem>
                  <SelectItem value="Mixed">Event/Scrim</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-gray-300 mb-2 block">Date</Label>
              <div className="flex space-x-2">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-background/50 border-border/50 text-foreground"
                />
                <Button onClick={setToday} variant="outline" size="sm">
                  <CalendarDays className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {attendanceMode === 'Mixed' && (
              <div>
                <Label className="text-gray-300 mb-2 block">Event</Label>
                <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Events</SelectItem>
                    {events.map(event => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name} ({event.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label className="text-gray-300 mb-2 block">Search Players</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50 text-foreground"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white font-orbitron flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-primary" />
            Mark Attendance - {new Date(selectedDate).toLocaleDateString()} ({attendanceMode})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-gray-300">Player</TableHead>
                <TableHead className="text-gray-300">IGN</TableHead>
                <TableHead className="text-gray-300">Kills</TableHead>
                <TableHead className="text-gray-300">Overall Attendance</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.map(player => {
                const currentStatus = getPlayerAttendanceStatus(player.id);
                
                return (
                  <TableRow key={player.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-white font-medium">{player.username}</TableCell>
                    <TableCell className="text-gray-300">{player.ign}</TableCell>
                    <TableCell className="text-white font-mono">{(player.kills || 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="text-white mr-2">{player.attendance || 0}%</span>
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${Math.min(player.attendance || 0, 100)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {currentStatus ? (
                        <Badge className={currentStatus === 'present' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/50'
                          : 'bg-red-500/20 text-red-400 border-red-500/50'
                        }>
                          {currentStatus === 'present' ? 'Present' : 'Absent'}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-gray-500/50 text-gray-400">
                          Not Marked
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleMarkAttendance(player.id, 'present')}
                          disabled={markAttendanceMutation.isPending}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleMarkAttendance(player.id, 'absent')}
                          disabled={markAttendanceMutation.isPending}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredPlayers.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No players found matching your search criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
