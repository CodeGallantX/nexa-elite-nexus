import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Shield, Coins, ArrowDown, ArrowUp, Gift, Award, ArrowUpDown, Copy, Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAdminPlayers } from '@/hooks/useAdminPlayers';
import { sendBroadcastPushNotification } from '@/lib/pushNotifications';
import { usePaystackPayment } from 'react-paystack';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const TransactionItem = ({ transaction }) => (
  <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm rounded-lg mb-2">
    <div className="flex items-center gap-4">
      {renderTransactionIcon(transaction.type)}
      <div>
        <p className="font-semibold">{transaction.description}</p>
        <p className="text-sm text-muted-foreground">{transaction.date}</p>
      </div>
    </div>
    <div className={`font-bold text-lg ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
      {transaction.amount > 0 ? '+' : ''}₦{Math.abs(transaction.amount).toFixed(0)}
    </div>
  </div>
);

const renderTransactionIcon = (type: string) => {
  switch (type) {
    case 'Deposit':
    case 'Transfer In':
    case 'Giveaway Redeemed':
      return (
        <div className="p-2 rounded-full bg-green-500/20 backdrop-blur-sm">
          <ArrowDown className="h-8 w-8 text-green-500" />
        </div>
      );
    case 'Withdrawal':
    case 'Transfer Out':
    case 'Giveaway Created':
    case 'Monthly Tax':
      return (
        <div className="p-2 rounded-full bg-red-500/20 backdrop-blur-sm">
          <ArrowUp className="h-8 w-8 text-red-500" />
        </div>
      );
    case 'Giveaway Refund':
      return (
        <div className="p-2 rounded-full bg-blue-500/20 backdrop-blur-sm">
          <Gift className="h-8 w-8 text-blue-500" />
        </div>
      );
    default:
      return (
        <div className="p-2 rounded-full bg-gray-500/20 backdrop-blur-sm">
          <Coins className="h-8 w-8 text-gray-500" />
        </div>
      );
  }
};

const GiveawayDialog = ({ setWalletBalance, walletBalance, onRedeemComplete, redeemCooldown, onRedeemSuccess }) => {
    const { profile } = useAuth();
    const { toast } = useToast();
    const isClanMaster = profile?.role === 'clan_master' || profile?.role === 'admin';
  
    const [codeValue, setCodeValue] = useState('500');
    const [totalCodes, setTotalCodes] = useState('10');
    const [expiresIn, setExpiresIn] = useState('24');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    
    // For redeeming codes
    const [redeemCode, setRedeemCode] = useState('');
    const [isRedeeming, setIsRedeeming] = useState(false);
    
    // For viewing giveaways
    const [myGiveaways, setMyGiveaways] = useState<any[]>([]);
    const [selectedGiveaway, setSelectedGiveaway] = useState<any>(null);
    const [showCodesDialog, setShowCodesDialog] = useState(false);

    useEffect(() => {
        if (open && isClanMaster) {
            fetchMyGiveaways();
        }
    }, [open, isClanMaster]);

    const fetchMyGiveaways = async () => {
        try {
            const { data, error } = await supabase
                .from('giveaways')
                .select(`
                    *,
                    giveaway_codes(code, is_redeemed, redeemed_at, redeemed_by)
                `)
                .eq('created_by', profile?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMyGiveaways(data || []);
        } catch (error) {
            console.error('Error fetching giveaways:', error);
        }
    };

    const handleCreateGiveaway = async () => {
        const totalCost = Number(codeValue) * Number(totalCodes);
        
        if (!title.trim()) {
            toast({
                title: "Title required",
                description: "Please enter a title for your giveaway",
                variant: "destructive",
            });
            return;
        }

        if (totalCost > walletBalance) {
            toast({
                title: "Insufficient funds",
                description: `You need ₦${totalCost.toLocaleString()} but only have ₦${walletBalance.toLocaleString()}`,
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const { data, error } = await supabase.functions.invoke('create-giveaway', {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                },
                body: {
                    title,
                    message,
                    code_value: Number(codeValue),
                    total_codes: Number(totalCodes),
                    expires_in_hours: Number(expiresIn),
                },
            });

            if (error) throw error;

            toast({
                title: "🎁 Giveaway Created!",
                description: `${totalCodes} codes worth ₦${codeValue} each have been generated and shared with your clan!`,
            });

            // Show codes dialog
            setSelectedGiveaway(data.giveaway);
            setShowCodesDialog(true);
            
            // Reset form
            setTitle('');
            setMessage('');
            setCodeValue('500');
            setTotalCodes('10');
            
            // Refresh wallet balance
            setWalletBalance(prev => prev - totalCost);
            await fetchMyGiveaways();
        } catch (error: any) {
            console.error('Error creating giveaway:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to create giveaway",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRedeemCode = async () => {
        if (!redeemCode.trim()) {
            toast({
                title: "Invalid code",
                description: "Please enter a code",
                variant: "destructive",
            });
            return;
        }

        setIsRedeeming(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const { data, error } = await supabase.functions.invoke('redeem-giveaway', {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                },
                body: {
                    code: redeemCode.trim().toUpperCase(),
                },
            });

            if (error) throw error;

            // Map server-side messages to friendlier client-side messages
            const mapRedeemMessage = (msg: string) => {
                switch ((msg || '').toString()) {
                    case 'Invalid code':
                        return 'The code you entered is invalid. Please check and try again.';
                    case 'Code already redeemed':
                        return 'This code has already been redeemed.';
                    case 'Code expired':
                        return 'This code has expired.';
                    default:
                        return msg || 'Redemption failed. Please try again.';
                }
            };

            if (!data.success) {
                toast({
                    title: "Redemption Failed",
                    description: mapRedeemMessage(data.message),
                    variant: "destructive",
                });
                return;
            }

            // Show confetti
            const confetti = (await import('canvas-confetti')).default;
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            toast({
                title: "🎉 Success!",
                description: `₦${data.amount.toLocaleString()} has been credited to your wallet!`,
            });

            setRedeemCode('');
            setWalletBalance(data.new_balance);
            onRedeemSuccess?.();
            setOpen(false);
            onRedeemComplete?.();
        } catch (error: any) {
            console.error('Error redeeming code:', error);
            if (error.context && error.context.json && error.context.json.message) {
                toast({
                    title: "Redemption Failed",
                    description: error.context.json.message,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Error",
                    description: error.message || "Failed to redeem code",
                    variant: "destructive",
                });
            }
        } finally {
            setIsRedeeming(false);
        }
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast({
            title: "Copied!",
            description: `Code ${code} copied to clipboard`,
        });
    };
  
    const redeemUI = (
        <div className="space-y-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="redeemCode">Enter Giveaway Code</Label>
                <Input
                    id="redeemCode"
                    placeholder="Enter code..."
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                    className="uppercase"
                />
            </div>

            <Button 
                onClick={handleRedeemCode}
                disabled={isRedeeming || !redeemCode.trim() || redeemCooldown > 0}
                className="w-full"
            >
                {isRedeeming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {redeemCooldown > 0 
                  ? `Wait ${Math.floor(redeemCooldown / 60)}m ${redeemCooldown % 60}s` 
                  : 'Redeem Code'}
            </Button>
        </div>
    );

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
                        <Gift className="h-8 w-8 mb-2" />
                        Giveaway
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>🎁 Giveaway</DialogTitle>
                        <DialogDescription>
                            {isClanMaster 
                                ? 'Create, view, or redeem giveaway codes.' 
                                : 'Enter a code to instantly credit your wallet.'}
                        </DialogDescription>
                    </DialogHeader>

                    {isClanMaster ? (
                        <Tabs defaultValue="create" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="create">Create New</TabsTrigger>
                                <TabsTrigger value="history">My Giveaways</TabsTrigger>
                                <TabsTrigger value="redeem">Redeem</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="create" className="space-y-4 mt-4">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Giveaway Title *</Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g., Weekend Bonus"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="grid gap-2">
                                        <Label htmlFor="message">Message (Optional)</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Add a message for your clan..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            rows={2}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="codeValue">Value per Code</Label>
                                            <Select value={codeValue} onValueChange={setCodeValue}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="100">₦100</SelectItem>
                                                    <SelectItem value="200">₦200</SelectItem>
                                                    <SelectItem value="500">₦500</SelectItem>
                                                    <SelectItem value="1000">₦1,000</SelectItem>
                                                    <SelectItem value="2000">₦2,000</SelectItem>
                                                    <SelectItem value="5000">₦5,000</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="totalCodes">Number of Codes</Label>
                                            <Input
                                                id="totalCodes"
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={totalCodes}
                                                onChange={(e) => setTotalCodes(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="expiresIn">Expires In</Label>
                                        <Select value={expiresIn} onValueChange={setExpiresIn}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0.166667">10 minutes</SelectItem>
                                                <SelectItem value="0.25">15 minutes</SelectItem>
                                                <SelectItem value="0.5">30 minutes</SelectItem>
                                                <SelectItem value="6">6 hours</SelectItem>
                                                <SelectItem value="12">12 hours</SelectItem>
                                                <SelectItem value="24">24 hours</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Alert>
                                        <AlertTitle>Total Cost</AlertTitle>
                                        <AlertDescription>
                                            <div className="flex justify-between items-center">
                                                <span>₦{codeValue} × {totalCodes} codes</span>
                                                <span className="font-bold text-lg">
                                                    = ₦{(Number(codeValue) * Number(totalCodes)).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-2">
                                                Your balance: ₦{walletBalance.toLocaleString()}
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                </div>

                                <DialogFooter>
                                    <Button 
                                        onClick={handleCreateGiveaway}
                                        disabled={isLoading || !title.trim()}
                                        className="w-full"
                                    >
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Create Giveaway
                                    </Button>
                                </DialogFooter>
                            </TabsContent>

                            <TabsContent value="history" className="mt-4">
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {myGiveaways.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No giveaways created yet
                                        </div>
                                    ) : (
                                        myGiveaways.map((giveaway) => (
                                            <Card key={giveaway.id} className="p-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-semibold">{giveaway.title}</h4>
                                                        {giveaway.message && (
                                                            <p className="text-sm text-muted-foreground">{giveaway.message}</p>
                                                        )}
                                                        <div className="flex gap-4 mt-2 text-sm">
                                                            <span>₦{Number(giveaway.code_value).toLocaleString()} per code</span>
                                                            <span>•</span>
                                                            <span>{giveaway.total_codes} codes</span>
                                                        </div>
                                                        <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                                                            <span>{giveaway.redeemed_count} redeemed</span>
                                                            <span>•</span>
                                                            <span>Expires: {new Date(giveaway.expires_at).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedGiveaway(giveaway);
                                                            setShowCodesDialog(true);
                                                        }}
                                                    >
                                                        View Codes
                                                    </Button>
                                                </div>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </TabsContent>
                            <TabsContent value="redeem" className="mt-4">
                                {redeemUI}
                            </TabsContent>
                        </Tabs>
                    ) : (
                        redeemUI
                    )}
                </DialogContent>
            </Dialog>

            {/* Codes Dialog */}
            <Dialog open={showCodesDialog} onOpenChange={setShowCodesDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Giveaway Codes</DialogTitle>
                        <DialogDescription>
                            {selectedGiveaway?.title}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {selectedGiveaway?.giveaway_codes?.map((codeObj: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <div className="flex items-center gap-2">
                                    <code className="font-mono font-bold">{codeObj.code}</code>
                                    {codeObj.is_redeemed && (
                                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                            Redeemed
                                        </span>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyCode(codeObj.code)}
                                    disabled={codeObj.is_redeemed}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

const WithdrawDialog = ({ setWalletBalance, walletBalance, banks, onWithdrawalComplete, isWithdrawalServiceAvailable = true, cooldown = 0 }) => {
    const { profile } = useAuth();
    const [amount, setAmount] = useState(0);
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [bankCode, setBankCode] = useState('');
    const [bankName, setBankName] = useState('');
    const [notes, setNotes] = useState('');
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (profile?.banking_info) {
            setAccountName(profile.banking_info.account_name || '');
            setAccountNumber(profile.banking_info.account_number || '');
            setBankCode(profile.banking_info.bank_code || '');
            setBankName(profile.banking_info.bank_name || '');
        }
    }, [profile]);

    const handleWithdraw = async () => {
        console.log("Withdrawal process started.");
        console.log("State:", { amount, walletBalance, bankCode, accountNumber, accountName });

        if (amount > walletBalance) {
            console.error("Validation failed: Insufficient funds.");
            toast({
                title: "Insufficient funds",
                description: "You do not have enough funds in your wallet to complete this transaction.",
                variant: "destructive",
            });
            return;
        }
        if (amount < 100) {
            console.error("Validation failed: Amount less than 100.");
            toast({
                title: "Invalid Amount",
                description: "Minimum withdrawal amount is ₦100",
                variant: "destructive",
            });
            return;
        }
        if (!bankCode) {
            console.error("Validation failed: Bank not selected.");
            toast({
                title: "Bank not selected",
                description: "Please select a bank",
                variant: "destructive",
            });
            return;
        }
        if (!/^[0-9]{10}$/.test(accountNumber)) {
            console.error("Validation failed: Invalid account number.");
            toast({
                title: "Invalid Account Number",
                description: "Please enter a valid 10-digit account number",
                variant: "destructive",
            });
            return;
        }

        console.log("Validation passed. Creating transfer recipient...");
        const recipientPayload = {
            endpoint: 'create-transfer-recipient',
            name: accountName,
            account_number: accountNumber,
            bank_code: bankCode,
        };
        console.log("Recipient payload:", recipientPayload);

        const { data: { session } } = await supabase.auth.getSession();

        if (!session || !session.access_token) {
            toast({
                title: "Authentication Error",
                description: "Your session has expired. Please log out and log back in.",
                variant: "destructive",
            });
            return;
        }

        const { data: recipientData, error: recipientError } = await supabase.functions.invoke('paystack-transfer', {
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
            },
            body: recipientPayload,
        });

        if (recipientError || !recipientData.status) {
            console.error("Error creating transfer recipient:", recipientError || recipientData);
            toast({
                title: "Error creating transfer recipient",
                description: recipientData?.message || recipientError?.message || "An error occurred",
                variant: "destructive",
            });
            return;
        }

        console.log("Transfer recipient created successfully:", recipientData);
        console.log("Initiating transfer...");
        const transferPayload = {
            endpoint: 'initiate-transfer',
            amount,
            recipient_code: recipientData.data.recipient_code,
        };
        console.log("Transfer payload:", transferPayload);

        const { data: transferData, error: transferError } = await supabase.functions.invoke('paystack-transfer', {
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
            },
            body: transferPayload,
        });

        if (transferError || !transferData.status) {
            console.error("Error initiating transfer:", transferError || transferData);
            
            const errorMessage = transferData?.message || transferData?.error || transferError?.message || "An unexpected error occurred";
            
            if (transferData?.error === "insufficient_paystack_balance") {
                toast({
                    title: "Withdrawal Service Unavailable",
                    description: "We are currently unable to process withdrawals. Please try again later. Our team has been notified.",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Withdrawal Failed",
                    description: errorMessage,
                    variant: "destructive",
                });
            }
            return;
        }

        console.log("Transfer initiated successfully:", transferData);
        
        // Reset form and close dialog
        setAmount(0);
        setNotes('');
        setOpen(false);
        
        // Show success message
        toast({
            title: "Withdrawal Submitted",
            description: `Your request to withdraw ₦${amount.toLocaleString()} has been submitted successfully. Funds will be sent to your account shortly.`,
        });
        
        // Refresh wallet data from database
        onWithdrawalComplete?.();
        console.log("Withdrawal process finished.");
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {isWithdrawalServiceAvailable ? (
                <DialogTrigger asChild>
                    <Button 
                        variant="outline" 
                        className="w-full h-24 flex flex-col items-center justify-center"
                        // Temporarily disable withdrawals app-wide until service is re-enabled
                        disabled={true}
                    >
                        <ArrowDown className="h-8 w-8 mb-2" />
                        {/* Provide clear label so users know why it's disabled */}
                        {'Withdraw (Unavailable)'}
                    </Button>
                </DialogTrigger>
            ) : (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center" disabled>
                                <ArrowDown className="h-8 w-8 mb-2" />
                                Withdraw
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Withdrawal service is not available at the moment.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Withdraw</DialogTitle>
                    <DialogDescription>Withdraw funds from your wallet to your bank account.</DialogDescription>
                </DialogHeader>
                <div className="py-4 grid gap-4">

                    <div className="grid gap-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Input 
                                        id="bankName"
                                        placeholder="Bank Name"
                                        value={bankName}
                                        readOnly
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>To edit, go to your settings page.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Input 
                                        id="accountNumber"
                                        placeholder="Account Number"
                                        value={accountNumber}
                                        readOnly
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>To edit, go to your settings page.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="accountName">Account Name</Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Input 
                                        id="accountName"
                                        placeholder="Account Name"
                                        value={accountName}
                                        readOnly
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>To edit, go to your settings page.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input 
                            id="amount"
                            type="number"
                            placeholder="₦0.00"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />
                    </div>
                    <Alert>
                        <Coins className="h-4 w-4" />
                        <AlertTitle>Transaction Fee</AlertTitle>
                        <AlertDescription>
                            A fee of ₦50 will be deducted for this transaction.
                        </AlertDescription>
                    </Alert>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Transaction Notes</Label>
                        <Textarea 
                            id="notes"
                            placeholder="Transaction Notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleWithdraw}>Submit Withdrawal</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const TransferDialog = ({ walletBalance, onTransferComplete }) => {
    const [amount, setAmount] = useState(0);
    const [recipient, setRecipient] = useState('');
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const { data: players, isLoading } = useAdminPlayers();

    const [isTransferring, setIsTransferring] = useState(false);

    const handleTransfer = async () => {
        if (amount <= 0) {
            toast({ title: "Invalid Amount", description: "Transfer amount must be positive.", variant: "destructive" });
            return;
        }
        if (!recipient) {
            toast({ title: "No Recipient", description: "Please select a player to transfer to.", variant: "destructive" });
            return;
        }
        if (amount > walletBalance) {
            toast({ title: "Insufficient funds", description: "You do not have enough funds to complete this transaction.", variant: "destructive" });
            return;
        }

        setIsTransferring(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session || !session.access_token) {
                toast({
                    title: "Authentication Error",
                    description: "Your session has expired. Please log out and log back in.",
                    variant: "destructive",
                });
                setIsTransferring(false);
                return;
            }

            const { error } = await supabase.functions.invoke('transfer-funds', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: {
                    recipient_ign: recipient,
                    amount,
                },
            });

            if (error) {
                throw new Error(error.message);
            }

            toast({
                title: "Transfer Successful!",
                description: `₦${amount.toLocaleString()} has been sent to ${recipient}`,
            });
            
            // Reset form
            setAmount(0);
            setRecipient('');
            setOpen(false);
            
            // Trigger wallet refresh via callback
            onTransferComplete?.();
        } catch (err) {
            toast({
                title: "Transfer Failed",
                description: err.message || "Unable to complete transfer. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsTransferring(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
                    <ArrowUpDown className="h-8 w-8 mb-2" />
                    Transfer
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Transfer</DialogTitle>
                    <DialogDescription>Transfer funds to another player's wallet.</DialogDescription>
                </DialogHeader>
                <div className="py-4 grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="recipient">Recipient</Label>
                                            <Select onValueChange={setRecipient} value={recipient}>
                                                <SelectTrigger id="recipient">
                                                    <SelectValue placeholder="Select a player..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {players && players.map((player) => (
                                                        <SelectItem key={player.id} value={player.ign}>
                                                            {player.status === 'beta' ? 'Ɲ・乃' : 'Ɲ・乂'}{player.ign}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input 
                            id="amount"
                            type="number"
                            placeholder="₦0.00"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />
                    </div>
                    <Alert>
                        <Coins className="h-4 w-4" />
                        <AlertTitle>Transaction Fee</AlertTitle>
                        <AlertDescription>
                            A fee of ₦50 will be deducted for this transaction.
                        </AlertDescription>
                    </Alert>
                </div>
                <DialogFooter>
                    <Button onClick={handleTransfer} disabled={isTransferring}>
                        {isTransferring && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isTransferring ? "Processing..." : "Transfer Funds"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const FundWalletDialog = () => {
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const [amount, setAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const config = {
        reference: (new Date()).getTime().toString(),
        email: user?.email || '',
        amount: amount * 100,
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
        metadata: {
          userId: profile?.id || '',
          custom_fields: []
        },
        currency: 'NGN',
    };

    const initializePayment = usePaystackPayment(config as any);

    const onSuccess = () => {
      navigate(`/payment-success?reference=${config.reference}`);
    };

    const onClose = () => {
        toast({
            title: "Payment Closed",
            description: "You closed the payment window. Your transaction was not completed.",
            variant: "destructive",
        });
        setIsLoading(false);
    }

    const handlePayment = () => {
        setIsLoading(true);
        initializePayment({ onSuccess, onClose } as any);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
                    <Coins className="h-8 w-8 mb-2" />
                    Fund Wallet
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Fund Your Wallet</DialogTitle>
                    <DialogDescription>Add funds to your wallet using Paystack.</DialogDescription>
                </DialogHeader>
                <div className="py-4 grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                                                <Input
                                                    id="amount"
                                                    type="number"
                                                    placeholder="₦0.00"
                                                    value={amount}
                                                    onChange={(e) => setAmount(Number(e.target.value))}
                                                />
                                            </div>
                                            <Alert>
                                                <Coins className="h-4 w-4" />
                                                <AlertTitle>Transaction Fee</AlertTitle>
                                                <AlertDescription>
                                                    A fee of ₦50 will be deducted for this transaction.
                                                </AlertDescription>
                                            </Alert>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handlePayment} disabled={!user || !profile || amount <= 0 || isLoading || !import.meta.env.VITE_PAYSTACK_PUBLIC_KEY}>
                                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Fund with Paystack
                                            </Button>
                                        </DialogFooter>            </DialogContent>
        </Dialog>
    )
}

const Wallet: React.FC = () => {
  const { profile, user } = useAuth();
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [banks, setBanks] = useState<any[]>([]);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [withdrawCooldown, setWithdrawCooldown] = useState(0);
  const [redeemCooldown, setRedeemCooldown] = useState(0);

  const fetchWalletData = async (page = 1) => {
    if (!user?.id) return;

    try {
      // Fetch wallet balance
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .maybeSingle();

      if (walletError) {
        console.error('Error fetching wallet:', walletError);
      } else if (walletData) {
        setWalletBalance(Number(walletData.balance) || 0);
      }

      // Fetch transactions
      const { data: walletIdData } = await supabase
        .from('wallets')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (walletIdData) {
        const from = (page - 1) * transactionsPerPage;
        const to = from + transactionsPerPage - 1;

        const { data: transactionsData, error: transactionsError, count } = await supabase
          .from('transactions')
          .select('*', { count: 'exact' })
          .eq('wallet_id', walletIdData.id)
          .order('created_at', { ascending: false })
          .range(from, to);

        if (transactionsError) {
          console.error('Error fetching transactions:', transactionsError);
        } else if (transactionsData) {
          // Extract user names from references for transfers
          const enrichedTransactions = await Promise.all(transactionsData.map(async (tx) => {
            const typeMapping: Record<string, string> = {
              'deposit': 'Deposit',
              'withdrawal': 'Withdrawal',
              'transfer_in': 'Transfer In',
              'transfer_out': 'Transfer Out',
              'giveaway_created': 'Giveaway Created',
              'giveaway_redeemed': 'Giveaway Redeemed',
              'giveaway_refund': 'Giveaway Refund',
              'tax_deduction': 'Monthly Tax',
            };
            
            const isDebit = ['transfer_out', 'withdrawal', 'giveaway_created', 'tax_deduction'].includes(tx.type);
            let displayName = '';
            
            // Extract username from reference for transfers
            if (tx.type === 'transfer_in' || tx.type === 'transfer_out') {
              const match = tx.reference.match(/transfer_(from|to)_(.+)_\d/);
              if (match) {
                displayName = match[2];
              }
            }
            
            let description = typeMapping[tx.type] || tx.type;
            if (displayName) {
              description += tx.type === 'transfer_in' ? ` from ${displayName}` : ` to ${displayName}`;
            } else if (tx.type === 'giveaway_created') {
              description = 'Giveaway Created';
            } else if (tx.type === 'giveaway_redeemed') {
              description = 'Giveaway Redeemed';
            }
            
            return {
              id: tx.id,
              description: `${description} - ${tx.status}`,
              date: new Date(tx.created_at).toLocaleDateString(),
              amount: isDebit ? -Number(tx.amount) : Number(tx.amount),
              type: typeMapping[tx.type] || 'Other'
            };
          }));
          
          setTransactions(enrichedTransactions);
          setTotalTransactions(count || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  useEffect(() => {
    fetchWalletData(currentPage);
    checkCooldowns();
  }, [user?.id, currentPage]);

  useEffect(() => {
    const fetchBanks = async () => {
      const { data, error } = await supabase.functions.invoke('get-banks');
      if (data?.status && data?.data) {
        setBanks(data.data);
      }
    };
    fetchBanks();
  }, []);

  useEffect(() => {
    if (withdrawCooldown > 0) {
      const timer = setInterval(() => {
        setWithdrawCooldown(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [withdrawCooldown]);

  useEffect(() => {
    if (redeemCooldown > 0) {
      const timer = setInterval(() => {
        setRedeemCooldown(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [redeemCooldown]);

  const checkCooldowns = () => {
    const lastWithdraw = localStorage.getItem('lastWithdrawTime');
    if (lastWithdraw) {
      const elapsed = Math.floor((Date.now() - parseInt(lastWithdraw)) / 1000);
      if (elapsed < 30) {
        setWithdrawCooldown(30 - elapsed);
      }
    }

    const lastRedeem = localStorage.getItem('lastRedeemTime');
    if (lastRedeem) {
      const elapsed = Math.floor((Date.now() - parseInt(lastRedeem)) / 1000);
      if (elapsed < 600) {
        setRedeemCooldown(600 - elapsed);
      }
    }
  };

  const startWithdrawCooldown = () => {
    localStorage.setItem('lastWithdrawTime', Date.now().toString());
    setWithdrawCooldown(30);
  };

  const startRedeemCooldown = () => {
    localStorage.setItem('lastRedeemTime', Date.now().toString());
    setRedeemCooldown(600);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">


      <Card className="mb-6 bg-background/80 backdrop-blur-sm text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold text-[#C1B66D]">₦{walletBalance}</div>
          <p className="text-xs text-muted-foreground">Available Balance</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <FundWalletDialog />
        <WithdrawDialog 
          setWalletBalance={setWalletBalance} 
          walletBalance={walletBalance} 
          banks={banks} 
          onWithdrawalComplete={() => {
            fetchWalletData();
            startWithdrawCooldown();
          }} 
          isWithdrawalServiceAvailable={true}
          cooldown={withdrawCooldown}
        />
        <TransferDialog walletBalance={walletBalance} onTransferComplete={fetchWalletData} />
        <GiveawayDialog 
          setWalletBalance={setWalletBalance} 
          walletBalance={walletBalance} 
          onRedeemComplete={fetchWalletData}
          redeemCooldown={redeemCooldown}
          onRedeemSuccess={startRedeemCooldown}
        />
      </div>

      <Card className="bg-transparent shadow-none">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
              <TabsTrigger value="redeems">Redeems</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <TransactionItem key={tx.id} transaction={tx} />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No transactions yet.</p>
              )}
              <div className="flex justify-center items-center gap-4 mt-4">
                <Button 
                  onClick={() => setCurrentPage(prev => prev - 1)} 
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span>Page {currentPage} of {Math.ceil(totalTransactions / transactionsPerPage)}</span>
                <Button 
                  onClick={() => setCurrentPage(prev => prev + 1)} 
                  disabled={currentPage === Math.ceil(totalTransactions / transactionsPerPage)}
                >
                  Next
                </Button>
              </div>
            </TabsContent>
                        <TabsContent value="earnings">
              {transactions
                .filter((tx) => tx.type === 'Deposit' || tx.type === 'Transfer In')
                .map((tx) => (
                  <TransactionItem key={tx.id} transaction={tx} />
                ))}
            </TabsContent>
            <TabsContent value="withdrawals">
              {transactions
                .filter((tx) => tx.type === 'Withdrawal' || tx.type === 'Transfer Out')
                .map((tx) => (
                  <TransactionItem key={tx.id} transaction={tx} />
                ))}
            </TabsContent>
            <TabsContent value="redeems">
              {(() => {
                const redeemTransactions = transactions.filter(
                  (tx) => tx.type === 'Giveaway Redeemed'
                );
                return redeemTransactions.length > 0 ? (
                  redeemTransactions.map((tx) => (
                    <TransactionItem key={tx.id} transaction={tx} />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No redeem transactions yet.
                  </p>
                );
              })()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Wallet;
