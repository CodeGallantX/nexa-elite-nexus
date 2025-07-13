
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Edit, 
  Save, 
  X, 
  User,
  Gamepad2,
  Trophy,
  Calendar,
  Target
} from 'lucide-react';

// Mock player profiles
const mockProfiles = [
  {
    id: '1',
    username: 'slayerX',
    ign: 'slayerX',
    uid: 'CDM001234567',
    realName: 'Alex Mitchell',
    email: 'slayer@nexa.gg',
    grade: 'S',
    tier: 'Elite Slayer',
    kills: 15420,
    attendance: 85,
    device: 'Phone',
    mode: 'Both',
    class: 'Ninja',
    bestGun: 'AK-47',
    favoriteLoadout: 'Assault + SMG',
    bankName: 'GameBank',
    accountNumber: '1234567890',
    tiktok: '@slayerx_gaming',
    instagram: '@slayerx_codm',
    youtube: 'SlayerX Gaming',
    discord: 'slayerx#1337',
    dateJoined: '2024-01-15'
  }
];

export const AdminProfiles: React.FC = () => {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<typeof mockProfiles[0] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<typeof mockProfiles[0] | null>(null);

  const filteredProfiles = profiles.filter(profile =>
    profile.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.ign.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.realName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditProfile = (profile: typeof mockProfiles[0]) => {
    setSelectedProfile(profile);
    setEditedProfile({ ...profile });
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    if (editedProfile) {
      setProfiles(prev => prev.map(p => p.id === editedProfile.id ? editedProfile : p));
      setSelectedProfile(editedProfile);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(selectedProfile);
    setIsEditing(false);
  };

  const updateEditedProfile = (field: string, value: string) => {
    if (editedProfile) {
      setEditedProfile({ ...editedProfile, [field]: value });
    }
  };

  const getGradeColor = (grade: string) => {
    const colors = {
      'S': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      'A': 'bg-green-500/20 text-green-400 border-green-500/50',
      'B': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      'C': 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      'D': 'bg-red-500/20 text-red-400 border-red-500/50'
    };
    return colors[grade as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white font-orbitron mb-2">Player Profiles</h1>
        <p className="text-gray-400">View and edit detailed player information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player List */}
        <div className="lg:col-span-1">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white font-orbitron">Players</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50 text-foreground"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredProfiles.map(profile => (
                <div
                  key={profile.id}
                  onClick={() => setSelectedProfile(profile)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedProfile?.id === profile.id
                      ? 'bg-primary/20 border border-primary/30'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src="/placeholder.svg"
                      alt={profile.username}
                      className="w-10 h-10 rounded-full border border-primary/30"
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium">{profile.username}</div>
                      <div className="text-gray-400 text-sm">{profile.ign}</div>
                    </div>
                    <Badge className={getGradeColor(profile.grade)}>
                      {profile.grade}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          {selectedProfile ? (
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white font-orbitron flex items-center">
                    <User className="w-5 h-5 mr-2 text-primary" />
                    {selectedProfile.username}'s Profile
                  </CardTitle>
                  {!isEditing ? (
                    <Button 
                      onClick={() => handleEditProfile(selectedProfile)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={handleSaveProfile} className="bg-green-500 hover:bg-green-600">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-orbitron text-white mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-primary" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Real Name</Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile?.realName || ''}
                          onChange={(e) => updateEditedProfile('realName', e.target.value)}
                          className="bg-background/50 border-border/50 text-foreground"
                        />
                      ) : (
                        <div className="text-white p-2 bg-background/30 rounded">{selectedProfile.realName}</div>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-300">Email</Label>
                      <div className="text-white p-2 bg-background/30 rounded">{selectedProfile.email}</div>
                    </div>
                    <div>
                      <Label className="text-gray-300">Grade</Label>
                      {isEditing ? (
                        <Select 
                          value={editedProfile?.grade} 
                          onValueChange={(value) => updateEditedProfile('grade', value)}
                        >
                          <SelectTrigger className="bg-background/50 border-border/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="S">S Grade</SelectItem>
                            <SelectItem value="A">A Grade</SelectItem>
                            <SelectItem value="B">B Grade</SelectItem>
                            <SelectItem value="C">C Grade</SelectItem>
                            <SelectItem value="D">D Grade</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex">
                          <Badge className={getGradeColor(selectedProfile.grade)}>
                            {selectedProfile.grade}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-300">Tier</Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile?.tier || ''}
                          onChange={(e) => updateEditedProfile('tier', e.target.value)}
                          className="bg-background/50 border-border/50 text-foreground"
                        />
                      ) : (
                        <div className="text-white p-2 bg-background/30 rounded">{selectedProfile.tier}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Game Info */}
                <div>
                  <h3 className="text-lg font-orbitron text-white mb-4 flex items-center">
                    <Gamepad2 className="w-5 h-5 mr-2 text-primary" />
                    Game Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">IGN</Label>
                      <div className="text-white p-2 bg-background/30 rounded">{selectedProfile.ign}</div>
                    </div>
                    <div>
                      <Label className="text-gray-300">UID</Label>
                      <div className="text-white p-2 bg-background/30 rounded font-mono">{selectedProfile.uid}</div>
                    </div>
                    <div>
                      <Label className="text-gray-300">Device</Label>
                      {isEditing ? (
                        <Select 
                          value={editedProfile?.device} 
                          onValueChange={(value) => updateEditedProfile('device', value)}
                        >
                          <SelectTrigger className="bg-background/50 border-border/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Phone">Phone</SelectItem>
                            <SelectItem value="iPad">iPad</SelectItem>
                            <SelectItem value="PC">PC/Emulator</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="text-white p-2 bg-background/30 rounded">{selectedProfile.device}</div>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-300">Mode</Label>
                      <div className="text-white p-2 bg-background/30 rounded">{selectedProfile.mode}</div>
                    </div>
                    <div>
                      <Label className="text-gray-300">Class</Label>
                      <div className="text-white p-2 bg-background/30 rounded">{selectedProfile.class}</div>
                    </div>
                    <div>
                      <Label className="text-gray-300">Best Gun</Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile?.bestGun || ''}
                          onChange={(e) => updateEditedProfile('bestGun', e.target.value)}
                          className="bg-background/50 border-border/50 text-foreground"
                        />
                      ) : (
                        <div className="text-white p-2 bg-background/30 rounded">{selectedProfile.bestGun}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div>
                  <h3 className="text-lg font-orbitron text-white mb-4 flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-primary" />
                    Performance Stats
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Total Kills</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editedProfile?.kills || 0}
                          onChange={(e) => updateEditedProfile('kills', e.target.value)}
                          className="bg-background/50 border-border/50 text-foreground"
                        />
                      ) : (
                        <div className="text-white p-2 bg-background/30 rounded font-mono">
                          {selectedProfile.kills.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-300">Attendance</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={editedProfile?.attendance || 0}
                          onChange={(e) => updateEditedProfile('attendance', e.target.value)}
                          className="bg-background/50 border-border/50 text-foreground"
                        />
                      ) : (
                        <div className="text-white p-2 bg-background/30 rounded">{selectedProfile.attendance}%</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="text-lg font-orbitron text-white mb-4">Social Media Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['tiktok', 'instagram', 'youtube', 'discord'].map(platform => (
                      <div key={platform}>
                        <Label className="text-gray-300 capitalize">{platform}</Label>
                        {isEditing ? (
                          <Input
                            value={editedProfile?.[platform as keyof typeof editedProfile] as string || ''}
                            onChange={(e) => updateEditedProfile(platform, e.target.value)}
                            className="bg-background/50 border-border/50 text-foreground"
                            placeholder={`@username`}
                          />
                        ) : (
                          <div className="text-white p-2 bg-background/30 rounded">
                            {selectedProfile[platform as keyof typeof selectedProfile] as string || 'Not provided'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Select a player to view their profile</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
