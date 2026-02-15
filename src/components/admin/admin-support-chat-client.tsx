'use client';

import { UserAvatar } from '@/components/shared/user-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import {
    ArrowLeft,
    Image as ImageIcon,
    Search,
    Send,
    ShieldAlert
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../convex/_generated/api';

interface Message {
  _id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: number;
  read: boolean;
  imageUrl?: string;
}

interface Conversation {
  _id: string;
  type?: "SUPPORT" | "LISTING";
  listingId?: string;
  buyerId: string;
  sellerId: string;
  lastMessageAt: number;
  lastMessage?: string;
  unreadCount?: number;
  otherUserId: string;
  otherUser?: {
    name?: string;
    image?: string;
    email?: string;
    isVerified?: boolean;
    id?: string;
  };
}

export function AdminSupportChatClient() {
  const conversations = useQuery(api.messages.getSupportConversations) as Conversation[] | undefined;
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Admin ID for chat context
  const ADMIN_ID = 'ADMIN';

  const messages = (useQuery(api.messages.getConversation, 
    selectedConversation ? {
      listingId: undefined, // Support chats don't have listingId usually, or we ignore it
      userA: ADMIN_ID,
      userB: selectedConversation.otherUser?.id || selectedConversation.buyerId // The user
    } : "skip"
  ) as Message[] | undefined) || [];

  const sendMessageMutation = useMutation(api.messages.send);
  const markReadMutation = useMutation(api.messages.markConversationAsRead);

  // Mark as read when messages load
  useEffect(() => {
    if (selectedConversation && messages.length > 0) {
       // Using a small timeout to avoid immediate state updates during render
       const timer = setTimeout(() => {
           markReadMutation({
                listingId: undefined,
                userId: ADMIN_ID,
                otherUserId: selectedConversation.otherUser?.id || selectedConversation.buyerId
           }).catch(console.error);
       }, 500);
       return () => clearTimeout(timer);
    }
  }, [selectedConversation, messages.length, markReadMutation]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, selectedConversation]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConversation) return;

    setIsUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const xhr = new XMLHttpRequest();
      const uploadPromise = new Promise<{ success: boolean; url?: string }>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setUploadProgress(percentComplete);
          }
        });
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error('Upload failed'));
          }
        });
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });

      const data = await uploadPromise;
      if (data.success && data.url) {
        await sendMessageMutation({
          content: 'Sent an image',
          imageUrl: data.url,
          senderId: ADMIN_ID,
          receiverId: selectedConversation.otherUser?.id || selectedConversation.buyerId,
          type: 'SUPPORT',
        });
        toast.success('Image sent');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await sendMessageMutation({
        content: newMessage,
        senderId: ADMIN_ID,
        receiverId: selectedConversation.otherUser?.id || selectedConversation.buyerId,
        type: 'SUPPORT',
      });
      setNewMessage('');
    } catch (error) {
      console.error("Failed to send", error);
      toast.error("Failed to send message");
    }
  };

  const filteredConversations = (conversations || []).filter((conv) => {
    const nameMatch = conv.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const emailMatch = conv.otherUser?.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    return nameMatch || emailMatch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-0 lg:gap-4 h-[600px] border rounded-xl overflow-hidden bg-card shadow-sm">
      {/* Sidebar */}
      <div className={cn(
        "flex flex-col border-r border-border bg-muted/10", 
        selectedConversation ? "hidden lg:flex" : "flex"
      )}>
        <div className="p-3 border-b border-border/50">
           <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm bg-background"
              />
           </div>
        </div>
        
        <ScrollArea className="flex-1">
            {filteredConversations?.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">
                    No support conversations found.
                </div>
            ) : (
                <div className="divide-y divide-border/50">
                    {filteredConversations?.map((conv) => (
                        <button
                            key={conv._id}
                            onClick={() => setSelectedConversation(conv)}
                            className={cn(
                                "w-full p-3 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left",
                                selectedConversation?._id === conv._id && "bg-primary/5 border-l-2 border-l-primary"
                            )}
                        >
                            <UserAvatar user={conv.otherUser} className="w-10 h-10 border bg-background" />
                            <div className="flex-1 min-w-0 overflow-hidden">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-sm truncate">{conv.otherUser?.name || "User"}</span>
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                        {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                            </div>
                            {conv.unreadCount! > 0 && (
                                <Badge className="absolute top-3 right-3 h-2 w-2 p-0 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className={cn(
          "flex flex-col bg-background",
          !selectedConversation ? "hidden lg:flex" : "flex"
      )}>
        {selectedConversation ? (
            <>
                <div className="p-3 border-b flex items-center gap-3 shadow-sm z-10">
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSelectedConversation(null)}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <UserAvatar user={selectedConversation.otherUser} className="w-8 h-8 md:w-10 md:h-10 border" />
                    <div>
                        <h3 className="font-bold text-sm md:text-base">{selectedConversation.otherUser?.name}</h3>
                        <p className="text-xs text-muted-foreground">{selectedConversation.otherUser?.email}</p>
                    </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div key={msg._id} className={cn("flex gap-2", msg.senderId === ADMIN_ID ? "justify-end" : "justify-start")}>
                                {msg.senderId !== ADMIN_ID && (
                                    <UserAvatar user={selectedConversation.otherUser} className="w-6 h-6 self-end mb-1" />
                                )}
                                <div className={cn(
                                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                                    msg.senderId === ADMIN_ID 
                                        ? "bg-primary text-primary-foreground rounded-br-none" 
                                        : "bg-muted text-foreground rounded-bl-none"
                                )}>
                                    {msg.imageUrl && (
                                        <div className="relative aspect-video w-48 rounded-lg overflow-hidden mb-2">
                                            <Image src={msg.imageUrl} alt="attachment" fill className="object-cover" />
                                        </div>
                                    )}
                                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                    <p className={cn("text-[9px] mt-1 text-right opacity-70", msg.senderId === ADMIN_ID ? "text-primary-foreground" : "text-muted-foreground")}>
                                        {formatDistanceToNow(msg.createdAt, { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>

                <div className="p-3 border-t bg-muted/10">
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                        }}
                        className="flex gap-2"
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />
                        <Button 
                            type="button" 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                        </Button>
                        <Input 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a reply..."
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                <ShieldAlert className="w-16 h-16 mb-4" />
                <p>Select a conversation to view chat</p>
            </div>
        )}
      </div>
    </div>
  );
}
