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
      return (
        <div className="p-2 rounded-full bg-green-500/20 backdrop-blur-sm">
          <ArrowDown className="h-8 w-8 text-green-500" />
        </div>
      );
    case 'Withdrawal':
    case 'Transfer Out':
      return (
        <div className="p-2 rounded-full bg-red-500/20 backdrop-blur-sm">
          <ArrowUp className="h-8 w-8 text-red-500" />
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

const GiveawayDialog = ({ setWalletBalance, walletBalance }) => {
    const { profile } = useAuth();
    const { toast } = useToast();
    const isClanMaster = profile?.role === 'clan_master';
  
    const [amount, setAmount] = useState('');
    const [quantity, setQuantity] = useState('');
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isCodesDialogOpen, setIsCodesDialogOpen] = useState(false);
    const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
    const [redeemCode, setRedeemCode] = useState('');

    const [activeGiveaways, setActiveGiveaways] = useState([]);

    const handleRedeem = () => {
        toast({
            title: "Code Redeemed!",
            description: `You have successfully redeemed code: ${redeemCode}`,
        });
        setRedeemCode('');
    }

    const handlePublishGiveaway = async () => {
        toast({
            title: "Giveaway Published!",
            description: "The giveaway codes have been sent to all players.",
        });
        setIsCodesDialogOpen(false);
    };

    const handleCreateGiveaway = () => {
        const totalCost = Number(amount) * Number(quantity);
        if (totalCost > walletBalance) {
            toast({
                title: "Insufficient funds",
                description: "You do not have enough funds in your wallet to create this giveaway.",
                variant: "destructive",
            });
            return;
        }
        setWalletBalance(prev => prev - totalCost);
        const codes = Array.from({ length: Number(quantity) }, () => Math.floor(100000 + Math.random() * 900000).toString());
        setGeneratedCodes(codes);
        setIsConfirmDialogOpen(false);
        setIsCodesDialogOpen(true);

        const newGiveaway = {
            id: activeGiveaways.length + 1,
            type: 'Cash',
            amount: Number(amount),
            quantity: Number(quantity),
            createdBy: profile?.ign || 'Unknown',
        };
        setActiveGiveaways([...activeGiveaways, newGiveaway]);
    }
  
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
                    <Gift className="h-8 w-8 mb-2" />
                    Giveaway
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Giveaway</DialogTitle>
                    <DialogDescription>This is a simplified giveaway dialog.</DialogDescription>
                </DialogHeader>
                <p>Content goes here.</p>
            </DialogContent>
        </Dialog>
    )
}

const WithdrawDialog = ({ setWalletBalance, walletBalance, banks, onWithdrawalComplete }) => {
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

        const { data: recipientData, error: recipientError } = await supabase.functions.invoke('paystack-transfer', {
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
            body: transferPayload,
        });

        if (transferError || !transferData.status) {
            console.error("Error initiating transfer:", transferError || transferData);
            
            // Show user-friendly error message
            const errorMessage = transferData?.message || transferData?.error || transferError?.message || "An unexpected error occurred";
            
            toast({
                title: "Withdrawal Failed",
                description: errorMessage,
                variant: "destructive",
            });
            return;
        }

        console.log("Transfer initiated successfully:", transferData);
        
        // Update local balance
        setWalletBalance(prev => prev - amount);
        
        // Reset form and close dialog
        setAmount(0);
        setNotes('');
        setOpen(false);
        
        // Show success message
        toast({
            title: "Withdrawal Submitted",
            description: `Your request to withdraw ₦${amount.toLocaleString()} has been submitted successfully. Funds will be sent to your account shortly.`,
        });
        onWithdrawalComplete?.();
        console.log("Withdrawal process finished.");
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
                    <ArrowDown className="h-8 w-8 mb-2" />
                    Withdraw
                </Button>
            </DialogTrigger>
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
            const { error } = await supabase.functions.invoke('transfer-funds', {
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
                </div>
                <DialogFooter>
                    <Button onClick={handlePayment} disabled={!user || !profile || amount <= 0 || isLoading || !import.meta.env.VITE_PAYSTACK_PUBLIC_KEY}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Fund with Paystack
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const Wallet: React.FC = () => {
  const { profile, user } = useAuth();
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [banks, setBanks] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchWalletData = async () => {
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
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .eq('wallet_id', walletIdData.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (transactionsError) {
          console.error('Error fetching transactions:', transactionsError);
        } else if (transactionsData) {
          setTransactions(transactionsData.map(tx => ({
            id: tx.id,
            description: `${tx.type} - ${tx.status}`,
            date: new Date(tx.created_at).toLocaleDateString(),
            amount: tx.type === 'transfer_out' || tx.type === 'withdrawal' ? -Number(tx.amount) : Number(tx.amount),
            type: tx.type === 'deposit' ? 'Deposit' : tx.type === 'withdrawal' ? 'Withdrawal' : tx.type === 'transfer_in' ? 'Transfer In' : 'Transfer Out'
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [user?.id]);

  useEffect(() => {
    const fetchBanks = async () => {
      const { data, error } = await supabase.functions.invoke('get-banks');
      if (data?.status && data?.data) {
        setBanks(data.data);
      }
    };
    fetchBanks();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Alert className="mb-6 bg-yellow-100 border-yellow-400 text-yellow-700">
        <Shield className="h-4 w-4 text-yellow-500" />
        <AlertTitle>Wallet Feature in Beta</AlertTitle>
        <AlertDescription>
          This feature is currently under development. Some functionalities may not work as expected.
        </AlertDescription>
      </Alert>

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
        <WithdrawDialog setWalletBalance={setWalletBalance} walletBalance={walletBalance} banks={banks} onWithdrawalComplete={fetchWalletData} />
        <TransferDialog walletBalance={walletBalance} onTransferComplete={fetchWalletData} />
        <GiveawayDialog setWalletBalance={setWalletBalance} walletBalance={walletBalance} />
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
              {/* No redeem transactions yet */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Wallet;