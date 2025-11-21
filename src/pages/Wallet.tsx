import React, { useState, useEffect } from 'react';
import ReceiptDialog from '@/components/ReceiptDialog';
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

const MIN_DEPOSIT_AMOUNT = 500;

const TransactionItem = ({ transaction, onClick, isFetching }) => (
  <div 
    className={`flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm rounded-lg mb-2 ${isFetching ? 'cursor-wait' : 'cursor-pointer'}`}
    onClick={!isFetching ? onClick : undefined}
  >
    <div className="flex items-center gap-4">
      {isFetching ? (
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      ) : (
        renderTransactionIcon(transaction.type)
      )}
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

const GiveawayDialog = ({ setWalletBalance, walletBalance, onRedeemComplete, redeemCooldown, onRedeemSuccess, onGiveawayComplete }) => {
    const { profile } = useAuth();
    const { toast } = useToast();
    // Allow any authenticated player to create/redeem giveaways
    const isAuthenticated = Boolean(profile?.id);
  
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
        if (open && isAuthenticated) {
            fetchMyGiveaways();
        }
    }, [open, isAuthenticated]);

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

        if (totalCost > Number(walletBalance)) {
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

            // Handle non-2xx responses from the edge function gracefully
            if (error) {
                console.error('Create giveaway error (edge function):', error);
                const friendly = error?.message || 'Failed to create giveaway';
                toast({ title: 'Error', description: friendly, variant: 'destructive' });
                return;
            }

            // edge function returns success payload
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
            
            // Refresh wallet balance and show receipt
            setWalletBalance(prev => (Number(prev) - totalCost).toFixed(2));
            await fetchMyGiveaways();
            onGiveawayComplete?.(data.transaction);
        } catch (error: any) {
            console.error('Error creating giveaway:', error);
            toast({
                title: "Error",
                description: error?.message || "Failed to create giveaway",
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
            // Map server-side messages or structured error payloads to friendlier, specific client messages
            const mapRedeemResult = (input: any) => {
                // input may be a string, an object like { message } or { error }, or a structured payload
                let msg = '';
                if (typeof input === 'string') msg = input;
                else if (input?.message) msg = input.message;
                else if (input?.error) msg = input.error;
                else msg = String(input || '');

                const base = (msg || '').toString();

                switch (base) {
                    case 'Invalid code':
                        return {
                            title: 'Invalid Code',
                            description: 'The code you entered is invalid. Please check and try again.',
                            variant: 'destructive',
                        };
                    case 'Code already redeemed': {
                        // Include extra context when available
                        const redeemedBy = input?.redeemed_by || input?.redeemedBy;
                        const redeemedAt = input?.redeemed_at || input?.redeemedAt;
                        const extra = redeemedBy ? ` It was redeemed${redeemedAt ? ` on ${new Date(redeemedAt).toLocaleString()}` : ''} by ${redeemedBy}.` : '';
                        return {
                            title: 'Code Already Used',
                            description: `This code has already been redeemed.${extra} If you believe this is a mistake, contact support.`,
                            variant: 'warning',
                        };
                    }
                    case 'Code expired':
                        return {
                            title: 'Code Expired',
                            description: 'This code has expired and can no longer be redeemed.',
                            variant: 'warning',
                        };
                    default:
                        return {
                            title: 'Redemption Failed',
                            description: msg || 'Redemption failed. Please try again.',
                            variant: 'destructive',
                        };
                }
            };
            const { data: { session } } = await supabase.auth.getSession();
            const { data, error } = await supabase.functions.invoke('redeem-giveaway', {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                },
                body: {
                    code: redeemCode.trim().toUpperCase(),
                },
            });

            // If the edge function returned a transport-level error (non-2xx), try to extract friendly message
            if (error) {
                console.error('Redeem edge function error:', error);
                // Supabase FunctionsHttpError often contains the function response under error.context.json
                let errJson: any = error?.context?.json;
                // In some clients this may be a function (Response.json), so call it to get the parsed body
                if (typeof errJson === 'function') {
                    try {
                        errJson = await errJson();
                    } catch (e) {
                        console.warn('Failed to call error.context.json()', e);
                        errJson = null;
                    }
                }

                const mapped = mapRedeemResult(errJson ?? error?.message ?? error);
                toast({ title: mapped.title, description: mapped.description, variant: mapped.variant as any });
                return;
            }

            // Server returns { success: boolean, message?, amount?, new_balance? }

            if (!data?.success) {
                const mapped = mapRedeemResult(data);
                toast({ title: mapped.title, description: mapped.description, variant: mapped.variant as any });
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
            setWalletBalance(Number(data.new_balance).toFixed(2));
            onRedeemSuccess?.();
            setOpen(false);
            onRedeemComplete?.();
        } catch (error: any) {
            console.error('Error redeeming code:', error);
            toast({ title: 'Error', description: error?.message || 'Failed to redeem code', variant: 'destructive' });
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
                            {isAuthenticated 
                                ? 'Create, view, or redeem giveaway codes.' 
                                : 'Enter a code to instantly credit your wallet.'}
                        </DialogDescription>
                    </DialogHeader>

                    {isAuthenticated ? (
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
                                                Your balance: ₦{Number(walletBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [withdrawalAllowed, setWithdrawalAllowed] = useState<boolean | null>(null);
    const { toast } = useToast();

    const IDEMP_PREFIX = 'withdraw_idempotency_';

    const getPersistedIdempotency = (userId: string | undefined) => {
        try {
            const key = `${IDEMP_PREFIX}${userId || 'anon'}`;
            const raw = localStorage.getItem(key);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed?.key || !parsed?.ts) return null;
            // Accept persisted key for up to 12 hours
            if (Date.now() - parsed.ts > 12 * 60 * 60 * 1000) {
                localStorage.removeItem(key);
                return null;
            }
            return parsed.key as string;
        } catch (e) {
            console.warn('Failed to read persisted idempotency key', e);
            return null;
        }
    };

    const persistIdempotency = (userId: string | undefined, keyValue: string) => {
        try {
            const key = `${IDEMP_PREFIX}${userId || 'anon'}`;
            localStorage.setItem(key, JSON.stringify({ key: keyValue, ts: Date.now() }));
        } catch (e) {
            console.warn('Failed to persist idempotency key', e);
        }
    };

    const removePersistedIdempotency = (userId: string | undefined) => {
        try {
            const key = `${IDEMP_PREFIX}${userId || 'anon'}`;
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('Failed to remove persisted idempotency key', e);
        }
    };

    useEffect(() => {
        if (profile?.banking_info) {
            setAccountName(profile.banking_info.account_name || '');
            setAccountNumber(profile.banking_info.account_number || '');
            setBankCode(profile.banking_info.bank_code || '');
            setBankName(profile.banking_info.bank_name || '');
        }
    }, [profile]);

    // Check with server whether withdrawals are allowed today for the user's region
    useEffect(() => {
        let mounted = true;
        const check = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const { data, error } = await supabase.functions.invoke('paystack-transfer', {
                    headers: { Authorization: `Bearer ${session?.access_token}` },
                    body: { endpoint: 'check-withdrawal-availability' },
                });

                if (!mounted) return;
                if (error) {
                    console.warn('Could not check withdrawal availability, defaulting to allowed', error);
                    setWithdrawalAllowed(true);
                    return;
                }

                // data may be { allowed: boolean, weekday, timezone }
                setWithdrawalAllowed(Boolean(data?.allowed));
            } catch (err) {
                console.warn('Error checking withdrawal availability:', err);
                setWithdrawalAllowed(true);
            }
        };
        check();
        return () => { mounted = false; };
    }, [profile?.id]);

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
        if (amount < 500) {
            console.error("Validation failed: Amount less than 500.");
            toast({
                title: "Minimum Withdrawal",
                description: "Minimum withdrawal amount is ₦500",
                variant: "destructive",
            });
            return;
        }
        if (amount > 30000) {
            console.error("Validation failed: Amount greater than 30000.");
            toast({
                title: "Maximum Withdrawal",
                description: "Maximum withdrawal amount is ₦30,000",
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
        // Prevent duplicate submissions from multiple clicks
        if (isSubmitting) {
            console.warn('Withdraw already in progress, ignoring duplicate submit');
            return;
        }
        setIsSubmitting(true);
        // Close dialog immediately so the UI responds to the user's click
        setOpen(false);

        try {
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
        // Try to reuse a recent persisted idempotency key (helps survive reloads/retries)
        let idempotencyKey = getPersistedIdempotency(profile?.id);
        if (!idempotencyKey) {
            idempotencyKey = `withdraw-${profile?.id || 'anon'}-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
            persistIdempotency(profile?.id, idempotencyKey);
        }

        const transferPayload = {
            endpoint: 'initiate-transfer',
            amount,
            recipient_code: recipientData.data.recipient_code,
            idempotency_key: idempotencyKey,
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
            
            // Try to extract structured JSON returned by the edge function (it may be in transferError.context.json)
            let payload: any = transferData ?? null;
            try {
                if (transferError?.context?.json) payload = transferError.context.json;
                if (typeof payload === 'function') {
                    try { payload = await payload(); } catch (e) { console.warn('Failed to parse transferError.context.json()', e); payload = null; }
                }
            } catch (e) {
                // ignore
            }

            const errorCode = payload?.error;
            const errorMessage = payload?.message || transferError?.message || 'An unexpected error occurred';

            if (errorCode === 'insufficient_paystack_balance') {
                toast({
                    title: "Withdrawal Service Unavailable",
                    description: "We are currently unable to process withdrawals. Please try again later. Our team has been notified.",
                    variant: "destructive",
                });
            } else if (errorCode === 'failed_to_update_wallet') {
                // Edge case: the transfer likely succeeded with Paystack but DB update failed
                toast({
                    title: "Withdrawal Processing",
                    description: "Your withdrawal was processed but we couldn't update your wallet immediately. Our team has been notified and will reconcile this shortly.",
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
        
        // Reset form
        setAmount(0);
        setNotes('');
        // Note: dialog already closed earlier
        
        // Show success message
        toast({
            title: "Withdrawal Submitted",
            description: `Your request to withdraw ₦${amount.toLocaleString()} has been submitted successfully. Funds will be sent to your account shortly.`,
        });
        
        // Refresh wallet data from database and show receipt
        onWithdrawalComplete?.(transferData.transaction);
        // Successful transfer: remove persisted idempotency key so retries generate a fresh key
        removePersistedIdempotency(profile?.id);
        console.log("Withdrawal process finished.");
        } catch (err: any) {
            console.error('Withdrawal error:', err);
            toast({ title: 'Withdrawal Failed', description: err?.message || 'An unexpected error occurred', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {isWithdrawalServiceAvailable && withdrawalAllowed !== false ? (
                <DialogTrigger asChild>
                    <Button 
                        variant="outline" 
                        className="w-full h-24 flex flex-col items-center justify-center"
                        disabled={cooldown > 0}
                    >
                        <ArrowDown className="h-8 w-8 mb-2" />
                        {cooldown > 0 
                            ? `Cooldown: ${Math.floor(cooldown / 3600)}h ${Math.floor((cooldown % 3600) / 60)}m`
                            : 'Withdraw'}
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
                            <p>Withdrawals are currently unavailable.</p>
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
                            {amount > 0 ? (
                                <>
                                    A fee of ₦{(amount * 0.04).toFixed(2)} (4%) will be deducted from the withdrawal.
                                    <div className="text-sm text-muted-foreground mt-1">
                                        You will receive ₦{(amount * 0.96).toFixed(2)} after fees.
                                    </div>
                                </>
                            ) : (
                                'A fee of 4% will be deducted for this transaction.'
                            )}
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
                    <Button 
                        onClick={handleWithdraw}
                        disabled={cooldown > 0 || isSubmitting}
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {cooldown > 0 
                            ? `Wait ${Math.floor(cooldown / 3600)}h ${Math.floor((cooldown % 3600) / 60)}m ${cooldown % 60}s`
                            : (isSubmitting ? 'Processing...' : 'Submit Withdrawal')}
                    </Button>
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

            const { data, error } = await supabase.functions.invoke('transfer-funds', {
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
            
            // Trigger wallet refresh and show receipt
            onTransferComplete?.(data.transaction);
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
                            {amount > 0 ? (
                                <>
                                    A flat fee of ₦50 will be deducted from transfers.
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Recipient will receive ₦{(Math.max(0, amount - 50)).toFixed(2)} after fees.
                                    </div>
                                </>
                            ) : (
                                'A flat fee of ₦50 will be deducted for this transaction.'
                            )}
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
        // Validate amount is a valid number
        if (isNaN(amount) || amount < MIN_DEPOSIT_AMOUNT) {
            toast({
                title: 'Minimum Deposit',
                description: `Minimum deposit amount is ₦${MIN_DEPOSIT_AMOUNT}`,
                variant: 'destructive',
            });
            return;
        }

        // Guard: ensure public key is configured
        const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';
        if (!publicKey) {
            toast({
                title: 'Payment Unavailable',
                description: 'Paystack is not configured. Please contact support or try again later.',
                variant: 'destructive',
            });
            return;
        }

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
                        <Label htmlFor="amount">Amount (Minimum: ₦{MIN_DEPOSIT_AMOUNT})</Label>
                                                <Input
                                                    id="amount"
                                                    type="number"
                                                    placeholder={`₦${MIN_DEPOSIT_AMOUNT}.00`}
                                                    value={amount === 0 ? '' : amount}
                                                    onChange={(e) => {
                                                        const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                                        setAmount(isNaN(value) ? 0 : value);
                                                    }}
                                                    min={MIN_DEPOSIT_AMOUNT}
                                                />
                                            </div>
                                            <Alert>
                                                <Coins className="h-4 w-4" />
                                                <AlertTitle>Transaction Fee</AlertTitle>
                                                <AlertDescription>
                                                    {amount > 0 ? (
                                                        <>
                                                            {(() => {
                                                                const fee = Number((amount * 0.04).toFixed(2));
                                                                const net = Number((amount - fee).toFixed(2));
                                                                return (
                                                                    <>
                                                                        A fee of ₦{fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (4%) will be deducted.
                                                                        <div className="text-sm text-muted-foreground mt-1">
                                                                            You will receive ₦{net.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} after fees.
                                                                        </div>
                                                                    </>
                                                                );
                                                            })()}
                                                        </>
                                                    ) : (
                                                        `A fee of 4% will be deducted for this transaction. Minimum deposit is ₦${MIN_DEPOSIT_AMOUNT}.`
                                                    )}
                                                </AlertDescription>
                                            </Alert>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handlePayment} disabled={!user || !profile || isNaN(amount) || amount < MIN_DEPOSIT_AMOUNT || isLoading}>
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
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [fetchingTransactionId, setFetchingTransactionId] = useState<string | null>(null);
  
  const WITHDRAW_COOLDOWN_SECONDS = 43200; // 12 hours
    const REDEEM_COOLDOWN_SECONDS = 60; // 60 seconds

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
                  setWalletBalance(Math.round(Number(walletData.balance) * 100) / 100 || 0);      }

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
              id: tx.id, // This is the transaction ID from the database
              description: `${description} - ${tx.status}`,
              date: new Date(tx.created_at).toLocaleDateString(),
              amount: isDebit ? -Number(tx.amount) : Number(tx.amount),
              type: typeMapping[tx.type] || 'Other',
              originalTx: tx // Keep the original transaction for receipt generation
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
    const withdrawCooldownEnd = localStorage.getItem('withdrawCooldownEnd');
    if (withdrawCooldownEnd) {
      const remaining = Math.floor((parseInt(withdrawCooldownEnd) - Date.now()) / 1000);
      if (remaining > 0) {
        setWithdrawCooldown(remaining);
      }
    }

    const redeemCooldownEnd = localStorage.getItem('redeemCooldownEnd');
    if (redeemCooldownEnd) {
      const remaining = Math.floor((parseInt(redeemCooldownEnd) - Date.now()) / 1000);
      if (remaining > 0) {
        setRedeemCooldown(remaining);
      }
    }
  };

  const startWithdrawCooldown = () => {
    const cooldownEnd = Date.now() + (WITHDRAW_COOLDOWN_SECONDS * 1000);
    localStorage.setItem('withdrawCooldownEnd', cooldownEnd.toString());
    setWithdrawCooldown(WITHDRAW_COOLDOWN_SECONDS);
  };

  const startRedeemCooldown = () => {
    const cooldownEnd = Date.now() + (REDEEM_COOLDOWN_SECONDS * 1000);
    localStorage.setItem('redeemCooldownEnd', cooldownEnd.toString());
    setRedeemCooldown(REDEEM_COOLDOWN_SECONDS);
  };

  const [isFetchingReceipt, setIsFetchingReceipt] = useState(false);

  const handleViewReceipt = async (transactionId: string) => {
    setFetchingTransactionId(transactionId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: "Error", description: "Authentication required to view receipt.", variant: "destructive" });
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-receipt', {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
        body: { transaction_id: transactionId },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Supabase edge function returns the receipt data directly
      if (data) {
        setSelectedTransaction(data);
        setShowReceiptDialog(true);
      } else {
        toast({ title: "Error", description: "Failed to retrieve receipt.", variant: "destructive" });
      }

    } catch (err: any) {
      console.error('Error fetching receipt:', err);
      toast({ title: "Error", description: err.message || "An error occurred while fetching the receipt.", variant: "destructive" });
    } finally {
      setFetchingTransactionId(null);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">


      <Card className="mb-6 bg-background/80 backdrop-blur-sm text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold text-primary">₦{Number(walletBalance).toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Available Balance</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <FundWalletDialog />
                <WithdrawDialog 
                    setWalletBalance={setWalletBalance} 
                    walletBalance={walletBalance} 
                    banks={banks} 
                    onWithdrawalComplete={(transaction) => {
                        fetchWalletData();
                        startWithdrawCooldown();
                        if (transaction) {
                            handleViewReceipt(transaction.id);
                        }
                    }} 
                    isWithdrawalServiceAvailable={true}
                    cooldown={withdrawCooldown}
                />
        <TransferDialog walletBalance={walletBalance} onTransferComplete={(transaction) => {
            fetchWalletData();
            if (transaction) {
                handleViewReceipt(transaction.id);
            }
        }} />
        <GiveawayDialog 
          setWalletBalance={setWalletBalance} 
          walletBalance={walletBalance} 
          onRedeemComplete={fetchWalletData}
          redeemCooldown={redeemCooldown}
          onRedeemSuccess={startRedeemCooldown}
          onGiveawayComplete={(transaction) => {
            fetchWalletData();
            if (transaction) {
                handleViewReceipt(transaction.id);
            }
          }}
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
                  <TransactionItem 
                    key={tx.id} 
                    transaction={tx} 
                    onClick={() => handleViewReceipt(tx.originalTx.id)} 
                    isFetching={fetchingTransactionId === tx.originalTx.id}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No transactions yet.</p>
              )}
              <div className="flex justify-center items-center gap-4 mt-4">
                <Button 
                  onClick={() => setCurrentPage(prev => prev - 1)} 
                  disabled={currentPage === 1 || !!fetchingTransactionId}
                >
                  Previous
                </Button>
                <span>Page {currentPage} of {Math.ceil(totalTransactions / transactionsPerPage)}</span>
                <Button 
                  onClick={() => setCurrentPage(prev => prev + 1)} 
                  disabled={currentPage === Math.ceil(totalTransactions / transactionsPerPage) || !!fetchingTransactionId}
                >
                  Next
                </Button>
              </div>
            </TabsContent>
                        <TabsContent value="earnings">
              {transactions
                .filter((tx) => tx.type === 'Deposit' || tx.type === 'Transfer In')
                .map((tx) => (
                  <TransactionItem 
                    key={tx.id} 
                    transaction={tx} 
                    onClick={() => handleViewReceipt(tx.originalTx.id)} 
                    isFetching={fetchingTransactionId === tx.originalTx.id}
                  />
                ))}
            </TabsContent>
            <TabsContent value="withdrawals">
              {transactions
                .filter((tx) => tx.type === 'Withdrawal' || tx.type === 'Transfer Out')
                .map((tx) => (
                  <TransactionItem 
                    key={tx.id} 
                    transaction={tx} 
                    onClick={() => handleViewReceipt(tx.originalTx.id)} 
                    isFetching={fetchingTransactionId === tx.originalTx.id}
                  />
                ))}
            </TabsContent>
            <TabsContent value="redeems">
              {(() => {
                const redeemTransactions = transactions.filter(
                  (tx) => tx.type === 'Giveaway Redeemed'
                );
                return redeemTransactions.length > 0 ? (
                  redeemTransactions.map((tx) => (
                    <TransactionItem 
                      key={tx.id} 
                      transaction={tx} 
                      onClick={() => handleViewReceipt(tx.originalTx.id)} 
                      isFetching={fetchingTransactionId === tx.originalTx.id}
                    />
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

      {showReceiptDialog && selectedTransaction && (
        <ReceiptDialog
          transaction={selectedTransaction}
          onClose={() => setShowReceiptDialog(false)}
        />
      )}
    </div>
  );
};

export default Wallet;
