import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Shield, Coins, ArrowDown, ArrowUp, Gift, Award, ArrowUpDown, Copy, Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
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
    case 'Earnings':
      return <Award className="h-8 w-8 text-green-500" />;
    case 'Withdrawals':
      return <ArrowDown className="h-8 w-8 text-red-500" />;
    case 'Redeems':
      return <Gift className="h-8 w-8 text-blue-500" />;
    case 'Send Reward':
      return <ArrowUp className="h-8 w-8 text-yellow-500" />;
    default:
      return <Coins className="h-8 w-8 text-gray-500" />;
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
        // Add logic to redeem the code
        toast({
            title: "Code Redeemed!",
            description: `You have successfully redeemed code: ${redeemCode}`,
        });
        setRedeemCode('');
    }

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
                {isClanMaster ? (
                    <Tabs defaultValue="create-giveaway">
                        <TabsList>
                            <TabsTrigger value="active-giveaways">Active Giveaways</TabsTrigger>
                            <TabsTrigger value="create-giveaway">Create Giveaway</TabsTrigger>
                        </TabsList>
                        <TabsContent value="active-giveaways">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {activeGiveaways.map((giveaway) => (
                                <Card key={giveaway.id}>
                                    <CardHeader>
                                    <CardTitle>Cash Giveaway</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                    <p>Amount: {giveaway.amount}</p>
                                    <p>Quantity: {giveaway.quantity}</p>
                                    <p>Created by: {giveaway.createdBy}</p>
                                    </CardContent>
                                </Card>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="create-giveaway">
                            <Card className="max-w-md mx-auto">
                                <CardHeader>
                                    <CardTitle>Create a New Giveaway</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="amount">Amount per person</Label>
                                            <Input
                                                id="amount"
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="Enter amount"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="quantity">Quantity</Label>
                                            <Input
                                                id="quantity"
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(e.target.value)}
                                                placeholder="Enter quantity"
                                            />
                                        </div>
                                        <Button disabled={!amount || !quantity} onClick={() => setIsConfirmDialogOpen(true)}>Create Giveaway</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                ) : (
                    <div>
                        <DialogHeader>
                            <DialogTitle>Redeem Code</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <Input 
                                placeholder="Enter your code"
                                value={redeemCode}
                                onChange={(e) => setRedeemCode(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <Button onClick={handleRedeem}>Redeem</Button>
                        </DialogFooter>
                    </div>
                )}

                <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Giveaway Purchase</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <p>You are about to create a giveaway with the following details:</p>
                            <ul>
                                <li>Type: Cash</li>
                                <li>Amount: ₦{amount}</li>
                                <li>Quantity: {quantity}</li>
                            </ul>
                            <p className="font-bold mt-4">Total Cost: ₦{Number(amount) * Number(quantity)}</p>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateGiveaway}>Confirm Purchase</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isCodesDialogOpen} onOpenChange={setIsCodesDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Generated Giveaway Codes</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <p>Share these codes with the players. The first ones to redeem them will get the prize.</p>
                            <div className="grid gap-2 mt-4">
                                {generatedCodes.map((code, index) => (
                                    <div key={index} className="p-2 bg-muted rounded-md">
                                    {code}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCodesDialogOpen(false)}>Close</Button>
                            <Button onClick={async () => {
                                await sendBroadcastPushNotification({
                                    title: "New Giveaway!",
                                    message: `A new giveaway of ₦${amount} has been created for ${quantity} players. First come, first served!`,
                                });
                                toast({
                                    title: "Giveaway Published!",
                                    description: "The giveaway codes have been sent to all players.",
                                });
                                setIsCodesDialogOpen(false);
                            }}>Publish</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </DialogContent>
        </Dialog>
    )
}

const WithdrawDialog = ({ setWalletBalance, walletBalance, banks }) => {
    const { profile } = useAuth();
    const [amount, setAmount] = useState(0);
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [bankCode, setBankCode] = useState('');
    const [notes, setNotes] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        if (profile?.banking_info) {
            setAccountName(profile.banking_info.account_name || '');
            setAccountNumber(profile.banking_info.account_number || '');
            setBankCode(profile.banking_info.bank_code || '');
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
            toast({
                title: "Error initiating transfer",
                description: transferData?.message || transferError?.message || "An error occurred",
                variant: "destructive",
            });
            return;
        }

        console.log("Transfer initiated successfully:", transferData);
        setWalletBalance(prev => prev - amount);
        toast({
            title: "Withdrawal Successful",
            description: `Your request to withdraw ₦${amount} has been submitted.`,
        });
        console.log("Withdrawal process finished.");
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
                    <ArrowDown className="h-8 w-8 mb-2" />
                    Withdraw
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Withdraw</DialogTitle>
                </DialogHeader>
                <div className="py-4 grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="bank">Bank</Label>
                        <Select onValueChange={setBankCode} value={bankCode}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Bank" />
                            </SelectTrigger>
                            <SelectContent>
                                {banks.map(bank => (
                                    <SelectItem key={bank.id} value={bank.code}>
                                        {bank.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                title: "Transfer Successful",
                description: `You have transferred ₦${amount} to ${recipient}`,
            });
            
            // Trigger wallet refresh via callback
            onTransferComplete?.();
        } catch (err) {
            toast({
                title: "Transfer Failed",
                description: err.message || "An unexpected error occurred.",
                variant: "destructive",
            });
        } finally {
            setIsTransferring(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
                    <ArrowUpDown className="h-8 w-8 mb-2" />
                    Transfer
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Transfer</DialogTitle>
                </DialogHeader>
                <div className="py-4 grid gap-4">
                    <div className="grid gap-2">
                        <Label>Recipient</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
                                >
                                    {recipient
                                        ? `${players.find((player) => player.ign === recipient)?.status === 'beta' ? 'Ɲ・乃' : 'Ɲ・乂'}${recipient}`
                                        : "Select a player..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                    <CommandInput placeholder="Search player..." />
                                    <CommandEmpty>No player found.</CommandEmpty>
                                                                                                    <CommandList className="max-h-52">
                                                                                                        <CommandGroup>
                                                                                                            {players && players.map((player) => (
                                                                                                                <CommandItem
                                                                                                                    key={player.id}
                                                                                                                    value={player.ign}
                                                                                                                    onSelect={(currentValue) => {
                                                                                                                        setRecipient(currentValue === recipient ? "" : currentValue)
                                                                                                                        setOpen(false)
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <Check
                                                                                                                        className={`mr-2 h-4 w-4 ${recipient === player.ign ? "opacity-100" : "opacity-0"}`}
                                                                                                                    />
                                                                                                                    {player.status === 'beta' ? 'Ɲ・乃' : 'Ɲ・乂'}{player.ign}
                                                                                                                </CommandItem>
                                                                                                            ))}
                                                                                                        </CommandGroup>
                                                                                                    </CommandList>                                </Command>
                            </PopoverContent>
                        </Popover>
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
                        Transfer
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
            type: tx.type === 'deposit' ? 'Earnings' : tx.type === 'withdrawal' ? 'Withdrawals' : 'Transfer'
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
        {profile?.role === 'clan_master' && <FundWalletDialog />}
        <WithdrawDialog setWalletBalance={setWalletBalance} walletBalance={walletBalance} banks={banks} />
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
            {['earnings', 'withdrawals', 'redeems'].map((tab) => (
              <TabsContent key={tab} value={tab}>
                {transactions
                  .filter((tx) => tx.type.toLowerCase().includes(tab))
                  .map((tx) => (
                    <TransactionItem key={tx.id} transaction={tx} />
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Wallet;