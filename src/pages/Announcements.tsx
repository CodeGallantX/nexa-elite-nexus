
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Megaphone, 
  Plus, 
  Calendar, 
  Trophy, 
  Target, 
  Users,
  AlertCircle,
  Pin
} from 'lucide-react';

// Mock announcements
const mockAnnouncements = [
  {
    id: '1',
    title: '🏆 Championship Tournament Registration Open!',
    content: 'The ultimate NeXa_Esports championship tournament is here! Register now to secure your spot in the most competitive event of the year. Top 10 players will receive exclusive rewards, recognition, and prizes worth over $500.',
    author: 'GhostAlpha',
    date: '2024-01-10',
    priority: 'high',
    pinned: true,
    category: 'tournament'
  },
  {
    id: '2',
    title: '📅 Weekly Strategy Meeting - Tomorrow 8PM EST',
    content: 'All elite members are invited to our weekly strategy meeting. We\'ll be discussing new tactics for Battle Royale, reviewing recent clan wars, and planning upcoming tournaments. Discord link will be shared 30 minutes before.',
    author: 'TacticalLeader',
    date: '2024-01-09',
    priority: 'medium',
    pinned: false,
    category: 'meeting'
  },
  {
    id: '3',
    title: '🔥 New Clan War Schedule Released',
    content: 'Check out our updated clan war schedule! We\'ve added more time slots to accommodate members from different time zones. Remember to maintain at least 80% attendance to keep your elite status.',
    author: 'GhostAlpha',
    date: '2024-01-08',
    priority: 'medium',
    pinned: false,
    category: 'schedule'
  },
  {
    id: '4',
    title: '⚡ Server Maintenance - January 12th',
    content: 'Our servers will undergo maintenance on January 12th from 2:00 AM to 4:00 AM EST. During this time, the website and some features might be temporarily unavailable. We apologize for any inconvenience.',
    author: 'SystemAdmin',
    date: '2024-01-07',
    priority: 'low',
    pinned: false,
    category: 'maintenance'
  },
  {
    id: '5',
    title: '🎉 Welcome New Elite Members!',
    content: 'Please join us in welcoming our newest elite members: TacticalSniper, CombatPro, and StealthMaster. They\'ve shown incredible skill and dedication. Let\'s help them settle into our tactical brotherhood!',
    author: 'GhostAlpha',
    date: '2024-01-06',
    priority: 'low',
    pinned: false,
    category: 'welcome'
  }
];

export const Announcements: React.FC = () => {
  const { user } = useAuth();

  const getPriorityColor = (priority: string) => {
    const colors = {
      'high': 'bg-red-500/20 border-red-500/50 text-red-300',
      'medium': 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
      'low': 'bg-gray-500/20 border-gray-500/50 text-gray-300'
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'tournament': Trophy,
      'meeting': Users,
      'schedule': Calendar,
      'maintenance': AlertCircle,
      'welcome': Target
    };
    return icons[category as keyof typeof icons] || Megaphone;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Clan Announcements</h1>
          <p className="text-gray-400">Stay updated with the latest NeXa_Esports news</p>
        </div>
        
        {user?.role === 'admin' && (
          <Button className="bg-[#FF1F44] hover:bg-red-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        )}
      </div>

      {/* Filter/Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[#FF1F44] mb-1">5</div>
            <div className="text-sm text-gray-400">Total Posts</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">1</div>
            <div className="text-sm text-gray-400">High Priority</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">2</div>
            <div className="text-sm text-gray-400">Medium Priority</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">1</div>
            <div className="text-sm text-gray-400">Pinned</div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {mockAnnouncements.map(announcement => {
          const CategoryIcon = getCategoryIcon(announcement.category);
          
          return (
            <Card 
              key={announcement.id} 
              className={`bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ${
                announcement.pinned ? 'border-[#FF1F44]/30 bg-[#FF1F44]/5' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="p-2 bg-[#FF1F44]/20 rounded-lg">
                      <CategoryIcon className="w-5 h-5 text-[#FF1F44]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {announcement.pinned && (
                          <Pin className="w-4 h-4 text-[#FF1F44]" />
                        )}
                        <CardTitle className="text-white text-lg">
                          {announcement.title}
                        </CardTitle>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>By {announcement.author}</span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(announcement.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Badge className={getPriorityColor(announcement.priority)}>
                    {announcement.priority.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {announcement.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-white/30 text-gray-400">
                    {announcement.category}
                  </Badge>
                  
                  {user?.role === 'admin' && (
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
          Load More Announcements
        </Button>
      </div>
    </div>
  );
};
