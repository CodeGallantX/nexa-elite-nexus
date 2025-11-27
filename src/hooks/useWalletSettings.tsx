import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WalletSettings {
    withdrawals_enabled: boolean;
    deposits_enabled: boolean;
}

export const useWalletSettings = () => {
    const [settings, setSettings] = useState<WalletSettings>({
        withdrawals_enabled: true,
        deposits_enabled: true,
    });
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const { toast } = useToast();

    const fetchSettings = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('clan_settings')
                .select('key, value')
                .in('key', ['withdrawals_enabled', 'deposits_enabled']);

            if (error) {
                throw error;
            }

            if (data) {
                const settingsMap: WalletSettings = {
                    withdrawals_enabled: true,
                    deposits_enabled: true,
                };
                
                data.forEach((item) => {
                    if (item.key === 'withdrawals_enabled' || item.key === 'deposits_enabled') {
                        settingsMap[item.key] = item.value;
                    }
                });
                
                setSettings(settingsMap);
            }
        } catch (error) {
            console.error('Error fetching wallet settings:', error);
            // Don't show toast for fetch errors - just use defaults
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const updateSetting = async (key: keyof WalletSettings, value: boolean) => {
        setIsUpdating(true);
        try {
            const { data: session } = await supabase.auth.getSession();
            const userId = session?.session?.user?.id;

            const { error } = await supabase
                .from('clan_settings')
                .update({ 
                    value, 
                    updated_by: userId || null 
                })
                .eq('key', key);

            if (error) {
                throw error;
            }

            setSettings((prev) => ({
                ...prev,
                [key]: value,
            }));

            toast({
                title: "Success",
                description: `${key === 'withdrawals_enabled' ? 'Withdrawals' : 'Deposits'} ${value ? 'enabled' : 'disabled'} successfully.`,
            });
        } catch (error) {
            console.error('Error updating wallet setting:', error);
            toast({
                title: "Error",
                description: "Failed to update setting.",
                variant: "destructive",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return { settings, loading, isUpdating, updateSetting, refetch: fetchSettings };
};
