
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiSelect } from '@/components/ui/multi-select';

import { supabase } from '@/integrations/supabase/client';

const getPlayerPrefix = (status: string) => {
  return status === 'beta' ? 'Ɲ・乃' : 'Ɲ・乂';
};

const SendCash: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [amount, setAmount] = useState('');
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('profiles').select('id, ign, status');
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  const userOptions = users.map(user => ({
    value: user.id.toString(),
    label: `${getPlayerPrefix(user.status)} ${user.ign}`
  }));

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Send Cash</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="user">Select Users</Label>
              <MultiSelect
                options={userOptions}
                selected={selectedUsers}
                onChange={setSelectedUsers}
                className="w-full"
              />
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
            <Button disabled={selectedUsers.length === 0 || !amount}>Send Cash</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SendCash;
