
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  UserPlus, 
  Settings, 
  BarChart3, 
  Megaphone, 
  Shield,
  TrendingUp,
  Activity,
  Clock,
  AlertTriangle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Command Center
          </h1>
          <p className="text-gray-400">
            Welcome, <span className="text-[#FF1F44] font-medium">{user?.username}</span> - Clan Administrator
          </p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-[#FF1F44]/10 border border-[#FF1F44]/30 rounded-lg">
          <Shield className="w-5 h-5 text-[#FF1F44]" />
          <span className="text-white font-medium">Admin Access</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Members</CardTitle>
            <Users className="h-4 w-4 text-[#FF1F44]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">247</div>
            <p className="text-xs text-gray-400">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-400" />
              +12 this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Players</CardTitle>
            <Activity className="h-4 w-4 text-[#FF1F44]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">189</div>
            <p className="text-xs text-gray-400">76% of total members</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Avg. Attendance</CardTitle>
            <BarChart3 className="h-4 w-4 text-[#FF1F44]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">87%</div>
            <p className="text-xs text-gray-400">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-400" />
              +5% this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Pending Actions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">7</div>
            <p className="text-xs text-gray-400">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button className="p-6 h-auto bg-gradient-to-br from-[#FF1F44]/20 to-red-600/10 hover:from-[#FF1F44]/30 hover:to-red-600/20 border border-[#FF1F44]/30 text-white">
          <div className="flex flex-col items-center space-y-2">
            <UserPlus className="w-8 h-8 text-[#FF1F44]" />
            <span className="font-medium">Add Member</span>
            <span className="text-xs text-gray-400">Recruit new players</span>
          </div>
        </Button>

        <Button className="p-6 h-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white">
          <div className="flex flex-col items-center space-y-2">
            <BarChart3 className="w-8 h-8 text-[#FF1F44]" />
            <span className="font-medium">Update Stats</span>
            <span className="text-xs text-gray-400">Modify player data</span>
          </div>
        </Button>

        <Button className="p-6 h-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white">
          <div className="flex flex-col items-center space-y-2">
            <Megaphone className="w-8 h-8 text-[#FF1F44]" />
            <span className="font-medium">Announcement</span>
            <span className="text-xs text-gray-400">Broadcast message</span>
          </div>
        </Button>

        <Button className="p-6 h-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white">
          <div className="flex flex-col items-center space-y-2">
            <Settings className="w-8 h-8 text-[#FF1F44]" />
            <span className="font-medium">Clan Settings</span>
            <span className="text-xs text-gray-400">Configure options</span>
          </div>
        </Button>
      </div>

      {/* Recent Activity & Member Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Admin Activity */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="w-5 h-5 mr-2 text-[#FF1F44]" />
              Recent Admin Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Approved new member: TacticalSniper</p>
                  <p className="text-gray-400 text-xs">15 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Updated tournament schedule</p>
                  <p className="text-gray-400 text-xs">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-[#FF1F44] rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Posted clan announcement</p>
                  <p className="text-gray-400 text-xs">1 day ago</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Modified player grades (3 members)</p>
                  <p className="text-gray-400 text-xs">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-[#FF1F44]" />
              Top Performers This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'EliteSniper99', grade: 'S', kills: 1250, change: '+15%' },
                { name: 'TacticalGhost', grade: 'S', kills: 1180, change: '+12%' },
                { name: 'StealthMaster', grade: 'A', kills: 980, change: '+8%' },
                { name: 'CombatPro', grade: 'A', kills: 890, change: '+5%' }
              ].map((player, index) => (
                <div key={player.name} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-[#FF1F44]/20 rounded-full">
                    <span className="text-[#FF1F44] font-bold text-sm">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{player.name}</p>
                    <p className="text-gray-400 text-xs">{player.kills} kills this week</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${
                      player.grade === 'S' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {player.grade}
                    </div>
                    <div className="text-xs text-green-400">{player.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-600/5 border-green-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-400" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">99.9%</div>
              <div className="text-sm text-gray-300">Server Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">42ms</div>
              <div className="text-sm text-gray-300">Average Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">All Good</div>
              <div className="text-sm text-gray-300">System Health</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
