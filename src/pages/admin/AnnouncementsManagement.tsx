
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Megaphone, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock announcements data
const mockAnnouncements = [
  {
    id: '1',
    title: '🏆 Championship Tournament Starting Soon!',
    message: 'Get ready for the ultimate battle! Our clan championship tournament begins this weekend. Top 10 players will receive exclusive rewards and recognition.',
    author: 'GhostAlpha',
    createdAt: '2024-07-14T10:00:00Z',
    scheduledFor: null,
    isVisible: true,
    isPinned: true,
    expiresAt: '2024-07-20T23:59:59Z',
    views: 245
  },
  {
    id: '2',
    title: '📋 New Scrim Schedule',
    message: 'Updated training schedule for the week. Check your assignments and make sure to attend your designated scrims.',
    author: 'GhostAlpha',
    createdAt: '2024-07-13T15:30:00Z',
    scheduledFor: null,
    isVisible: true,
    isPinned: false,
    expiresAt: null,
    views: 189
  },
  {
    id: '3',
    title: '🎮 Device Requirements Update',
    message: 'All clan members must ensure their gaming devices meet the minimum requirements for competitive play.',
    author: 'GhostAlpha',
    createdAt: '2024-07-12T12:00:00Z',
    scheduledFor: null,
    isVisible: false,
    isPinned: false,
    expiresAt: '2024-07-15T23:59:59Z',
    views: 156
  }
];

export const AdminAnnouncementsManagement: React.FC = () => {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    scheduledFor: '',
    expiresAt: '',
    isPinned: false,
    isVisible: true
  });

  const getStatusColor = (announcement: any) => {
    if (!announcement.isVisible) return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    if (announcement.isPinned) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-green-500/20 text-green-400 border-green-500/50';
  };

  const getStatusText = (announcement: any) => {
    if (!announcement.isVisible) return 'Hidden';
    if (announcement.isPinned) return 'Pinned';
    return 'Active';
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'visible' && announcement.isVisible) ||
      (statusFilter === 'hidden' && !announcement.isVisible) ||
      (statusFilter === 'pinned' && announcement.isPinned);
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateAnnouncement = () => {
    const announcementId = Date.now().toString();
    const announcement = {
      ...newAnnouncement,
      id: announcementId,
      author: 'GhostAlpha',
      createdAt: new Date().toISOString(),
      views: 0
    };

    setAnnouncements(prev => [announcement, ...prev]);
    setNewAnnouncement({
      title: '',
      message: '',
      scheduledFor: '',
      expiresAt: '',
      isPinned: false,
      isVisible: true
    });
    setIsCreateDialogOpen(false);

    toast({
      title: "Announcement Created",
      description: "Your announcement has been published successfully.",
    });
  };

  const handleDeleteAnnouncement = (announcementId: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== announcementId));
    toast({
      title: "Announcement Deleted",
      description: "The announcement has been removed successfully.",
    });
  };

  const handleEditAnnouncement = (announcement: any) => {
    setEditingAnnouncement({ ...announcement });
    setIsEditDialogOpen(true);
  };

  const handleUpdateAnnouncement = () => {
    setAnnouncements(prev => prev.map(a => a.id === editingAnnouncement.id ? editingAnnouncement : a));
    setIsEditDialogOpen(false);
    setEditingAnnouncement(null);
    toast({
      title: "Announcement Updated",
      description: "Changes have been saved successfully.",
    });
  };

  const toggleVisibility = (announcementId: string) => {
    setAnnouncements(prev => prev.map(a => 
      a.id === announcementId ? { ...a, isVisible: !a.isVisible } : a
    ));
  };

  const togglePin = (announcementId: string) => {
    setAnnouncements(prev => prev.map(a => 
      a.id === announcementId ? { ...a, isPinned: !a.isPinned } : a
    ));
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const totalViews = announcements.reduce((sum, a) => sum + a.views, 0);
  const activeAnnouncements = announcements.filter(a => a.isVisible).length;
  const pinnedAnnouncements = announcements.filter(a => a.isPinned).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-orbitron mb-2">Announcements</h1>
          <p className="text-muted-foreground font-rajdhani">Create and manage clan announcements</p>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-primary hover:bg-primary/90 font-rajdhani"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1 font-orbitron">{announcements.length}</div>
            <div className="text-sm text-muted-foreground font-rajdhani">Total Announcements</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1 font-orbitron">{activeAnnouncements}</div>
            <div className="text-sm text-muted-foreground font-rajdhani">Active</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1 font-orbitron">{pinnedAnnouncements}</div>
            <div className="text-sm text-muted-foreground font-rajdhani">Pinned</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1 font-orbitron">{totalViews}</div>
            <div className="text-sm text-muted-foreground font-rajdhani">Total Views</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 font-rajdhani"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-background/50 border-border/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="visible">Active</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
                <SelectItem value="pinned">Pinned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Announcements Table */}
      <Card className="bg-card/50 border-border/30">
        <CardHeader>
          <CardTitle className="text-foreground font-orbitron flex items-center">
            <Megaphone className="w-5 h-5 mr-2 text-primary" />
            Clan Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/30">
                <TableHead className="text-muted-foreground font-rajdhani">Title</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Author</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Created</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Views</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Status</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnnouncements.map(announcement => (
                <TableRow key={announcement.id} className="border-border/30 hover:bg-muted/20">
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="font-medium text-foreground font-rajdhani truncate">
                        {announcement.title}
                      </div>
                      <div className="text-sm text-muted-foreground font-rajdhani truncate">
                        {announcement.message}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-rajdhani text-muted-foreground">
                    {announcement.author}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="font-rajdhani">{formatTimeAgo(announcement.createdAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-rajdhani text-foreground">
                    {announcement.views}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(announcement)}>
                      {getStatusText(announcement)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => toggleVisibility(announcement.id)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      >
                        {announcement.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEditAnnouncement(announcement)}
                        className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Announcement Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-card border-border/50 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-orbitron">Create New Announcement</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="font-rajdhani">Title</Label>
              <Input
                id="title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                className="bg-background/50 border-border/50 font-rajdhani"
                placeholder="e.g., 🏆 Championship Tournament Starting Soon!"
              />
            </div>
            
            <div>
              <Label htmlFor="message" className="font-rajdhani">Message</Label>
              <Textarea
                id="message"
                value={newAnnouncement.message}
                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, message: e.target.value }))}
                className="bg-background/50 border-border/50 font-rajdhani min-h-24"
                placeholder="Write your announcement message..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scheduledFor" className="font-rajdhani">Schedule For (Optional)</Label>
                <Input
                  id="scheduledFor"
                  type="datetime-local"
                  value={newAnnouncement.scheduledFor}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, scheduledFor: e.target.value }))}
                  className="bg-background/50 border-border/50 font-rajdhani"
                />
              </div>
              <div>
                <Label htmlFor="expiresAt" className="font-rajdhani">Expires At (Optional)</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={newAnnouncement.expiresAt}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, expiresAt: e.target.value }))}
                  className="bg-background/50 border-border/50 font-rajdhani"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPinned"
                  checked={newAnnouncement.isPinned}
                  onCheckedChange={(checked) => setNewAnnouncement(prev => ({ ...prev, isPinned: checked }))}
                />
                <Label htmlFor="isPinned" className="font-rajdhani">Pin to top</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isVisible"
                  checked={newAnnouncement.isVisible}
                  onCheckedChange={(checked) => setNewAnnouncement(prev => ({ ...prev, isVisible: checked }))}
                />
                <Label htmlFor="isVisible" className="font-rajdhani">Publish immediately</Label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="font-rajdhani"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateAnnouncement}
                className="bg-primary hover:bg-primary/90 font-rajdhani"
              >
                Create Announcement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Announcement Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card border-border/50 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-orbitron">Edit Announcement</DialogTitle>
          </DialogHeader>
          
          {editingAnnouncement && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editTitle" className="font-rajdhani">Title</Label>
                <Input
                  id="editTitle"
                  value={editingAnnouncement.title}
                  onChange={(e) => setEditingAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-background/50 border-border/50 font-rajdhani"
                />
              </div>
              
              <div>
                <Label htmlFor="editMessage" className="font-rajdhani">Message</Label>
                <Textarea
                  id="editMessage"
                  value={editingAnnouncement.message}
                  onChange={(e) => setEditingAnnouncement(prev => ({ ...prev, message: e.target.value }))}
                  className="bg-background/50 border-border/50 font-rajdhani min-h-24"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="editIsPinned"
                    checked={editingAnnouncement.isPinned}
                    onCheckedChange={(checked) => setEditingAnnouncement(prev => ({ ...prev, isPinned: checked }))}
                  />
                  <Label htmlFor="editIsPinned" className="font-rajdhani">Pin to top</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="editIsVisible"
                    checked={editingAnnouncement.isVisible}
                    onCheckedChange={(checked) => setEditingAnnouncement(prev => ({ ...prev, isVisible: checked }))}
                  />
                  <Label htmlFor="editIsVisible" className="font-rajdhani">Visible to players</Label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="font-rajdhani"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateAnnouncement}
                  className="bg-primary hover:bg-primary/90 font-rajdhani"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
