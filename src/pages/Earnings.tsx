import React, { useState, useEffect } from 'react';
import { useEarnings } from '@/hooks/useEarnings';
import { useTaxSettings } from '@/hooks/useTaxSettings';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const Earnings = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { earnings, loading: earningsLoading } = useEarnings();
    const { taxAmount, loading: taxLoading, isUpdating, updateTaxAmount } = useTaxSettings();
    const [newTaxAmount, setNewTaxAmount] = useState<number>(taxAmount || 0);
    const [isCashingOut, setIsCashingOut] = useState(false);
    const [cashOutDialogOpen, setCashOutDialogOpen] = useState(false);
    const [cashOutAmount, setCashOutAmount] = useState(0);

    // Keep the tax input synced with the latest value set by the clan master
    useEffect(() => {
        setNewTaxAmount(taxAmount || 0);
    }, [taxAmount]);

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

    // Calculate earnings by source
    const earningsBySource = earnings.reduce((acc, earning) => {
        const source = earning.source || 'other';
        acc[source] = (acc[source] || 0) + earning.amount;
        return acc;
    }, {} as Record<string, number>);
    
    const handleCashOut = async () => {
        if (!profile?.banking_info) {
            toast({
                title: "Banking Information Required",
                description: "Please add your banking information in Settings before cashing out.",
                variant: "destructive",
            });
            setCashOutDialogOpen(false);
            navigate('/settings');
            return;
        }

        if (cashOutAmount <= 0) {
            toast({
                title: "Invalid Amount",
                description: "Please enter a valid amount to cash out.",
                variant: "destructive",
            });
            return;
        }

        if (cashOutAmount > totalEarnings) {
            toast({
                title: "Insufficient Earnings",
                description: `You can only cash out up to ₦${totalEarnings.toLocaleString()}`,
                variant: "destructive",
            });
            return;
        }

        setIsCashingOut(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session?.access_token) {
                toast({
                    title: "Authentication Error",
                    description: "Your session has expired. Please log out and log back in.",
                    variant: "destructive",
                });
                return;
            }

            // Call the edge function to process the cash out
            const { data, error } = await supabase.functions.invoke('process-earnings-cashout', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: {
                    amount: cashOutAmount,
                },
            });

            if (error) {
                throw error;
            }

            toast({
                title: "Cash Out Initiated",
                description: `Your request to cash out ₦${cashOutAmount.toLocaleString()} has been submitted. Funds will be sent to your account shortly.`,
            });

            setCashOutAmount(0);
            setCashOutDialogOpen(false);
        } catch (err: any) {
            console.error('Cash out error:', err);
            toast({
                title: "Cash Out Failed",
                description: err?.message || "Failed to process cash out. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsCashingOut(false);
        }
    };
    // Build multi-series chart data: one line per earnings source across dates
    const buildChartData = () => {
        // map date -> source -> sum
        const dateMap: Record<string, Record<string, number>> = {};
        const sourcesSet = new Set<string>();

        earnings.forEach((earning) => {
            const date = new Date(earning.created_at).toLocaleDateString();
            const source = earning.source || 'other';
            sourcesSet.add(source);
            dateMap[date] = dateMap[date] || {};
            dateMap[date][source] = (dateMap[date][source] || 0) + earning.amount;
        });

        const dates = Object.keys(dateMap).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        const sources = Array.from(sourcesSet);

        const data = dates.map((date) => {
            const row: Record<string, any> = { date };
            sources.forEach((s) => {
                row[s] = dateMap[date][s] || 0;
            });
            return row;
        });

        return { data, sources };
    };

    const { data: multiChartData, sources: chartSources } = buildChartData();

    const handleUpdateTax = () => {
        if (newTaxAmount >= 0) {
            updateTaxAmount(newTaxAmount);
        }
    };

    // Pagination for recent transactions
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const totalPages = Math.max(1, Math.ceil(earnings.length / pageSize));

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [earnings.length, totalPages]);

    const startIdx = (currentPage - 1) * pageSize;
    const pageItems = earnings.slice(startIdx, startIdx + pageSize);

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Earnings</h1>
                
                <Dialog open={cashOutDialogOpen} onOpenChange={setCashOutDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="default" size="lg">
                            <DollarSign className="h-5 w-5 mr-2" />
                            Cash Out
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Cash Out Earnings</DialogTitle>
                            <DialogDescription>
                                Transfer your earnings to your bank account
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Alert>
                                <AlertTitle>Available Earnings</AlertTitle>
                                <AlertDescription>
                                    <div className="text-2xl font-bold text-primary">
                                        ₦{totalEarnings.toLocaleString()}
                                    </div>
                                </AlertDescription>
                            </Alert>
                            
                            {profile?.banking_info && (
                                <div className="space-y-2">
                                    <Label>Bank Account</Label>
                                    <div className="p-3 bg-muted rounded-lg">
                                        <div className="font-medium">{profile.banking_info.bank_name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {profile.banking_info.account_number} - {profile.banking_info.account_name}
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="space-y-2">
                                <Label htmlFor="cashOutAmount">Amount to Cash Out</Label>
                                <Input
                                    id="cashOutAmount"
                                    type="number"
                                    placeholder="Enter amount"
                                    value={cashOutAmount || ''}
                                    onChange={(e) => setCashOutAmount(Number(e.target.value))}
                                    max={totalEarnings}
                                    min={0}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={handleCashOut}
                                disabled={isCashingOut || cashOutAmount <= 0}
                            >
                                {isCashingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isCashingOut ? "Processing..." : "Confirm Cash Out"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Earnings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">₦{totalEarnings.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Withdrawal Fees (4%)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">₦{(earningsBySource['withdrawal_fee'] || 0).toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Deposit Fees (4%)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">₦{(earningsBySource['deposit_fee'] || 0).toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Transfer Fees (₦50)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">₦{(earningsBySource['transfer_fee'] || 0).toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Tax</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">₦{(earningsBySource['tax_fee'] || 0).toLocaleString()}</div>
                    </CardContent>
                </Card>
                {isClanMaster && (
                    <Card className="col-span-1 md:col-span-2 lg:col-span-4">
                        <CardHeader>
                            <CardTitle>Monthly Tax Settings</CardTitle>
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
                            <LineChart data={multiChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {chartSources.map((s, idx) => {
                                    // some readable color palette
                                    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#FFBB28'];
                                    const color = colors[idx % colors.length];
                                    return (
                                        <Line key={s} type="monotone" dataKey={s} stroke={color} strokeWidth={2} dot={false} name={s.replace('_', ' ')} />
                                    );
                                })}
                            </LineChart>
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
                                <TableHead>Source</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {earningsLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <>
                                    {pageItems.map((earning) => (
                                        <TableRow key={earning.id}>
                                            <TableCell>{earning.transaction_id}</TableCell>
                                            <TableCell className="capitalize">{earning.source?.replace('_', ' ') || 'Other'}</TableCell>
                                            <TableCell>₦{earning.amount.toLocaleString()}</TableCell>
                                            <TableCell>{new Date(earning.created_at).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}

                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <div className="flex justify-between items-center">
                                                <div>Page {currentPage} of {totalPages}</div>
                                                <div className="flex gap-2">
                                                    <Button aria-label="Previous page" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                                                        <ChevronLeft className="h-4 w-4" />
                                                    </Button>
                                                    <Button aria-label="Next page" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Earnings;