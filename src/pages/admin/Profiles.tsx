
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useAdminPlayers } from '@/hooks/useAdminPlayers';
import { Search, Eye, ExternalLink, Calendar, Trophy, Target, TrendingUp } from 'lucide-react';

export const AdminProfiles: React.FC = () => {
  const { data: players, isLoading } = useAdminPlayers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);

  const filteredPlayers = players?.filter(player => 
    player.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.ign?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatSocialLinks = (socialLinks: any) => {
    if (!socialLinks) return [];
    
    try {
      const links = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
      return Object.entries(links).map(([platform, url]) => ({
        platform,
        url: url as string
      }));
    } catch {
      return [];
    }
  };

  const formatBankingInfo = (bankingInfo: any) => {
    if (!bankingInfo) return null;
    
    try {
      return typeof bankingInfo === 'string' ? JSON.parse(bankingInfo) : bankingInfo;
    } catch {
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-white">Loading profiles...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Player Profiles</h1>
      </div>

      {/* Search */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white"
              placeholder="Search by username or IGN..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map((player) => (
          <Card key={player.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                  {player.avatar_url ? (
                    <img src={player.avatar_url} alt={player.username} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-white">{player.username?.[0]?.toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">Ɲ・乂{player.ign}</h3>
                  <p className="text-gray-400 text-sm">@{player.username}</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-gray-400 hover:text-white"
                      onClick={() => setSelectedPlayer(player)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-white flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                          {selectedPlayer?.avatar_url ? (
                            <img src={selectedPlayer.avatar_url} alt={selectedPlayer.username} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <span className="text-sm font-bold text-white">{selectedPlayer?.username?.[0]?.toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <div>Ɲ・乂{selectedPlayer?.ign}</div>
                          <div className="text-sm text-gray-400 font-normal">@{selectedPlayer?.username}</div>
                        </div>
                      </DialogTitle>
                    </DialogHeader>
                    
                    {selectedPlayer && (
                      <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                              <CardTitle className="text-white text-lg flex items-center">
                                <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                                Game Details
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div>
                                <label className="text-gray-300 text-sm">Role</label>
                                <Badge className="ml-2 bg-blue-100 text-blue-800">{selectedPlayer.role}</Badge>
                              </div>
                              <div>
                                <label className="text-gray-300 text-sm">Tier</label>
                                <Badge className="ml-2 bg-purple-100 text-purple-800">{selectedPlayer.tier || 'Rookie'}</Badge>
                              </div>
                              <div>
                                <label className="text-gray-300 text-sm">Device</label>
                                <p className="text-white">{selectedPlayer.device || 'Not specified'}</p>
                              </div>
                              <div>
                                <label className="text-gray-300 text-sm">Preferred Mode</label>
                                <p className="text-white">{selectedPlayer.preferred_mode || 'Not specified'}</p>
                              </div>
                              <div>
                                <label className="text-gray-300 text-sm">Grade</label>
                                <Badge className="ml-2 bg-green-100 text-green-800">{selectedPlayer.grade || 'D'}</Badge>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                              <CardTitle className="text-white text-lg flex items-center">
                                <Target className="w-5 h-5 mr-2 text-red-400" />
                                Performance Stats
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-300">Total Kills</span>
                                <span className="text-white font-semibold">{selectedPlayer.kills || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">Attendance</span>
                                <span className="text-white font-semibold">{selectedPlayer.attendance || 0}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">Date Joined</span>
                                <span className="text-white">{selectedPlayer.date_joined ? new Date(selectedPlayer.date_joined).toLocaleDateString() : 'N/A'}</span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Social Links */}
                        <Card className="bg-white/5 border-white/10">
                          <CardHeader>
                            <CardTitle className="text-white text-lg flex items-center">
                              <ExternalLink className="w-5 h-5 mr-2 text-blue-400" />
                              Social Links
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {selectedPlayer.tiktok_handle && (
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-300">TikTok</span>
                                  <a 
                                    href={`https://tiktok.com/@${selectedPlayer.tiktok_handle}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 flex items-center"
                                  >
                                    @{selectedPlayer.tiktok_handle}
                                    <ExternalLink className="w-3 h-3 ml-1" />
                                  </a>
                                </div>
                              )}
                              
                              {formatSocialLinks(selectedPlayer.social_links).map((link, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <span className="text-gray-300 capitalize">{link.platform}</span>
                                  <a 
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 flex items-center"
                                  >
                                    View Profile
                                    <ExternalLink className="w-3 h-3 ml-1" />
                                  </a>
                                </div>
                              ))}
                              
                              {!selectedPlayer.tiktok_handle && formatSocialLinks(selectedPlayer.social_links).length === 0 && (
                                <p className="text-gray-400 text-sm">No social links provided</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Banking Info */}
                        {formatBankingInfo(selectedPlayer.banking_info) && (
                          <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                              <CardTitle className="text-white text-lg flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                                Banking Information
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {Object.entries(formatBankingInfo(selectedPlayer.banking_info) || {}).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <span className="text-white">{value as string}</span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Role</span>
                  <Badge className="bg-blue-100 text-blue-800">{player.role}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Tier</span>
                  <Badge className="bg-purple-100 text-purple-800">{player.tier || 'Rookie'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Kills</span>
                  <span className="text-white font-semibold">{player.kills || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Attendance</span>
                  <span className="text-white font-semibold">{player.attendance || 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Joined</span>
                  <span className="text-white text-sm">
                    {player.date_joined ? new Date(player.date_joined).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No players found</p>
        </div>
      )}
    </div>
  );
};
