
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  isActive,
  isCollapsed,
  onClick
}) => {
  return (
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      onClick={onClick}
      className={`w-full justify-start text-left ${
        isCollapsed ? 'px-2 justify-center' : 'px-3'
      } ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
    >
      <Icon className={`w-4 h-4 ${isCollapsed ? '' : 'mr-2'}`} />
      {!isCollapsed && <span>{label}</span>}
    </Button>
  );
};
