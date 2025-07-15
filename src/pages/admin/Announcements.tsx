
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Megaphone, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Users,
  MessageSquare,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_by: string;
  scheduled_for?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    ign: string;
  };
}

export const AdminAnnouncements: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    scheduled_for: '',
    is_published: true
  });

  // Fetch all announcements
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['admin-announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          *,
          profiles (username, ign)
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
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('announcements')
        .insert([{
          ...announcementData,
          created_by: user?.id,
          scheduled_for: announcementData.scheduled_for || null
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      toast({
        title: "Announcement Created",
        description: "New announcement has been published successfully.",
      });
      setIsDialogOpen(false);
      setFormData({ title: '', content: '', scheduled_for: '', is_published: true });
    },
    onError: (error) => {
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
      const { data, error } = await supabase
        .from('announcements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      toast({
        title: "Announcement Updated",
        description: "Announcement has been updated successfully.",
      });
      setIsDialogOpen(false);
      setEditingAnnouncement(null);
      setFormData({ title: '', content: '', scheduled_for: '', is_published: true });
    },
    onError: (error) => {
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
      toast({
        title: "Announcement Deleted",
        description: "Announcement has been removed successfully.",
      });
    },
    onError: (error) => {
      console.error('Error deleting announcement:', error);
      toast({
        title: "Error",
        description: "Failed to delete announcement. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleCreateNew = () => {
    setEditingAnnouncement(null);
    setFormData({ title: '', content: '', scheduled_for: '', is_published: true });
    setIsDialogOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      scheduled_for: announcement.scheduled_for?.split('T')[0] || '',
      is_published: announcement.is_published
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const announcementData = {
      title: formData.title,
      content: formData.content,
      scheduled_for: formData.scheduled_for ? new Date(formData.scheduled_for).toISOString() : null,
      is_published: formData.is_published
    };

    if (editingAnnouncement) {
      updateAnnouncementMutation.mutate({
        id: editingAnnouncement.id,
        updates: announcementData
      });
    } else {
      createAnnouncementMutation.mutate(announcementData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      deleteAnnouncementMutation.mutate(id);
    }
  };

  const togglePublishStatus = (announcement: Announcement) => {
    updateAnnouncementMutation.mutate({
      id: announcement.id,
      updates: { is_published: !announcement.is_published }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading announcements...</div>
        </div>
      </div>
    );
  }

  const publishedCount = announcements.filter(a => a.is_published).length;
  const draftCount = announcements.filter(a => !a.is_published).length;
  const scheduledCount = announcements.filter(a => a.scheduled_for && new Date(a.scheduled_for) > new Date()).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-orbitron mb-2">Announcements</h1>
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
            <div className="text-sm text-gray-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              Total
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{publishedCount}</div>
            <div className="text-sm text-gray-400 flex items-center justify-center">
              <Send className="w-4 h-4 mr-1" />
              Published
            </div>
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
            <div className="text-sm text-gray-400 flex items-center justify-center">
              <Calendar className="w-4 h-4 mr-1" />
              Scheduled
            </div>
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
          <div className="space-y-4">
            {announcements.length > 0 ? (
              announcements.map(announcement => (
                <div 
                  key={announcement.id} 
                  className="p-4 bg-background/30 border border-border/30 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-white font-orbitron">
                          {announcement.title}
                        </h3>
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
                      
                      <p className="text-gray-300 mb-3 line-clamp-2">
                        {announcement.content}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>By {announcement.profiles?.username || 'Unknown'}</span>
                        <span>•</span>
                        <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                        {announcement.scheduled_for && (
                          <>
                            <span>•</span>
                            <span>Scheduled for {new Date(announcement.scheduled_for).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePublishStatus(announcement)}
                        disabled={updateAnnouncementMutation.isPending}
                        className="font-rajdhani"
                      >
                        {announcement.is_published ? 'Unpublish' : 'Publish'}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(announcement)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(announcement.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        disabled={deleteAnnouncementMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white font-orbitron mb-2">No Announcements Yet</h3>
                <p className="text-gray-400 mb-4">Create your first announcement to get started.</p>
                <Button onClick={handleCreateNew} className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Announcement
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border/50 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-orbitron">
              {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
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
            
            <div>
              <Label htmlFor="scheduled_for" className="font-rajdhani">Schedule For (Optional)</Label>
              <Input
                id="scheduled_for"
                type="date"
                value={formData.scheduled_for}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduled_for: e.target.value }))}
                className="bg-background/50 border-border/50 font-rajdhani"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="is_published" className="font-rajdhani">
                Publish immediately
              </Label>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="font-rajdhani"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={createAnnouncementMutation.isPending || updateAnnouncementMutation.isPending}
                className="bg-primary hover:bg-primary/90 font-rajdhani"
              >
                {createAnnouncementMutation.isPending || updateAnnouncementMutation.isPending 
                  ? 'Saving...' 
                  : editingAnnouncement ? 'Update' : 'Create'
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
