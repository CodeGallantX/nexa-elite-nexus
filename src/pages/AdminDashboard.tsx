
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Target, TrendingUp, Trophy, Gamepad2 } from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdminStats';

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-white">Loading dashboard stats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-red-400">Error loading dashboard stats</div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Players",
      value: stats?.total_players || 0,
      description: "Active clan members",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Total Events",
      value: stats?.total_events || 0,
      description: "Scrims & tournaments",
      icon: Calendar,
      color: "text-green-400"
    },
    {
      title: "Total Kills",
      value: stats?.total_kills || 0,
      description: "Across all events",
      icon: Target,
      color: "text-red-400"
    },
    {
      title: "Avg Attendance",
      value: `${Math.round(stats?.avg_attendance || 0)}%`,
      description: "Player participation",
      icon: TrendingUp,
      color: "text-yellow-400"
    },
    {
      title: "Weapon Layouts",
      value: stats?.total_loadouts || 0,
      description: "Shared loadouts",
      icon: Gamepad2,
      color: "text-purple-400"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="sticky top-14 z-30 bg-background/60 backdrop-blur-sm py-4 border-b border-border px-0">
        <div className="px-0">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Overview of NeXa Esports clan management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                {stat.title === 'Total Kills' ? (
                  <p className="text-xs text-gray-400">
                    <span className="text-blue-400">BR: {stats?.total_br_kills || 0}</span> • <span className="text-green-400">MP: {stats?.total_mp_kills || 0}</span>
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">{stat.description}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-gray-400">
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => window.location.href = '/admin/events'} 
                className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors"
              >
                Create Event
              </Button>
              <Button 
                onClick={() => window.location.href = '/admin/attendance'} 
                className="p-3 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-medium transition-colors"
              >
                Mark Attendance
              </Button>
              <Button 
                onClick={() => window.location.href = '/admin/announcements'} 
                className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm font-medium transition-colors"
              >
                Send Announcement
              </Button>
              <Button 
                onClick={() => window.location.href = '/admin/stats'} 
                className="p-3 bg-orange-600 hover:bg-orange-700 rounded-lg text-white text-sm font-medium transition-colors"
              >
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-gray-400">
              Latest clan activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300 text-sm">System online and operational</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300 text-sm">Players actively participating</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-300 text-sm">Events scheduled and running</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
