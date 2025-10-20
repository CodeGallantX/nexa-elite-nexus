import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Giveaway: React.FC = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const isClanMaster = profile?.role === 'clan_master';

  const [giveawayType, setGiveawayType] = useState('airtime');
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCodesDialogOpen, setIsCodesDialogOpen] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);

  const [activeGiveaways, setActiveGiveaways] = useState([]);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Tabs defaultValue={isClanMaster ? 'create-giveaway' : 'active-giveaways'}>
        <TabsList>
          <TabsTrigger value="active-giveaways">Active Giveaways</TabsTrigger>
          {isClanMaster && <TabsTrigger value="create-giveaway">Create Giveaway</TabsTrigger>}
        </TabsList>
        <TabsContent value="active-giveaways">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeGiveaways.map((giveaway) => (
              <Card key={giveaway.id}>
                <CardHeader>
                  <CardTitle>{giveaway.type === 'airtime' ? 'Airtime' : 'Data'} Giveaway</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Amount: {giveaway.amount}</p>
                  <p>Quantity: {giveaway.quantity}</p>
                  <p>Created by: {giveaway.createdBy}</p>
                  {!isClanMaster && <Button className="mt-4 w-full">Participate</Button>}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        {isClanMaster && (
          <TabsContent value="create-giveaway">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Create a New Giveaway</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="giveaway-type">Giveaway Type</Label>
                    <Select onValueChange={setGiveawayType} defaultValue="airtime">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="airtime">Airtime</SelectItem>
                        <SelectItem value="data">Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
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
        )}
      </Tabs>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Giveaway Purchase</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>You are about to create a giveaway with the following details:</p>
            <ul>
              <li>Type: {giveawayType}</li>
              <li>Amount: ₦{amount}</li>
              <li>Quantity: {quantity}</li>
            </ul>
            <p className="font-bold mt-4">Total Cost: ₦{Number(amount) * Number(quantity)}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              // Simulate wallet debit
              const totalCost = Number(amount) * Number(quantity);
              // setWalletBalance(walletBalance - totalCost); // This should be handled in a real app

              // Generate codes
              const codes = Array.from({ length: Number(quantity) }, () => Math.floor(100000 + Math.random() * 900000).toString());
              setGeneratedCodes(codes);
              setIsConfirmDialogOpen(false);
              setIsCodesDialogOpen(true);

              // Add new giveaway to activeGiveaways
              const newGiveaway = {
                id: activeGiveaways.length + 1,
                type: giveawayType,
                amount: Number(amount),
                quantity: Number(quantity),
                createdBy: profile?.ign || 'Unknown',
              };
              setActiveGiveaways([...activeGiveaways, newGiveaway]);
            }}>Confirm Purchase</Button>
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
            <Button onClick={() => {
              // Simulate sending notifications
              toast({
                title: "Giveaway Published!",
                description: "The giveaway codes have been sent to all players.",
              });
              setIsCodesDialogOpen(false);
            }}>Publish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Giveaway;