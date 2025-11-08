import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEarnings = () => {
    const [earnings, setEarnings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const { data, error } = await supabase
                    .from('earnings' as any)
                    .select('*, transactions(*)')
                    .order('created_at', { ascending: false });

                if (error) {
                    throw error;
                }

                setEarnings(data);
            } catch (error) {
                console.error('Error fetching earnings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEarnings();
    }, []);

    return { earnings, loading };
};
