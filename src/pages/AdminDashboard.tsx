
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  Users, 
  Calendar, 
  Target, 
  Trophy, 
  TrendingUp,
  AlertTriangle,
  Clock,
  MessageSquare,
  Package,
  BarChart3
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();

  // Fetch total players
  const { data: totalPlayers = 0 } = useQuery({
    queryKey: ['admin-total-players'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'player');

      if (error) {
        console.error('Error fetching total players:', error);
        return 0;
      }
      return count || 0;
    },
  });

  // Fetch total events/scrims
  const { data: totalEvents = 0 } = useQuery({
    queryKey: ['admin-total-events'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching total events:', error);
        return 0;
      }
      return count || 0;
    },
  });

  // Fetch recent announcements count
  const { data: totalAnnouncements = 0 } = useQuery({
    queryKey: ['admin-total-announcements'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('announcements')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      if (error) {
        console.error('Error fetching total announcements:', error);
        return 0;
      }
      return count || 0;
    },
  });

  // Fetch chat messages count
  const { data: totalChatMessages = 0 } = useQuery({
    queryKey: ['admin-total-chat-messages'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching total chat messages:', error);
        return 0;
      }
      return count || 0;
    },
  });

  // Fetch attendance stats
  const { data: attendanceStats } = useQuery({
    queryKey: ['admin-attendance-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select('status');

      if (error) {
        console.error('Error fetching attendance stats:', error);
        return { present: 0, absent: 0, total: 0 };
      }

      const present = data.filter(a => a.status === 'present').length;
      const absent = data.filter(a => a.status === 'absent').length;
      const total = data.length;

      return { present, absent, total };
    },
  });

  // Fetch recent players
  const { data: recentPlayers = [] } = useQuery({
    queryKey: ['admin-recent-players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, ign, created_at, kills, attendance')
        .eq('role', 'player')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent players:', error);
        return [];
      }
      return data || [];
    },
  });

  // Fetch top performers
  const { data: topPerformers = [] } = useQuery({
    queryKey: ['admin-top-performers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('ign, kills, attendance')
        .eq('role', 'player')
        .order('kills', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching top performers:', error);
        return [];
      }
      return data || [];
    },
  });

  const attendancePercentage = attendanceStats ? 
    Math.round((attendanceStats.present / Math.max(attendanceStats.total, 1)) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Manage your clan and monitor performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm font-medium">ADMIN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Players</CardTitle>
            <Users className="h-4 w-4 text-[#FF1F44]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalPlayers}</div>
            <p className="text-xs text-gray-400">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              Active members
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Events Created</CardTitle>
            <Calendar className="h-4 w-4 text-[#FF1F44]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalEvents}</div>
            <p className="text-xs text-gray-400">Total scrims & events</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Attendance Rate</CardTitle>
            <Target className="h-4 w-4 text-[#FF1F44]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{attendancePercentage}%</div>
            <Progress value={attendancePercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Announcements</CardTitle>
            <MessageSquare className="h-4 w-4 text-[#FF1F44]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalAnnouncements}</div>
            <p className="text-xs text-gray-400">Published posts</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Players */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-[#FF1F44]" />
              Recent Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPlayers.length > 0 ? recentPlayers.map((player, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 bg-[#FF1F44]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#FF1F44] text-sm font-medium">
                      {player.ign.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{player.ign}</p>
                    <p className="text-gray-400 text-xs">@{player.username}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm">{player.kills || 0} kills</p>
                    <p className="text-gray-400 text-xs">{player.attendance || 0}% attendance</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4 text-muted-foreground">
                  No recent players
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-[#FF1F44]" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.length > 0 ? topPerformers.map((player, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <span className="text-yellow-400 text-sm font-bold">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{player.ign}</p>
                    <p className="text-gray-400 text-xs">{player.attendance || 0}% attendance</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 text-sm font-bold">{player.kills || 0}</p>
                    <p className="text-gray-400 text-xs">kills</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4 text-muted-foreground">
                  No performance data
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Button 
          onClick={() => window.location.href = '/admin/players'}
          className="p-4 h-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white flex flex-col items-center space-y-2"
        >
          <Users className="w-6 h-6 text-[#FF1F44]" />
          <span className="text-sm">Manage Players</span>
        </Button>

        <Button 
          onClick={() => window.location.href = '/admin/scrims'}
          className="p-4 h-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white flex flex-col items-center space-y-2"
        >
          <Calendar className="w-6 h-6 text-[#FF1F44]" />
          <span className="text-sm">Create Event</span>
        </Button>

        <Button 
          onClick={() => window.location.href = '/admin/announcements'}
          className="p-4 h-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white flex flex-col items-center space-y-2"
        >
          <MessageSquare className="w-6 h-6 text-[#FF1F44]" />
          <span className="text-sm">Post Announcement</span>
        </Button>

        <Button 
          onClick={() => window.location.href = '/admin/attendance'}
          className="p-4 h-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white flex flex-col items-center space-y-2"
        >
          <Clock className="w-6 h-6 text-[#FF1F44]" />
          <span className="text-sm">Mark Attendance</span>
        </Button>

        <Button 
          onClick={() => window.location.href = '/admin/stats'}
          className="p-4 h-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white flex flex-col items-center space-y-2"
        >
          <BarChart3 className="w-6 h-6 text-[#FF1F44]" />
          <span className="text-sm">View Statistics</span>
        </Button>

        <Button 
          onClick={() => window.location.href = '/admin/loadouts'}
          className="p-4 h-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white flex flex-col items-center space-y-2"
        >
          <Package className="w-6 h-6 text-[#FF1F44]" />
          <span className="text-sm">Manage Loadouts</span>
        </Button>
      </div>

      {/* System Status */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/5 border-green-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-green-400" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-green-400 text-lg font-bold">Online</div>
              <div className="text-sm text-gray-400">Database</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 text-lg font-bold">{totalChatMessages}</div>
              <div className="text-sm text-gray-400">Chat Messages</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 text-lg font-bold">Active</div>
              <div className="text-sm text-gray-400">Real-time Updates</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
