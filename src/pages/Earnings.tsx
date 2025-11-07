import React, { useState, useEffect } from 'react';
import { useEarnings } from '@/hooks/useEarnings';
import { useTaxSettings } from '@/hooks/useTaxSettings';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const Earnings = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const { earnings, loading: earningsLoading } = useEarnings();
    const { taxAmount, loading: taxLoading, isUpdating, updateTaxAmount } = useTaxSettings();
    const [newTaxAmount, setNewTaxAmount] = useState<number>(taxAmount || 0);

    const isClanMaster = profile?.role === 'clan_master' || profile?.role === 'admin';

    useEffect(() => {
        if (profile && !isClanMaster) {
            navigate('/dashboard');
        }
    }, [profile, isClanMaster, navigate]);

    if (!isClanMaster) {
        return null;
    }

    const totalEarnings = earnings.reduce((acc, earning) => acc + earning.amount, 0);

    const chartData = earnings.reduce((acc, earning) => {
        const date = new Date(earning.created_at).toLocaleDateString();
        const existing = acc.find((item) => item.date === date);
        if (existing) {
            existing.amount += earning.amount;
        } else {
            acc.push({ date, amount: earning.amount });
        }
        return acc;
    }, []);

    const handleUpdateTax = () => {
        if (newTaxAmount >= 0) {
            updateTaxAmount(newTaxAmount);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-6">Earnings</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Earnings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">₦{totalEarnings.toLocaleString()}</div>
                    </CardContent>
                </Card>
                {isClanMaster && (
                    <Card className="col-span-1 md:col-span-2">
                        <CardHeader>
                            <CardTitle>Monthly Tax</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {taxLoading ? (
                                <div className="flex items-center justify-center h-10">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Label htmlFor="taxAmount">Current Tax: ₦{taxAmount?.toLocaleString() || 0}</Label>
                                    <Input 
                                        id="taxAmount"
                                        type="number"
                                        placeholder="Set new tax amount"
                                        value={newTaxAmount}
                                        onChange={(e) => setNewTaxAmount(Number(e.target.value))}
                                        min="0"
                                    />
                                    <Button onClick={handleUpdateTax} disabled={isUpdating}>
                                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Set Tax
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Earnings Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="amount" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Transaction ID</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {earningsLoading ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : (
                                earnings.map((earning) => (
                                    <TableRow key={earning.id}>
                                        <TableCell>{earning.transaction_id}</TableCell>
                                        <TableCell>₦{earning.amount.toLocaleString()}</TableCell>
                                        <TableCell>{new Date(earning.created_at).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Earnings;