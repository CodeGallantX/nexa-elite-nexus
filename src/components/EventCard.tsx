
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNotifications } from "@/hooks/useNotifications";
import { Calendar, Users, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Event {
  id: string;
  name: string;
  date: string;
  type: string;
  status: string;
  group_id?: string;
}

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { user, profile } = useAuth();
  const { sendNotification } = useNotifications();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: groupInfo, isLoading: isLoadingGroup } = useQuery({
    queryKey: ["event-group", event.id, user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // First, check if the user is assigned to a group for this event
      const { data: participantData, error: participantError } = await supabase
        .from("event_participants")
        .select("group_id")
        .eq("event_id", event.id)
        .eq("player_id", user.id)
        .single();

      if (participantError || !participantData?.group_id) {
        console.log("User not assigned to a group for this event or participant data error:", participantError);
        return { is_assigned: false };
      }
      console.log("Participant Data:", participantData);

      // If assigned, fetch group members and group name
      const { data: groupData, error: groupError } = await supabase
        .from("event_participants")
        .select("id, group_id, player_id, role, kills, verified, profiles!event_participants_player_id_fkey(id, username, ign, avatar_url)")
        .eq("event_id", event.id)
        .eq("group_id", participantData.group_id);

      if (groupError) {
        console.error("Error fetching group members:", groupError);
        return { is_assigned: true, members: [], group_name: "Unknown Group" };
      }
      console.log("Group Data (members):", groupData);


      // Fetch group name
      const { data: groupNameData, error: groupNameError } = await supabase
        .from("event_groups")
        .select("name")
        .eq("id", participantData.group_id)
        .single();

      if (groupNameError) {
        console.error("Error fetching group name:", groupNameError);
      }
      console.log("Group Name Data:", groupNameData);

      return {
        is_assigned: true,
        group_id: participantData.group_id,
        group_name: groupNameData?.name || `Group ${participantData.group_id.substring(0, 8)}`, // Use a truncated ID if name not found
        members: groupData.map((p) => ({ ...p.profiles, role: p.role })), // Include role in member object
      };
    },
    enabled: !!user?.id,
  });

  const handleRequestAssignment = async () => {
    if (!user || !event) return;

    try {
      // 1. Get an admin user's ID
      const { data: admins, error: adminError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (adminError || !admins || admins.length === 0) {
        console.error('Error fetching admin user:', adminError);
        toast({
          title: "Error",
          description: "Failed to find an admin to send the request to.",
          variant: "destructive",
        });
        setIsDialogOpen(false);
        return;
      }

      const adminId = admins[0].id;
      const playerName = profile?.ign || profile?.username || user?.email;

      await sendNotification({
        user_id: adminId,
        title: "Assignment Request",
        message: `Player ${playerName} has requested to join the event: ${event.name}.`,
        type: "assignment_request",
      });

      toast({
        title: "Success",
        description: "Your request has been sent to the admin.",
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Error",
        description: "Failed to send assignment request.",
        variant: "destructive",
      });
    } finally {
      setIsDialogOpen(false);
    }
  };

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-[#FF1F44]" />
          {event.status === 'completed' ? `${event.name} has been completed` : event.name}
        </CardTitle>
        <p className="text-gray-400 text-xs">
          {event.date} • {event.type}
          {event.status === 'completed' && (
            <span className="ml-2 px-2 py-1 bg-gray-500/20 border border-gray-500/50 text-gray-300 rounded-md text-xs">
              COMPLETED
            </span>
          )}
        </p>
      </CardHeader>
      <CardContent>
        {event.status === 'completed' ? (
          <div className="text-center py-4">
            <p className="text-gray-400">This event has been completed.</p>
          </div>
        ) : isLoadingGroup ? (
          <div className="text-center text-gray-400">Loading group info...</div>
        ) : groupInfo?.is_assigned ? (
          <div className="text-center">
            <p className="text-white mb-2">
              You've been assigned to <span className="font-bold text-[#FF1F44]">{groupInfo.group_name}</span>
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#FF1F44] hover:bg-red-600 text-white mt-2">
                  View Team members
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-white border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Team Members: {groupInfo.group_name}</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Here are the members of your assigned group.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                  {groupInfo.members?.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3 bg-gray-700 p-3 rounded-lg">
                      <img
                        src={member.avatar_url || `https://ui-avatars.com/api/?name=${member.username}&background=random`}
                        alt={member.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-bold text-white">Ɲ・乂 {member.ign || member.username}</p>
                        <p className="text-sm text-gray-400 capitalize">{member.role || 'Player'}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-yellow-400 mb-4 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              You are not yet assigned to a group.
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#FF1F44] hover:bg-red-600 text-white">
                  Request Assignment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Assignment Request</DialogTitle>
                  <DialogDescription>
                    This will send a request to the admin to assign you to a group for this event.
                  </DialogDescription>
                </DialogHeader>
                 <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button className="bg-[#FF1F44] hover:bg-red-600 text-white" onClick={handleRequestAssignment}>Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
