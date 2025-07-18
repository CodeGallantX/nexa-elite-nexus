
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePlayerStats } from '@/hooks/usePlayerStats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Target, TrendingUp, Users } from 'lucide-react';

export const AdminStats: React.FC = () => {
  const { data: playerStats, isLoading } = usePlayerStats();
  const [sortBy, setSortBy] = useState('totalEventKills');

  const sortedStats = playerStats?.sort((a, b) => {
    switch (sortBy) {
      case 'totalEventKills':
        return (b.totalEventKills || 0) - (a.totalEventKills || 0);
      case 'avgKillsPerEvent':
        return (b.avgKillsPerEvent || 0) - (a.avgKillsPerEvent || 0);
      case 'eventsParticipated':
        return (b.eventsParticipated || 0) - (a.eventsParticipated || 0);
      case 'attendance':
        return (b.attendance || 0) - (a.attendance || 0);
      default:
        return 0;
    }
  }) || [];

  const chartData = sortedStats.slice(0, 10).map(player => ({
    name: player.ign,
    kills: player.totalEventKills || 0,
    avgKills: player.avgKillsPerEvent || 0,
    events: player.eventsParticipated || 0
  }));

  const tierDistribution = playerStats?.reduce((acc, player) => {
    const tier = player.tier || 'Rookie';
    acc[tier] = (acc[tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const pieData = Object.entries(tierDistribution).map(([tier, count]) => ({
    name: tier,
    value: count
  }));

  const COLORS = ['#FF1F44', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const totalKills = playerStats?.reduce((sum, player) => sum + (player.totalEventKills || 0), 0) || 0;
  const totalEvents = playerStats?.reduce((sum, player) => sum + (player.eventsParticipated || 0), 0) || 0;
  const activePlayerCount = playerStats?.filter(p => (p.eventsParticipated || 0) > 0).length || 0;
  const avgAttendance = playerStats?.reduce((sum, player) => sum + (player.attendance || 0), 0) / (playerStats?.length || 1) || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-white">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Player Statistics</h1>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Kills</CardTitle>
            <Target className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalKills}</div>
            <p className="text-xs text-gray-400">Across all events</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Players</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activePlayerCount}</div>
            <p className="text-xs text-gray-400">With event participation</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Avg Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{Math.round(avgAttendance)}%</div>
            <p className="text-xs text-gray-400">Player participation rate</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Participations</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalEvents}</div>
            <p className="text-xs text-gray-400">Event participations</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Top 10 Players - Kill Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="kills" fill="#FF1F44" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Player Tier Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats Table */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Detailed Player Statistics</CardTitle>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="totalEventKills">Total Kills</SelectItem>
                <SelectItem value="avgKillsPerEvent">Avg Kills/Event</SelectItem>
                <SelectItem value="eventsParticipated">Events Participated</SelectItem>
                <SelectItem value="attendance">Attendance %</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Rank</TableHead>
                <TableHead className="text-gray-300">Player</TableHead>
                <TableHead className="text-gray-300">Tier</TableHead>
                <TableHead className="text-gray-300">Total Kills</TableHead>
                <TableHead className="text-gray-300">Avg Kills/Event</TableHead>
                <TableHead className="text-gray-300">Events</TableHead>
                <TableHead className="text-gray-300">Attendance</TableHead>
                <TableHead className="text-gray-300">Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStats.map((player, index) => (
                <TableRow key={player.id} className="border-gray-700">
                  <TableCell className="text-white font-medium">#{index + 1}</TableCell>
                  <TableCell className="text-white">
                    <div>
                      <div className="font-medium">Ɲ・乂{player.ign}</div>
                      <div className="text-sm text-gray-400">@{player.username}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      player.tier === 'Elite' ? 'bg-purple-100 text-purple-800' :
                      player.tier === 'Veteran' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {player.tier || 'Rookie'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white font-medium">{player.totalEventKills || 0}</TableCell>
                  <TableCell className="text-white">{player.avgKillsPerEvent || 0}</TableCell>
                  <TableCell className="text-white">{player.eventsParticipated || 0}</TableCell>
                  <TableCell className="text-white">{player.attendance || 0}%</TableCell>
                  <TableCell>
                    <Badge className={
                      player.grade === 'A' ? 'bg-green-100 text-green-800' :
                      player.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                      player.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {player.grade || 'D'}
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
