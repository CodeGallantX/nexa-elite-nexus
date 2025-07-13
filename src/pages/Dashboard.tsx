
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Target, 
  Calendar, 
  TrendingUp, 
  Award, 
  Zap,
  Users,
  Clock
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getGradeColor = (grade: string) => {
    const colors = {
      'S': 'text-yellow-400',
      'A': 'text-green-400',
      'B': 'text-blue-400',
      'C': 'text-orange-400',
      'D': 'text-red-400'
    };
    return colors[grade as keyof typeof colors] || 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="text-[#FF1F44]">{user?.username}</span>
          </h1>
          <p className="text-gray-400">Your tactical command center awaits</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`px-4 py-2 rounded-lg bg-black/30 border ${getGradeColor(user?.profile?.grade || 'D')} border-current/30`}>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getGradeColor(user?.profile?.grade || 'D')}`}>
                {user?.profile?.grade}
              </div>
              <div className="text-xs text-gray-400">GRADE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Kills</CardTitle>
            <Target className="h-4 w-4 text-[#FF1F44]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{user?.profile?.kills?.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-[#FF1F44]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{user?.profile?.attendance}%</div>
            <Progress value={user?.profile?.attendance || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Clan Rank</CardTitle>
            <Trophy className="h-4 w-4 text-[#FF1F44]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">#7</div>
            <p className="text-xs text-gray-400">out of 250 members</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Tier Status</CardTitle>
            <Award className="h-4 w-4 text-[#FF1F44]" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-white">{user?.profile?.tier}</div>
            <p className="text-xs text-gray-400">Since {user?.profile?.dateJoined}</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-[#FF1F44]" />
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-16 text-sm text-gray-400">{day.slice(0, 3)}</div>
                  <div className="flex-1">
                    <Progress value={Math.random() * 100} className="h-2" />
                  </div>
                  <div className="w-12 text-sm text-white text-right">
                    {Math.floor(Math.random() * 50 + 50)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="w-5 h-5 mr-2 text-[#FF1F44]" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Completed Battle Royale match</p>
                  <p className="text-gray-400 text-xs">2 hours ago</p>
                </div>
                <div className="text-green-400 text-sm font-medium">+250 XP</div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Participated in clan war</p>
                  <p className="text-gray-400 text-xs">1 day ago</p>
                </div>
                <div className="text-blue-400 text-sm font-medium">+500 XP</div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-[#FF1F44] rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Achieved new kill record</p>
                  <p className="text-gray-400 text-xs">3 days ago</p>
                </div>
                <div className="text-[#FF1F44] text-sm font-medium">Achievement</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Announcement */}
      <Card className="bg-gradient-to-r from-[#FF1F44]/10 to-red-600/5 border-[#FF1F44]/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="w-5 h-5 mr-2 text-[#FF1F44]" />
            Featured Announcement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">🏆 Championship Tournament Starting Soon!</h3>
            <p className="text-gray-300">
              Get ready for the ultimate battle! Our clan championship tournament begins this weekend. 
              Top 10 players will receive exclusive rewards and recognition.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>📅 This Weekend</span>
                <span>⏰ 8:00 PM EST</span>
                <span>🎯 Battle Royale Mode</span>
              </div>
              <Button className="bg-[#FF1F44] hover:bg-red-600 text-white">
                Register Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="p-6 h-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white">
          <div className="flex flex-col items-center space-y-2">
            <Users className="w-8 h-8 text-[#FF1F44]" />
            <span className="font-medium">Find Teammates</span>
            <span className="text-xs text-gray-400">Join active squads</span>
          </div>
        </Button>

        <Button className="p-6 h-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white">
          <div className="flex flex-col items-center space-y-2">
            <Target className="w-8 h-8 text-[#FF1F44]" />
            <span className="font-medium">Practice Range</span>
            <span className="text-xs text-gray-400">Improve your skills</span>
          </div>
        </Button>

        <Button className="p-6 h-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white">
          <div className="flex flex-col items-center space-y-2">
            <Trophy className="w-8 h-8 text-[#FF1F44]" />
            <span className="font-medium">Leaderboard</span>
            <span className="text-xs text-gray-400">View rankings</span>
          </div>
        </Button>
      </div>
    </div>
  );
};
