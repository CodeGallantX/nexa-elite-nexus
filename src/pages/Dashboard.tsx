import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNotifications } from "@/hooks/useNotifications"; // Import the hook
import {
  Trophy,
  Target,
  Calendar,
  TrendingUp,
  Award,
  Zap,
  Users,
  Clock,
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const { profile, user } = useAuth();
  const { notifications: recentNotifications } = useNotifications(); // Use the hook

  // Fetch user's scrims/events
  const { data: userEvents = [] } = useQuery({
    queryKey: ["user-events", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("event_participants")
        .select(
          `
          *,
          events (
            id,
            name,
            type,
            date,
            time
          )
        `
        )
        .eq("player_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching user events:", error);
        return [];
      }
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch recent announcements
  const { data: announcements = [] } = useQuery({
    queryKey: ["recent-announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching announcements:", error);
        return [];
      }
      return data || [];
    },
  });

  const getGradeColor = (grade: string) => {
    const colors = {
      S: "text-yellow-400",
      A: "text-green-400",
      B: "text-blue-400",
      C: "text-orange-400",
      D: "text-red-400",
    };
    return colors[grade as keyof typeof colors] || "text-gray-400";
  };

  const featuredAnnouncement = announcements[0];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back,{" "}
            <span className="text-[#FF1F44]">{profile?.username}</span>
          </h1>
          <p className="text-gray-400">Your tactical command center awaits</p>
        </div>
        <div className="flex items-center space-x-4">
          <div
            className={`px-4 py-2 rounded-lg bg-black/30 border ${getGradeColor(
              profile?.grade || "D"
            )} border-current/30`}
          >
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${getGradeColor(
                  profile?.grade || "D"
                )}`}
              >
                {profile?.grade}
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
            <CardTitle className="text-sm font-medium text-gray-300">
              Total Kills
            </CardTitle>
            <Target className="h-4 w-4 text-[#FF1F44]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {profile?.kills?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-gray-400">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              System managed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Attendance
            </CardTitle>
            <Calendar className="h-4 w-4 text-[#FF1F44]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {profile?.attendance || 0}%
            </div>
            <Progress value={profile?.attendance || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Events Participated
            </CardTitle>
            <Trophy className="h-4 w-4 text-[#FF1F44]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {userEvents.length}
            </div>
            <p className="text-xs text-gray-400">total events</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Tier Status
            </CardTitle>
            <Award className="h-4 w-4 text-[#FF1F44]" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-white">
              {profile?.tier || "Rookie"}
            </div>
            <p className="text-xs text-gray-400">
              Since {profile?.date_joined}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-[#FF1F44]" />
              Recent Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userEvents.length > 0 ? (
                userEvents.map((participation) => (
                  <div
                    key={participation.id}
                    className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        {participation.events?.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {participation.events?.date} •{" "}
                        {participation.events?.type}
                      </p>
                    </div>
                    {participation.kills && (
                      <div className="text-green-400 text-sm font-medium">
                        {participation.kills} kills
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No recent events
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Performance */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-[#FF1F44]" />
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day, index) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-16 text-sm text-gray-400">
                    {day.slice(0, 3)}
                  </div>
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
      </div>

      {/* Featured Announcement */}
      {featuredAnnouncement && (
        <Card className="bg-gradient-to-r from-[#FF1F44]/10 to-red-600/5 border-[#FF1F44]/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="w-5 h-5 mr-2 text-[#FF1F44]" />
              Featured Announcement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">
                {featuredAnnouncement.title}
              </h3>
              <p className="text-gray-300">{featuredAnnouncement.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>
                    📅{" "}
                    {new Date(
                      featuredAnnouncement.created_at
                    ).toLocaleDateString()}
                  </span>
                </div>
                <Button
                  onClick={() => (window.location.href = "/announcements")}
                  className="bg-[#FF1F44] hover:bg-red-600 text-white"
                >
                  View All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Notifications - Now using the same hook as NotificationBell */}
      {recentNotifications.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-600/5 border-blue-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-400" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start space-x-3 p-3 bg-background/20 rounded-lg"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      notification.status === "unread"
                        ? "bg-blue-400"
                        : "bg-gray-600"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">
                      {notification.title || notification.message}
                    </h4>
                    {notification.title &&
                      notification.message !== notification.title && (
                        <p className="text-gray-300 text-sm">
                          {notification.message}
                        </p>
                      )}
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(notification.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {recentNotifications.length > 3 && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    /* Navigate to notifications page or show more */
                  }}
                  className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                >
                  View All Notifications ({recentNotifications.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={() => (window.location.href = "/chat")}
          className="p-6 h-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white"
        >
          <div className="flex flex-col items-center space-y-2">
            <Users className="w-8 h-8 text-[#FF1F44]" />
            <span className="font-medium">Team Chat</span>
            <span className="text-xs text-gray-400">
              Join active discussions
            </span>
          </div>
        </Button>

        <Button
          onClick={() => (window.location.href = "/loadouts")}
          className="p-6 h-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white"
        >
          <div className="flex flex-col items-center space-y-2">
            <Target className="w-8 h-8 text-[#FF1F44]" />
            <span className="font-medium">My Loadouts</span>
            <span className="text-xs text-gray-400">Manage your gear</span>
          </div>
        </Button>

        <Button
          onClick={() => (window.location.href = "/scrims")}
          className="p-6 h-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white"
        >
          <div className="flex flex-col items-center space-y-2">
            <Trophy className="w-8 h-8 text-[#FF1F44]" />
            <span className="font-medium">View Scrims</span>
            <span className="text-xs text-gray-400">Check schedules</span>
          </div>
        </Button>
      </div>
    </div>
  );
};
