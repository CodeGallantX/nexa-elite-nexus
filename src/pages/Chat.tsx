
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip, X, Download, File, Video, Image, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useChatNotifications } from '@/hooks/useChatNotifications';

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  attachment_url?: string;
  attachment_type?: string;
  attachment_name?: string;
  created_at: string;
  profiles: {
    username: string;
    ign: string;
    role: string;
  };
}

export const Chat: React.FC = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { markChatAsSeen } = useChatNotifications();
  
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mark chat as seen when component mounts
  useEffect(() => {
    markChatAsSeen();
  }, [markChatAsSeen]);

  // Fetch chat messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['chat-messages', 'general'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          profiles (
            username,
            ign,
            role
          )
        `)
        .eq('channel', 'general')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as ChatMessage[];
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, attachmentUrl, attachmentType, attachmentName }: {
      message: string;
      attachmentUrl?: string;
      attachmentType?: string;
      attachmentName?: string;
    }) => {
      const { error } = await supabase
        .from('chat_messages')
        .insert([{
          user_id: user?.id,
          channel: 'general',
          message,
          attachment_url: attachmentUrl,
          attachment_type: attachmentType,
          attachment_name: attachmentName,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
      setMessage('');
      setSelectedFile(null);
      // Update last seen timestamp
      markChatAsSeen();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Upload file to Supabase Storage
  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('chat-attachments')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('chat-attachments')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (20MB limit)
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 20MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/webm',
      'application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Unsupported file type",
        description: "Please select an image, video, or document file",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  // Send message with or without attachment
  const handleSendMessage = async () => {
    if (!message.trim() && !selectedFile) return;

    setUploading(true);
    try {
      let attachmentUrl, attachmentType, attachmentName;

      if (selectedFile) {
        attachmentUrl = await uploadFile(selectedFile);
        attachmentType = selectedFile.type;
        attachmentName = selectedFile.name;
      }

      await sendMessageMutation.mutateAsync({
        message: message.trim() || `Shared ${selectedFile?.name}`,
        attachmentUrl,
        attachmentType,
        attachmentName,
      });
    } catch (error: any) {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('chat-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: 'channel=eq.general'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const renderAttachment = (msg: ChatMessage) => {
    if (!msg.attachment_url) return null;

    const isImage = msg.attachment_type?.startsWith('image/');
    const isVideo = msg.attachment_type?.startsWith('video/');
    const isPdf = msg.attachment_type === 'application/pdf';

    return (
      <div className="mt-2">
        {isImage && (
          <img 
            src={msg.attachment_url} 
            alt={msg.attachment_name}
            className="max-w-xs rounded-lg cursor-pointer hover:opacity-80"
            onClick={() => window.open(msg.attachment_url, '_blank')}
          />
        )}
        
        {isVideo && (
          <video 
            src={msg.attachment_url} 
            controls 
            className="max-w-xs rounded-lg"
          />
        )}
        
        {(isPdf || (!isImage && !isVideo)) && (
          <div className="flex items-center space-x-2 p-2 bg-background/20 rounded-lg max-w-xs">
            <File className="w-4 h-4 text-primary" />
            <span className="text-sm flex-1 truncate">{msg.attachment_name}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open(msg.attachment_url, '_blank')}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Background logo with reduced opacity */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `url('/nexa-logo.jpg') center/contain no-repeat`,
          opacity: 0.2,
        }}
      />

      {/* Mobile navigation toggle */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMobileNav(!showMobileNav)}
          className="flex items-center space-x-2"
        >
          <Users className="w-4 h-4" />
          <span>Chat Channels</span>
        </Button>
      </div>

      {/* Mobile channel list */}
      {showMobileNav && (
        <Card className="md:hidden mb-4 bg-card/50 border-border/30">
          <CardContent className="p-4">
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-primary">
                # General
              </Button>
              {profile?.role === 'admin' && (
                <Button variant="ghost" className="w-full justify-start">
                  # Admin
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="flex-1 bg-card/50 border-border/30 backdrop-blur-sm relative z-10">
        <CardHeader className="border-b border-border/30">
          <CardTitle className="flex items-center justify-between">
            <span className="text-primary"># General Chat</span>
            <div className="text-sm text-muted-foreground">
              {messages.length} messages
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 flex flex-col">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Loading messages...</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">No messages yet. Start the conversation!</div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.user_id === user?.id
                          ? 'bg-primary text-white ml-auto'
                          : 'bg-muted'
                      }`}
                    >
                      {msg.user_id !== user?.id && (
                        <div className="text-xs font-medium mb-1 text-primary">
                          {msg.profiles.ign}
                          {msg.profiles.role === 'admin' && (
                            <span className="ml-1 px-1 py-0.5 bg-red-500 text-white text-xs rounded">
                              ADMIN
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="text-sm">{msg.message}</div>
                      {renderAttachment(msg)}
                      
                      <div className={`text-xs mt-1 ${
                        msg.user_id === user?.id ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* File preview */}
          {selectedFile && (
            <div className="p-4 border-t border-border/30">
              <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  {selectedFile.type.startsWith('image/') ? (
                    <Image className="w-4 h-4" />
                  ) : selectedFile.type.startsWith('video/') ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <File className="w-4 h-4" />
                  )}
                  <span className="text-sm truncate">{selectedFile.name}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Message input */}
          <div className="p-4 border-t border-border/30">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-background/50"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={uploading}
              />
              
              <Button
                onClick={handleSendMessage}
                disabled={(!message.trim() && !selectedFile) || uploading}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
      />
    </div>
  );
};
