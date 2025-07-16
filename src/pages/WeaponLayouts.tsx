
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Edit3, Trash2, Eye } from 'lucide-react';

interface WeaponLayout {
  id: string;
  mode: string;
  weapon_type: string;
  weapon_name: string;
  image_url?: string;
  image_name?: string;
  view_count: number;
  created_at: string;
}

export const WeaponLayouts: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [layouts, setLayouts] = useState<WeaponLayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLayout, setEditingLayout] = useState<WeaponLayout | null>(null);
  
  const [formData, setFormData] = useState({
    mode: '',
    weapon_type: '',
    weapon_name: '',
    image: null as File | null
  });

  const weaponTypes = ['AR', 'SMG', 'Sniper', 'LMG', 'Shotgun', 'Pistol', 'Marksman'];
  const modes = ['BR', 'MP', 'Both'];

  useEffect(() => {
    if (user) {
      fetchLayouts();
    }
  }, [user]);

  const fetchLayouts = async () => {
    try {
      const { data, error } = await supabase
        .from('weapon_layouts')
        .select('*')
        .eq('player_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLayouts(data || []);
    } catch (error) {
      console.error('Error fetching layouts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch weapon layouts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('weapon-layouts')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('weapon-layouts')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.mode || !formData.weapon_type || !formData.weapon_name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      let imageUrl = null;
      let imageName = null;

      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
        imageName = formData.image.name;
      }

      const layoutData = {
        player_id: user?.id,
        mode: formData.mode,
        weapon_type: formData.weapon_type,
        weapon_name: formData.weapon_name,
        image_url: imageUrl,
        image_name: imageName
      };

      if (editingLayout) {
        const { error } = await supabase
          .from('weapon_layouts')
          .update(layoutData)
          .eq('id', editingLayout.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Weapon layout updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('weapon_layouts')
          .insert([layoutData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Weapon layout added successfully",
        });
      }

      setFormData({ mode: '', weapon_type: '', weapon_name: '', image: null });
      setShowAddForm(false);
      setEditingLayout(null);
      await fetchLayouts();
    } catch (error) {
      console.error('Error saving layout:', error);
      toast({
        title: "Error",
        description: "Failed to save weapon layout",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (layoutId: string) => {
    try {
      const { error } = await supabase
        .from('weapon_layouts')
        .delete()
        .eq('id', layoutId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Weapon layout deleted successfully",
      });
      
      await fetchLayouts();
    } catch (error) {
      console.error('Error deleting layout:', error);
      toast({
        title: "Error",
        description: "Failed to delete weapon layout",
        variant: "destructive",
      });
    }
  };

  const startEdit = (layout: WeaponLayout) => {
    setEditingLayout(layout);
    setFormData({
      mode: layout.mode,
      weapon_type: layout.weapon_type,
      weapon_name: layout.weapon_name,
      image: null
    });
    setShowAddForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-white">Loading weapon layouts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">My Weapon Layouts</h1>
        <Button
          onClick={() => {
            setShowAddForm(true);
            setEditingLayout(null);
            setFormData({ mode: '', weapon_type: '', weapon_name: '', image: null });
          }}
          className="bg-[#FF1F44] hover:bg-red-600 text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          Add Layout
        </Button>
      </div>

      {/* Add/Edit Form Modal */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingLayout ? 'Edit Weapon Layout' : 'Add New Weapon Layout'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-gray-300">Mode</Label>
              <Select value={formData.mode} onValueChange={(value) => setFormData(prev => ({ ...prev, mode: value }))}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select game mode" />
                </SelectTrigger>
                <SelectContent>
                  {modes.map(mode => (
                    <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-300">Weapon Type</Label>
              <Select value={formData.weapon_type} onValueChange={(value) => setFormData(prev => ({ ...prev, weapon_type: value }))}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select weapon type" />
                </SelectTrigger>
                <SelectContent>
                  {weaponTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-300">Weapon Name</Label>
              <Input
                value={formData.weapon_name}
                onChange={(e) => setFormData(prev => ({ ...prev, weapon_name: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="e.g., AK-47, M4A1"
              />
            </div>

            <div>
              <Label className="text-gray-300">Upload Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={uploading}
                className="bg-[#FF1F44] hover:bg-red-600 text-white"
              >
                {uploading ? 'Saving...' : (editingLayout ? 'Update' : 'Add Layout')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Layouts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {layouts.map((layout) => (
          <Card key={layout.id} className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">{layout.weapon_name}</CardTitle>
                <div className="flex space-x-1">
                  {layout.image_url && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle className="text-white">{layout.weapon_name} Layout</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center">
                          <img
                            src={layout.image_url}
                            alt={layout.weapon_name}
                            className="max-w-full max-h-96 object-contain rounded-lg"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEdit(layout)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(layout.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {layout.image_url && (
                <div className="mb-4">
                  <img
                    src={layout.image_url}
                    alt={layout.weapon_name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Mode:</span>
                  <span className="text-white">{layout.mode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white">{layout.weapon_type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Views:</span>
                  <span className="text-white">{layout.view_count || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-white">{new Date(layout.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {layouts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No weapon layouts yet</p>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-[#FF1F44] hover:bg-red-600 text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Add Your First Layout
          </Button>
        </div>
      )}
    </div>
  );
};
