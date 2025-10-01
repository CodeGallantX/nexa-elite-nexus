import { FC } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

const Statistics: FC = () => {
  const { profile } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Player Statistics {profile?.role === 'beta_player' && <Badge className="ml-2">Beta</Badge>}</h1>
      <p>This page is under construction. Check back later for exciting new features!</p>
    </div>
  );
};

export default Statistics;