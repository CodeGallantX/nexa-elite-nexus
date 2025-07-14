
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showSidebar = false }) => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated || !showSidebar) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Mobile Sidebar Trigger */}
      {isMobile && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="mobile-sidebar-trigger"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {(!isMobile || isSidebarOpen) && <Sidebar />}
      
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
