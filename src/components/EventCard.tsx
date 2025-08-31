
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
        return { is_assigned: false };
      }

      // If assigned, fetch group members
      const { data: groupData, error: groupError } = await supabase
        .from("event_participants")
        .select(
          `
          group_id,
          player_id,
          profiles:player_id (
            id,
            username,
            ign
          )
        `
        )
        .eq("event_id", event.id)
        .eq("group_id", participantData.group_id);

      if (groupError) {
        console.error("Error fetching group members:", groupError);
        return { is_assigned: true, members: [] };
      }

      return {
        is_assigned: true,
        group_id: participantData.group_id,
        members: groupData.map((p) => p.profiles),
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
          {event.name}
        </CardTitle>
        <p className="text-gray-400 text-xs">
          {event.date} • {event.type}
        </p>
      </CardHeader>
      <CardContent>
        {isLoadingGroup ? (
          <div className="text-center text-gray-400">Loading group info...</div>
        ) : groupInfo?.is_assigned ? (
          <div>
            <h4 className="font-bold text-white mb-2 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Your Group
            </h4>
            <ul className="space-y-2">
              {groupInfo.members?.map((member) => (
                <li key={member.id} className="text-sm text-gray-300">
                  {member.username}
                </li>
              ))}
            </ul>
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
