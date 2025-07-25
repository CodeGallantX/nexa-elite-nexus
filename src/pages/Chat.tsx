import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip, X, Download, File, Video, Image, Users, CornerDownLeft, Copy, Trash2 } from 'lucide-react';
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
  reply_to_id?: string;
  reply_to_message?: string;
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
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    message: ChatMessage | null;
  }>({ x: 0, y: 0, message: null });
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Mark chat as seen when component mounts
  useEffect(() => {
    markChatAsSeen();
  }, [markChatAsSeen]);

  // Handle clicks outside context menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu({ x: 0, y: 0, message: null });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close context menu on scroll
  useEffect(() => {
    const scrollArea = scrollAreaRef.current?.viewportElement;
    const handleScroll = () => {
      setContextMenu({ x: 0, y: 0, message: null });
    };

    scrollArea?.addEventListener('scroll', handleScroll);
    return () => scrollArea?.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch chat messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['chat-messages', selectedChannel],
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
        .eq('channel', selectedChannel)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as ChatMessage[];
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, attachmentUrl, attachmentType, attachmentName, replyToId }: {
      message: string;
      attachmentUrl?: string;
      attachmentType?: string;
      attachmentName?: string;
      replyToId?: string;
    }) => {
      const { error } = await supabase
        .from('chat_messages')
        .insert([{
          user_id: user?.id,
          channel: selectedChannel,
          message,
          attachment_url: attachmentUrl,
          attachment_type: attachmentType,
          attachment_name: attachmentName,
          reply_to_id: replyToId,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
      setMessage('');
      setSelectedFile(null);
      setReplyTo(null);
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

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
      toast({
        title: "Message deleted",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete message",
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

    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 20MB",
        variant: "destructive",
      });
      return;
    }

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
        replyToId: replyTo?.id,
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

  // Handle context menu
  const handleContextMenu = (event: React.MouseEvent, msg: ChatMessage) => {
    event.preventDefault();
    const messageElement = messageRefs.current.get(msg.id);
    if (!messageElement) return;

    const rect = messageElement.getBoundingClientRect();
    const scrollArea = scrollAreaRef.current?.viewportElement;
    const scrollTop = scrollArea?.scrollTop || 0;

    // Calculate position to keep menu within viewport
    const menuWidth = 160; // Approximate context menu width
    const menuHeight = msg.user_id === user?.id ? 120 : 80; // Approximate height based on number of options
    let x = event.pageX;
    let y = rect.top + window.scrollY - scrollTop + rect.height;

    // Adjust x position if menu would overflow right edge
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }
    // Adjust y position if menu would overflow bottom edge
    if (y + menuHeight > window.innerHeight + window.scrollY) {
      y = rect.top + window.scrollY - scrollTop - menuHeight - 10;
    }

    // Ensure x and y are not negative
    x = Math.max(10, x);
    y = Math.max(10, y);

    setContextMenu({ x, y, message: msg });
  };

  // Handle long press for mobile
  const handleTouchStart = (event: React.TouchEvent, msg: ChatMessage) => {
    // Prevent scrolling during long press
    const scrollArea = scrollAreaRef.current?.viewportElement;
    const preventScroll = (e: Event) => e.preventDefault();
    scrollArea?.addEventListener('touchmove', preventScroll, { passive: false });

    const timeout = setTimeout(() => {
      const messageElement = messageRefs.current.get(msg.id);
      if (!messageElement) return;

      const rect = messageElement.getBoundingClientRect();
      const scrollTop = scrollArea?.scrollTop || 0;

      const menuWidth = 160;
      const menuHeight = msg.user_id === user?.id ? 120 : 80;
      let x = event.touches[0].pageX;
      let y = rect.top + window.scrollY - scrollTop + rect.height;

      // Adjust for viewport boundaries
      if (x + menuWidth > window.innerWidth) {
        x = window.innerWidth - menuWidth - 10;
      }
      if (y + menuHeight > window.innerHeight + window.scrollY) {
        y = rect.top + window.scrollY - scrollTop - menuHeight - 10;
      }

      x = Math.max(10, x);
      y = Math.max(10, y);

      setContextMenu({ x, y, message: msg });
      scrollArea?.removeEventListener('touchmove', preventScroll);
    }, 500);

    return () => {
      clearTimeout(timeout);
      scrollArea?.removeEventListener('touchmove', preventScroll);
    };
  };

  // Handle copy message
  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Message copied",
      variant: "default",
    });
    setContextMenu({ x: 0, y: 0, message: null });
  };

  // Handle reply
  const handleReply = (msg: ChatMessage) => {
    setReplyTo(msg);
    setContextMenu({ x: 0, y: 0, message: null });
    const input = document.querySelector('input[placeholder="Type your message..."]') as HTMLInputElement;
    input?.focus();
  };

  // Handle delete message
  const handleDeleteMessage = (messageId: string) => {
    deleteMessageMutation.mutate(messageId);
    setContextMenu({ x: 0, y: 0, message: null });
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
        filter: `channel=eq.${selectedChannel}`
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
          <div className="max-w-xs max-h-xs">
            <img 
              src={msg.attachment_url} 
              alt={msg.attachment_name}
              className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-80"
              onClick={() => window.open(msg.attachment_url, '_blank')}
            />
          </div>
        )}
        
        {isVideo && (
          <div className="max-w-xs max-h-xs">
            <video 
              src={msg.attachment_url} 
              controls 
              className="w-full h-full rounded-lg"
            />
          </div>
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
          opacity: 0.05,
        }}
      />

      {/* Mobile navigation toggle */}
      <div className="mb-4 px-4 sm:px-6">
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
        <Card className="mb-4 mx-4 sm:mx-6 bg-card/50 border-border/30">
          <CardContent className="p-4">
            <div className="space-y-2">
              <Button onClick={() => setSelectedChannel('general')} variant="ghost" className={`w-full justify-start ${selectedChannel === 'general' ? "text-primary" : "text-white"}`}>
                # General
              </Button>
              {profile?.role === 'admin' && (
                <Button onClick={() => setSelectedChannel('admin')} variant="ghost" className={`w-full justify-start ${selectedChannel === 'admin' ? "text-primary" : "text-white"}`}>
                  # Admin
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="flex-1 mx-4 sm:mx-6 bg-card/50 border-border/30 backdrop-blur-sm relative z-10">
        <CardHeader className="border-b border-border/30 px-4 sm:px-6">
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            {selectedChannel === 'admin' ? (
              <span className="text-primary"># Admin Chat</span>
            ) : (
              <span className="text-primary"># General Chat</span>
            )}
            <div className="text-sm text-muted-foreground">
              {messages?.length || 0} message{messages?.length === 1 ? '' : "s"}
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 flex flex-col">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4 sm:p-6" ref={scrollAreaRef}>
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
                    ref={(el) => el && messageRefs.current.set(msg.id, el)}
                    className={`flex ${msg.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    onContextMenu={(e) => handleContextMenu(e, msg)}
                    onTouchStart={(e) => handleTouchStart(e, msg)}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-lg ${
                        msg.user_id === user?.id
                          ? 'bg-primary text-white ml-auto'
                          : 'bg-muted'
                      }`}
                    >
                      {msg.user_id !== user?.id && (
                        <div className="text-xs font-medium mb-1 text-primary">
                          Ɲ・乂{msg.profiles.ign}
                          {msg.profiles.role === 'admin' && (
                            <span className="ml-1 px-1 py-0.5 bg-red-500 text-white text-xs rounded">
                              ADMIN
                            </span>
                          )}
                        </div>
                      )}
                      
                      {msg.reply_to_id && (
                        <div className="mb-2 p-2 bg-background/20 rounded text-xs">
                          <div className="font-medium">
                            Replying to {messages.find(m => m.id === msg.reply_to_id)?.profiles.ign}
                          </div>
                          <div className="truncate">
                            {messages.find(m => m.id === msg.reply_to_id)?.message}
                          </div>
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

          {/* Context menu */}
          {contextMenu.message && (
            <div
              ref={contextMenuRef}
              className="fixed bg-card border border-border rounded-lg shadow-lg z-50 w-40 sm:w-48"
              style={{ top: contextMenu.y, left: contextMenu.x }}
            >
              <div className="flex flex-col p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start text-sm hover:bg-accent"
                  onClick={() => handleReply(contextMenu.message!)}
                >
                  <CornerDownLeft className="w-4 h-4 mr-2" />
                  Reply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start text-sm hover:bg-accent"
                  onClick={() => handleCopyMessage(contextMenu.message!.message)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                {contextMenu.message.user_id === user?.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start text-sm text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteMessage(contextMenu.message!.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Reply preview */}
          {replyTo && (
            <div className="p-4 border-t border-border/30">
              <div className="flex items-center justify-between p-2 bg-muted rounded-lg max-w-full">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <CornerDownLeft className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">Replying to {replyTo.profiles.ign}</div>
                    <div className="text-xs truncate">{replyTo.message}</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setReplyTo(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* File preview */}
          {selectedFile && (
            <div className="p-4 border-t border-border/30">
              <div className="flex items-center justify-between p-2 bg-muted rounded-lg max-w-full">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  {selectedFile.type.startsWith('image/') ? (
                    <Image className="w-4 h-4 flex-shrink-0" />
                  ) : selectedFile.type.startsWith('video/') ? (
                    <Video className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <File className="w-4 h-4 flex-shrink-0" />
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