
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { logKillReset, logAttendanceReset } from "@/lib/activityLogger";
// Temporary comment to force rebuild

export const AdminConfig: React.FC = () => {
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetKills = async () => {
    setIsResetting(true);
    try {
      const { error } = await supabase.functions.invoke('reset-all-kills');
      if (error) {
        throw error;
      }
      await logKillReset();
      toast({ title: 'Success', description: 'All player kills have been reset.' });
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetAttendance = async () => {
    setIsResetting(true);
    try {
      const { error } = await supabase.functions.invoke('reset-all-attendance');
      if (error) {
        throw error;
      }
      await logAttendanceReset();
      toast({ title: 'Success', description: 'All player attendance has been reset.' });
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Superadmin Configuration</h1>

      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Player Kills Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">
            This action will reset all player kills (event and total) to 0. This is irreversible.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isResetting}>
                {isResetting ? 'Resetting...' : 'Reset All Player Kills'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently reset all player kills to 0.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetKills}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Player Attendance Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">
            This action will reset all player attendance data. This is irreversible.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isResetting}>
                {isResetting ? 'Resetting...' : 'Reset All Player Attendance'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently reset all player attendance data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetAttendance}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};
