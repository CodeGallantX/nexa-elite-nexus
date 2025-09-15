import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useActivities } from '@/hooks/useActivities';

interface ActivityBadgeProps {
  children: React.ReactNode;
}

export const ActivityBadge: React.FC<ActivityBadgeProps> = ({ children }) => {
  const { data: count = 0 } = useActivities();

  return (
    <div className="relative">
      {children}
      {count > 0 && (
        <Badge 
          className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-none"
        >
          {count > 99 ? '99+' : count}
        </Badge>
      )}
    </div>
  );
};