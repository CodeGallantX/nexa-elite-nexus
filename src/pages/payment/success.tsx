import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import ReceiptDialog from '@/components/ReceiptDialog';
import { useAuth } from '@/contexts/AuthContext';

const PaymentSuccess: React.FC = () => {
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Verifying your payment...');
    const [showReceipt, setShowReceipt] = useState(false);
    const [transaction, setTransaction] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
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
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: {
            reference,
          },
        });
        if (error || !data || !data.data) {
            setStatus('error');
            setMessage('Error verifying payment.');
            return;
        }

        if ((data.message === 'Transaction already processed' || data.data.status === 'success') && data.transaction) {
            setStatus('success');
            setMessage('Payment successful! Your wallet has been credited.');
            setTransaction(data.transaction);
            setShowReceipt(true);
            await updateProfile({}); // Re-fetch profile
        } else {
            setStatus('error');
            setMessage(`Payment failed: ${data.data.gateway_response}`);
        }
    };

    const handleCloseReceipt = () => {
        setShowReceipt(false);
        navigate('/wallet');
    };

    const renderIcon = () => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />;
            case 'error':
                return <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />;
            default:
                return <Loader className="w-16 h-16 text-gray-500 animate-spin mx-auto mb-4" />;
        }
    }

    if (showReceipt && transaction) {
        return <ReceiptDialog transaction={transaction} onClose={handleCloseReceipt} />;
    }

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 flex justify-center items-center h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Payment Status</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    {renderIcon()}
                    <p className={`text-lg font-semibold ${status === 'success' ? 'text-green-500' : status === 'error' ? 'text-red-500' : ''}`}>
                        {message}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentSuccess;
