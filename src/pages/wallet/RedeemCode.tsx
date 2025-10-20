import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RedeemCode: React.FC = () => {
  const [code, setCode] = useState('');

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Redeem Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Enter Code</Label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
              />
            </div>
            <Button disabled={!code}>Redeem Code</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RedeemCode;