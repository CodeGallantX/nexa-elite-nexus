
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Shield, Coins, ArrowDown, ArrowUp, Gift, Award } from 'lucide-react';



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

const Wallet: React.FC = () => {
  const { profile } = useAuth();
  const [walletBalance, setWalletBalance] = useState(350000);
  const [isFundWalletDialogOpen, setIsFundWalletDialogOpen] = useState(false);
  const [fundingAmount, setFundingAmount] = useState(0);
  const transactions = [
    { id: 1, type: 'Earnings', description: 'Scrim victory bonus', amount: 50, date: '2025-10-19' },
    { id: 2, type: 'Withdrawals', description: 'Withdrawal to bank', amount: -200, date: '2025-10-18' },
    { id: 3, type: 'Redeems', description: 'Redeemed gift card', amount: 25, date: '2025-10-17' },
    { id: 4, type: 'Earnings', description: 'Tournament prize', amount: 500, date: '2025-10-15' },
    { id: 5, type: 'Send Reward', description: 'Reward to player "Ninja"', amount: -50, date: '2025-10-14' },
  ];

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
        {profile?.role === 'clan_master' && (
          <Button
            variant="outline"
            className="w-full h-24 flex flex-col items-center justify-center"
            onClick={() => setIsFundWalletDialogOpen(true)}
          >
            <Coins className="h-8 w-8 mb-2" />
            Fund Wallet
          </Button>
        )}
        {profile?.role !== 'clan_master' && (
          <Link to="/wallet/redeem-code">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
              <Gift className="h-8 w-8 mb-2" />
              Redeem Code
            </Button>
          </Link>
        )}
        <Link to="/wallet/withdraw">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
            <ArrowDown className="h-8 w-8 mb-2" />
            Withdraw
          </Button>
        </Link>
        <Link to="/wallet/send-cash">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
            <ArrowUp className="h-8 w-8 mb-2" />
            Send Cash
          </Button>
        </Link>

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
              {transactions.map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} />
              ))}
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

      <Dialog open={isFundWalletDialogOpen} onOpenChange={setIsFundWalletDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fund Wallet</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="number"
              placeholder="Enter amount"
              value={fundingAmount}
              onChange={(e) => setFundingAmount(Number(e.target.value))}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFundWalletDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              setWalletBalance(walletBalance + fundingAmount);
              setIsFundWalletDialogOpen(false);
            }}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wallet;
