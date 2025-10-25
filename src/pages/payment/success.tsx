
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useAuth } from '@/contexts/AuthContext';

const PaymentSuccess: React.FC = () => {
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Verifying your payment...');
    const location = useLocation();
    const { updateProfile } = useAuth();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const reference = query.get('reference');

        if (reference) {
            verifyPayment(reference);
        } else {
            setStatus('error');
            setMessage('No payment reference found.');
        }
    }, [location]);

    const verifyPayment = async (reference: string) => {
        const { data, error } = await supabase.functions.invoke('paystack', {
            body: {
                endpoint: 'verify-transaction',
                reference,
            },
        });

        if (error) {
            setStatus('error');
            setMessage('Error verifying payment.');
            return;
        }

        if (data.data.status === 'success') {
            setStatus('success');
            setMessage('Payment successful! Your wallet has been credited.');
            await updateProfile({}); // Re-fetch profile
        } else {
            setStatus('error');
            setMessage(`Payment failed: ${data.data.gateway_response}`);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 flex justify-center items-center h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Payment Status</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className={`text-lg font-semibold ${status === 'success' ? 'text-green-500' : status === 'error' ? 'text-red-500' : ''}`}>
                        {message}
                    </p>
                    <Link to="/wallet">
                        <Button className="mt-4">Back to Wallet</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentSuccess;
