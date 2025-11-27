
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useWalletSettings } from '@/hooks/useWalletSettings';
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
import { Wallet, ArrowDownToLine, ArrowUpFromLine, Loader2 } from 'lucide-react';

import { logKillReset, logAttendanceReset } from "@/lib/activityLogger";

export const AdminConfig: React.FC = () => {
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);
  const { settings, loading: walletSettingsLoading, isUpdating, updateSetting } = useWalletSettings();

  const handleResetKills = async () => {
    setIsResetting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('reset-all-kills', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      await logKillReset();
      toast({ title: 'Success', description: 'All player kills have been reset.' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset kills';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetAttendance = async () => {
    setIsResetting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('reset-all-attendance', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      await logAttendanceReset();
      toast({ title: 'Success', description: 'All player attendance has been reset.' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset attendance';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Superadmin Configuration</h1>

      {/* Wallet Settings */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-400">
            Control wallet functionality for all users in the clan.
          </p>
          
          {walletSettingsLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Withdrawals Toggle */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/20">
                    <ArrowUpFromLine className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <Label htmlFor="withdrawals-toggle" className="text-white font-medium">
                      Enable Withdrawals
                    </Label>
                    <p className="text-sm text-gray-400">
                      Allow users to withdraw funds from their wallets
                    </p>
                  </div>
                </div>
                <Switch
                  id="withdrawals-toggle"
                  checked={settings.withdrawals_enabled}
                  onCheckedChange={(checked) => updateSetting('withdrawals_enabled', checked)}
                  disabled={isUpdating}
                />
              </div>

              {/* Deposits Toggle */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <ArrowDownToLine className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <Label htmlFor="deposits-toggle" className="text-white font-medium">
                      Enable Deposits
                    </Label>
                    <p className="text-sm text-gray-400">
                      Allow users to fund/deposit into their wallets
                    </p>
                  </div>
                </div>
                <Switch
                  id="deposits-toggle"
                  checked={settings.deposits_enabled}
                  onCheckedChange={(checked) => updateSetting('deposits_enabled', checked)}
                  disabled={isUpdating}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
