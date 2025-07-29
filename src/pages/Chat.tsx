import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    id: string;
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
    message: ChatMessage | null;
    x: number;
    y: number;
    position: 'top' | 'bottom';
  }>({ message: null, x: 0, y: 0, position: 'bottom' });
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [imageModal, setImageModal] = useState<{ url: string; name: string } | null>(null);

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
        setContextMenu({ message: null, x: 0, y: 0, position: 'bottom' });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close context menu on scroll
  useEffect(() => {
    const scrollArea = scrollAreaRef.current?.viewportElement;
    const handleScroll = () => {
      setContextMenu({ message: null, x: 0, y: 0, position: 'bottom' });
    };

    scrollArea?.addEventListener('scroll', handleScroll);
    return () => scrollArea?.removeEventListener('scroll', handleScroll);
  }, []);

  // Close image modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setImageModal(null);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Fetch chat messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['chat-messages', selectedChannel],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select(`
            *,
            profiles (
              username,
              id,
              ign,
              role
            )
          `)
          .eq('channel', selectedChannel)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }
        return data as ChatMessage[];
      } catch (err: any) {
        toast({
          title: "Failed to load messages",
          description: err.message || 'An error occurred while fetching messages.',
          variant: 'destructive',
        });
        throw err;
      }
    },
    onError: (error: any) => {
      console.error('useQuery error:', error);
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
        .insert({
          user_id: user?.id,
          channel: selectedChannel,
          message,
          attachment_url: attachmentUrl,
          attachment_type: attachmentType,
          attachment_name: attachmentName,
          reply_to_id: replyToId,
        });

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
        variant: 'destructive',
      });
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { error, count } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      if (!count) {
        throw new Error('Message not found or you do not have permission to delete it');
      }
    },
    onMutate: async (messageId: string) => {
      await queryClient.cancelQueries({ queryKey: ['chat-messages', selectedChannel] });
      const previousMessages = queryClient.getQueryData<ChatMessage[]>(['chat-messages', selectedChannel]);
      
      queryClient.setQueryData(['chat-messages', selectedChannel], (old: ChatMessage[] | undefined) =>
        old ? old.filter((msg) => msg.id !== messageId) : []
      );

      return { previousMessages };
    },
    onSuccess: () => {
      toast({
        title: "Message deleted",
        variant: "default",
      });
    },
    onError: (error: any, messageId, context: any) => {
      queryClient.setQueryData(['chat-messages', selectedChannel], context.previousMessages);
      toast({
        title: "Failed to delete message",
        description: error.message === 'Message not found or you do not have permission to delete it'
          ? 'You can only delete your own messages.'
          : error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', selectedChannel] });
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
    console.log('Context menu triggered for message:', msg.id);
    const messageElement = messageRefs.current.get(msg.id);
    if (!messageElement) {
      console.error('Message element not found for ID:', msg.id);
      return;
    }

    const rect = messageElement.getBoundingClientRect();
    const scrollArea = scrollAreaRef.current?.viewportElement;
    if (!scrollArea) {
      console.error('ScrollArea not found');
      return;
    }

    const scrollAreaRect = scrollArea.getBoundingClientRect();
    const menuWidth = 160;
    const menuHeight = msg.user_id === user?.id ? 120 : 80;

    // Center horizontally on the bubble
    const x = rect.left + (rect.width / 2) - (menuWidth / 2);
    let y = rect.bottom + 5; // Below bubble
    let position: 'top' | 'bottom' = 'bottom';
    if (y + menuHeight > scrollAreaRect.bottom - 10) {
      y = rect.top - menuHeight - 5; // Above bubble
      position = 'top';
    }

    // Ensure menu stays within ScrollArea horizontally
    const adjustedX = Math.max(scrollAreaRect.left + 10, Math.min(x, scrollAreaRect.right - menuWidth - 10));

    console.log('Setting context menu at:', { x: adjustedX, y, position });
    setContextMenu({ message: msg, x: adjustedX, y, position });
  };

  // Handle long press for mobile
  const handleTouchStart = (event: React.TouchEvent, msg: ChatMessage) => {
    console.log('Touch start for message:', msg.id);
    const scrollArea = scrollAreaRef.current?.viewportElement;
    const preventScroll = (e: Event) => e.preventDefault();
    scrollArea?.addEventListener('touchmove', preventScroll, { passive: false });

    const timeout = setTimeout(() => {
      const messageElement = messageRefs.current.get(msg.id);
      if (!messageElement || !scrollArea) {
        console.error('Message element or ScrollArea not found for ID:', msg.id);
        scrollArea?.removeEventListener('touchmove', preventScroll);
        return;
      }

      const rect = messageElement.getBoundingClientRect();
      const scrollAreaRect = scrollArea.getBoundingClientRect();
      const menuWidth = 140;
      const menuHeight = msg.user_id === user?.id ? 120 : 80;

      const x = rect.left + (rect.width / 2) - (menuWidth / 2);
      let y = rect.bottom + 5;
      let position: 'top' | 'bottom' = 'bottom';
      if (y + menuHeight > scrollAreaRect.bottom - 10) {
        y = rect.top - menuHeight - 5;
        position = 'top';
      }

      const adjustedX = Math.max(scrollAreaRect.left + 10, Math.min(x, scrollAreaRect.right - menuWidth - 10));

      console.log('Setting context menu (touch) at:', { x: adjustedX, y, position });
      setContextMenu({ message: msg, x: adjustedX, y, position });
      scrollArea?.removeEventListener('touchmove', preventScroll);
    }, 500);

    return () => {
      clearTimeout(timeout);
      scrollArea?.removeEventListener('touchmove', preventScroll);
    };
  };

  // Handle reply click to scroll to original message
  const handleReplyClick = (replyToId: string) => {
    const messageElement = messageRefs.current.get(replyToId);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedMessageId(replyToId);
      setTimeout(() => setHighlightedMessageId(null), 2000);
    }
  };

  // Handle copy message
  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Message copied",
      variant: "default",
      duration: 2000,
    });
    setContextMenu({ message: null, x: 0, y: 0, position: 'bottom' });
  };

  // Handle reply
  const handleReply = (msg: ChatMessage) => {
    setReplyTo(msg);
    setContextMenu({ message: null, x: 0, y: 0, position: 'bottom' });
    const input = document.querySelector('input[placeholder="Type your message..."]') as HTMLInputElement;
    input?.focus();
  };

  // Handle delete message
  const handleDeleteMessage = (messageId: string) => {
    deleteMessageMutation.mutate(messageId);
    setContextMenu({ message: null, x: 0, y: 0, position: 'bottom' });
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
  }, [queryClient, selectedChannel]);

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
              onClick={() => setImageModal({ url: msg.attachment_url, name: msg.attachment_name || 'image' })}
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

  const renderContextMenu = () => {
    if (!contextMenu.message) {
      console.log('Context menu not rendered: no message selected');
      return null;
    }

    return createPortal(
      <div
        ref={contextMenuRef}
        className="fixed z-[1000] w-40 max-w-full bg-card border border-border rounded-lg shadow-lg sm:w-48"
        // style={{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }}
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
      </div>,
      document.body
    );
  };

  const renderImageModal = () => {
    if (!imageModal) return null;

    return createPortal(
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70">
        <div className="relative max-w-[90vw] max-h-[90vh] bg-card rounded-lg p-4">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 text-white"
            onClick={() => setImageModal(null)}
          >
            <X className="w-6 h-6" />
          </Button>
          <img
            src={imageModal.url}
            alt={imageModal.name}
            className="max-w-full max-h-[80vh] object-contain"
          />
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const link = document.createElement('a');
                link.href = imageModal.url;
                link.download = imageModal.name;
                link.click();
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="flex flex-col h-full relative">
      <style>
        {`
          .chat-bubble::after {
            content: '';
            position: absolute;
            bottom: 0.5rem;
            width: 0.75rem;
            height: 0.75rem;
            clip-path: polygon(0 0, 100% 0, 100% 100%);
          }
          .chat-bubble.outgoing::after {
            right: -0.7rem;
            background: #ff1f31;
            transform: rotate(-45deg);
          }
          .chat-bubble.incoming::after {
            left: -0.7rem;
            background: #1f2937;
            transform: rotate(45deg);
          }
        `}
      </style>

      {/* Background logo with reduced opacity */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `url('/nexa-logo.jpg') center/contain no-repeat`,
          opacity: 0.1,
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
        <Card className="mb-4 mx-2 sm:mx-4  bg-card/50 border-border/30">
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

      <Card className="flex-1 mx-2 sm:mx-4 bg-card/50 border-border/30 backdrop-blur-sm relative z-10">
        <CardHeader className="border-b border-border/30 px-4 sm:px-6">
          <CardTitle className="flex flex-col md:flex-row items-start sm:items-center justify-between">
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
                      className={`relative p-1.5 rounded max-w-[95%] sm:max-w-[90%] ${
                        msg.user_id === user?.id
                          ? 'chat-bubble outgoing bg-primary text-white ml-auto'
                          : 'chat-bubble incoming bg-gray-800 text-white'
                      } ${highlightedMessageId === msg.id ? 'ring-2 ring-yellow-400' : ''}`}
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
                        <div
                          className="mb-2 p-2 bg-background/20 rounded text-xs cursor-pointer hover:bg-background/30"
                          onClick={() => handleReplyClick(msg.reply_to_id!)}
                        >
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
                        msg.user_id === user?.id ? 'text-gray-200' : 'text-muted-foreground'
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

      {renderContextMenu()}
      {renderImageModal()}
    </div>
  );
};