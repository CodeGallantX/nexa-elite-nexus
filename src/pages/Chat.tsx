
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Users, 
  Shield, 
  MessageCircle,
  Hash
} from 'lucide-react';

// Mock chat messages
const mockMessages = [
  {
    id: '1',
    user: 'GhostAlpha',
    role: 'admin',
    message: 'Tournament registration is now open! Make sure to sign up before Friday.',
    timestamp: '10:30 AM',
    channel: 'general'
  },
  {
    id: '2',
    user: 'TacticalSniper',
    role: 'player',
    message: 'Great job everyone in last night\'s clan war! We dominated 🔥',
    timestamp: '10:32 AM',
    channel: 'general'
  },
  {
    id: '3',
    user: 'EliteWarrior',
    role: 'player',
    message: 'Anyone up for some Battle Royale matches?',
    timestamp: '10:35 AM',
    channel: 'general'
  },
  {
    id: '4',
    user: 'GhostAlpha',
    role: 'admin',
    message: '@everyone Don\'t forget about the strategy meeting tomorrow at 8 PM EST',
    timestamp: '10:38 AM',
    channel: 'admin'
  }
];

export const Chat: React.FC = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState(mockMessages);

  const channels = [
    { id: 'general', name: 'General', icon: Hash, members: 247 },
    ...(user?.role === 'admin' ? [{ id: 'admin', name: 'Admin Only', icon: Shield, members: 5 }] : [])
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      user: user?.username || 'Anonymous',
      role: user?.role || 'player',
      message: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: activeChannel
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const filteredMessages = messages.filter(msg => 
    msg.channel === activeChannel && 
    (activeChannel !== 'admin' || user?.role === 'admin')
  );

  return (
    <div className="h-full flex">
      {/* Channels Sidebar */}
      <div className="w-64 bg-white/5 border-r border-white/10 backdrop-blur-sm">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-white font-bold flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-[#FF1F44]" />
            Chat Rooms
          </h2>
        </div>
        
        <div className="p-4">
          <div className="space-y-2">
            {channels.map(channel => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeChannel === channel.id
                    ? 'bg-[#FF1F44]/20 text-[#FF1F44] border border-[#FF1F44]/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <channel.icon className="w-4 h-4" />
                <span className="flex-1 text-left">{channel.name}</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                  {channel.members}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Online Members */}
        <div className="p-4 border-t border-white/10">
          <h3 className="text-gray-400 text-sm font-medium mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Online Members (12)
          </h3>
          <div className="space-y-2">
            {['GhostAlpha', 'TacticalSniper', 'EliteWarrior', 'CombatPro'].map(member => (
              <div key={member} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300 text-sm">{member}</span>
                {member === 'GhostAlpha' && (
                  <Shield className="w-3 h-3 text-[#FF1F44]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Logo Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <img 
            src="/nexa-logo.jpg" 
            alt="NeXa Esports Watermark" 
            className="w-96 h-96 object-contain opacity-5"
          />
        </div>

        {/* Chat Header */}
        <div className="p-4 bg-white/5 border-b border-white/10 backdrop-blur-sm relative z-10">
          <div className="flex items-center space-x-3">
            <Hash className="w-5 h-5 text-[#FF1F44]" />
            <h1 className="text-xl font-bold text-white">
              {channels.find(c => c.id === activeChannel)?.name}
            </h1>
            {activeChannel === 'admin' && (
              <Badge className="bg-[#FF1F44]/20 text-[#FF1F44] border-[#FF1F44]/30">
                Admin Only
              </Badge>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 relative z-10">
          {filteredMessages.map(msg => (
            <div key={msg.id} className="flex space-x-3">
              <img
                src={`/placeholder.svg`}
                alt={msg.user}
                className="w-10 h-10 rounded-full border-2 border-white/20"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-white">{msg.user}</span>
                  {msg.role === 'admin' && (
                    <Shield className="w-4 h-4 text-[#FF1F44]" />
                  )}
                  <span className="text-xs text-gray-400">{msg.timestamp}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                  <p className="text-gray-300">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white/5 border-t border-white/10 backdrop-blur-sm relative z-10">
          <div className="flex space-x-4">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Message #${channels.find(c => c.id === activeChannel)?.name.toLowerCase()}`}
              className="flex-1 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-[#FF1F44]/50"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-[#FF1F44] hover:bg-red-600 text-white px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
