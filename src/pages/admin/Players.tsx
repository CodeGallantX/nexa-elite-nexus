
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  Filter,
  MoreHorizontal,
  Crown
} from 'lucide-react';

// Mock player data
const mockPlayers = [
  {
    id: '1',
    username: 'slayerX',
    ign: 'slayerX',
    email: 'slayer@nexa.gg',
    role: 'player',
    grade: 'S',
    tier: 'Elite Slayer',
    kills: 15420,
    attendance: 85,
    device: 'Phone',
    dateJoined: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    username: 'ghost_alpha',
    ign: 'GhostAlpha',
    email: 'admin@nexa.gg',
    role: 'admin',
    grade: 'S',
    tier: 'Clan Commander',
    kills: 28750,
    attendance: 95,
    device: 'iPad',
    dateJoined: '2023-08-10',
    status: 'active'
  },
  {
    id: '3',
    username: 'tactical_sniper',
    ign: 'TacticalSniper',
    email: 'sniper@nexa.gg',
    role: 'player',
    grade: 'A',
    tier: 'Veteran',
    kills: 12890,
    attendance: 78,
    device: 'Phone',
    dateJoined: '2024-02-20',
    status: 'active'
  },
  {
    id: '4',
    username: 'elite_warrior',
    ign: 'EliteWarrior',
    email: 'warrior@nexa.gg',
    role: 'player',
    grade: 'B',
    tier: 'Soldier',
    kills: 8950,
    attendance: 65,
    device: 'iPad',
    dateJoined: '2024-03-05',
    status: 'inactive'
  }
];

export const AdminPlayers: React.FC = () => {
  const [players, setPlayers] = useState(mockPlayers);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const getGradeColor = (grade: string) => {
    const colors = {
      'S': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      'A': 'bg-green-500/20 text-green-400 border-green-500/50',
      'B': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      'C': 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      'D': 'bg-red-500/20 text-red-400 border-red-500/50'
    };
    return colors[grade as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  };

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.ign.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'all' || player.grade === gradeFilter;
    const matchesRole = roleFilter === 'all' || player.role === roleFilter;
    
    return matchesSearch && matchesGrade && matchesRole;
  });

  const handlePromoteUser = (playerId: string) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId 
        ? { ...player, role: player.role === 'player' ? 'admin' : 'player' }
        : player
    ));
  };

  const handleDeleteUser = (playerId: string) => {
    setPlayers(prev => prev.filter(player => player.id !== playerId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-orbitron mb-2">Player Management</h1>
          <p className="text-gray-400">Manage clan members and their permissions</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Player
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{players.length}</div>
            <div className="text-sm text-gray-400">Total Players</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {players.filter(p => p.status === 'active').length}
            </div>
            <div className="text-sm text-gray-400">Active</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {players.filter(p => p.role === 'admin').length}
            </div>
            <div className="text-sm text-gray-400">Admins</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {players.filter(p => p.grade === 'S').length}
            </div>
            <div className="text-sm text-gray-400">S-Grade</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by username, IGN, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 text-foreground"
              />
            </div>
            
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-40 bg-background/50 border-border/50">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="S">S Grade</SelectItem>
                <SelectItem value="A">A Grade</SelectItem>
                <SelectItem value="B">B Grade</SelectItem>
                <SelectItem value="C">C Grade</SelectItem>
                <SelectItem value="D">D Grade</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40 bg-background/50 border-border/50">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="player">Players</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Players Table */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white font-orbitron">Player Roster</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-gray-300">Player</TableHead>
                <TableHead className="text-gray-300">Role</TableHead>
                <TableHead className="text-gray-300">Grade</TableHead>
                <TableHead className="text-gray-300">Tier</TableHead>
                <TableHead className="text-gray-300">Kills</TableHead>
                <TableHead className="text-gray-300">Attendance</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.map(player => (
                <TableRow key={player.id} className="border-white/10 hover:bg-white/5">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src="/placeholder.svg"
                        alt={player.username}
                        className="w-8 h-8 rounded-full border border-primary/30"
                      />
                      <div>
                        <div className="text-white font-medium">{player.username}</div>
                        <div className="text-gray-400 text-sm">{player.ign}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {player.role === 'admin' ? (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          <Crown className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-white/30 text-gray-300">
                          Player
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getGradeColor(player.grade)}>
                      {player.grade}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{player.tier}</TableCell>
                  <TableCell className="text-white font-mono">{player.kills.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-white mr-2">{player.attendance}%</span>
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${player.attendance}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={player.status === 'active' ? 'default' : 'secondary'}
                      className={player.status === 'active' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
                      }
                    >
                      {player.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handlePromoteUser(player.id)}
                        className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                      >
                        <Shield className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDeleteUser(player.id)}
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
    </div>
  );
};
