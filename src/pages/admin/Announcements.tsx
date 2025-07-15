
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Megaphone, 
  Plus, 
  Edit, 
  Delete, 
  Calendar as CalendarIcon,
  Eye,
  EyeOff,
  Users,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  scheduled_for?: string;
  profiles?: {
    username: string;
    ign: string;
    role: string;
  };
}

export const AdminAnnouncements: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_published: true,
    scheduled_for: ''
  });

  // Fetch all announcements (including unpublished for admin)
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['admin-announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          *,
          profiles (
            username,
            ign,
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching announcements:', error);
        throw error;
      }
      return data as Announcement[];
    },
  });

  // Create announcement mutation
  const createAnnouncementMutation = useMutation({
    mutationFn: async (announcementData: Omit<Announcement, 'id' | 'created_at' | 'updated_at' | 'profiles'>) => {
      const { error } = await supabase
        .from('announcements')
        .insert([announcementData]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({
        title: "Announcement Created",
        description: "Your announcement has been created successfully.",
      });
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error creating announcement:', error);
      toast({
        title: "Error",
        description: "Failed to create announcement. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update announcement mutation
  const updateAnnouncementMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Announcement> }) => {
      const { error } = await supabase
        .from('announcements')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({
        title: "Announcement Updated",
        description: "The announcement has been updated successfully.",
      });
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error updating announcement:', error);
      toast({
        title: "Error",
        description: "Failed to update announcement. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete announcement mutation
  const deleteAnnouncementMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({
        title: "Announcement Deleted",
        description: "The announcement has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting announcement:', error);
      toast({
        title: "Error",
        description: "Failed to delete announcement. Please try again.",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      is_published: true,
      scheduled_for: ''
    });
    setScheduledDate(undefined);
    setEditingAnnouncement(null);
    setIsCreating(false);
    setIsDialogOpen(false);
  };

  const handleCreateNew = () => {
    resetForm();
    setIsCreating(true);
    setIsDialogOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      is_published: announcement.is_published,
      scheduled_for: announcement.scheduled_for || ''
    });
    if (announcement.scheduled_for) {
      setScheduledDate(new Date(announcement.scheduled_for));
    }
    setIsCreating(false);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create announcements.",
        variant: "destructive",
      });
      return;
    }

    const announcementData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      created_by: user.id,
      is_published: formData.is_published,
      scheduled_for: scheduledDate ? scheduledDate.toISOString() : null
    };

    if (isCreating) {
      createAnnouncementMutation.mutate(announcementData);
    } else if (editingAnnouncement) {
      updateAnnouncementMutation.mutate({
        id: editingAnnouncement.id,
        updates: announcementData
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
      deleteAnnouncementMutation.mutate(id);
    }
  };

  const togglePublished = (announcement: Announcement) => {
    updateAnnouncementMutation.mutate({
      id: announcement.id,
      updates: { is_published: !announcement.is_published }
    });
  };

  const publishedCount = announcements.filter(a => a.is_published).length;
  const draftCount = announcements.filter(a => !a.is_published).length;
  const scheduledCount = announcements.filter(a => a.scheduled_for && new Date(a.scheduled_for) > new Date()).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading announcements...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-orbitron mb-2">Announcements Management</h1>
          <p className="text-gray-400">Create and manage clan announcements</p>
        </div>
        <Button onClick={handleCreateNew} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{announcements.length}</div>
            <div className="text-sm text-gray-400">Total</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{publishedCount}</div>
            <div className="text-sm text-gray-400">Published</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{draftCount}</div>
            <div className="text-sm text-gray-400">Drafts</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{scheduledCount}</div>
            <div className="text-sm text-gray-400">Scheduled</div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements List */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white font-orbitron flex items-center">
            <Megaphone className="w-5 h-5 mr-2 text-primary" />
            All Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <div className="text-center py-8">
              <Megaphone className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No announcements yet</h3>
              <p className="text-muted-foreground mb-4">Create your first announcement to get started</p>
              <Button onClick={handleCreateNew} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Announcement
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map(announcement => (
                <Card key={announcement.id} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{announcement.title}</h3>
                          <Badge className={announcement.is_published 
                            ? 'bg-green-500/20 text-green-400 border-green-500/50'
                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                          }>
                            {announcement.is_published ? 'Published' : 'Draft'}
                          </Badge>
                          {announcement.scheduled_for && new Date(announcement.scheduled_for) > new Date() && (
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                              Scheduled
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-300 mb-3 line-clamp-2">{announcement.content}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>By {announcement.profiles?.ign || 'Admin'}</span>
                          <span className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {new Date(announcement.created_at).toLocaleDateString()}
                          </span>
                          {announcement.scheduled_for && (
                            <span className="flex items-center text-blue-400">
                              <CalendarIcon className="w-4 h-4 mr-1" />
                              Scheduled: {new Date(announcement.scheduled_for).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => togglePublished(announcement)}
                          className="text-gray-400 hover:text-white"
                        >
                          {announcement.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(announcement)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(announcement.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Delete className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border/50 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-orbitron">
              {isCreating ? 'Create New Announcement' : 'Edit Announcement'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="font-rajdhani">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter announcement title..."
                className="bg-background/50 border-border/50 font-rajdhani"
              />
            </div>

            <div>
              <Label htmlFor="content" className="font-rajdhani">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter announcement content..."
                rows={6}
                className="bg-background/50 border-border/50 font-rajdhani"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
              />
              <Label htmlFor="published" className="font-rajdhani">
                Publish immediately
              </Label>
            </div>

            <div>
              <Label className="font-rajdhani">Schedule for later (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background/50 border-border/50",
                      !scheduledDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={resetForm}
                className="font-rajdhani"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createAnnouncementMutation.isPending || updateAnnouncementMutation.isPending}
                className="bg-primary hover:bg-primary/90 font-rajdhani"
              >
                {createAnnouncementMutation.isPending || updateAnnouncementMutation.isPending 
                  ? 'Saving...' 
                  : isCreating ? 'Create Announcement' : 'Update Announcement'
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
