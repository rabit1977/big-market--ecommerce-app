'use client';

import { UserAvatar } from '@/components/shared/user-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Image as ImageIcon,
    Loader2,
    MessageSquare,
    Search,
    Send,
    ShieldAlert
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
    memo,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { toast } from 'sonner';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  _id: string;
  content: string;
  senderId: string;
  createdAt: number;
  imageUrl?: string;
}

interface Conversation {
  _id: string;
  // Change this line:
  // type?: 'LISTING' | 'SUPPORT'; 
  // To this (allows specific types BUT accepts string from DB):
  type?: 'LISTING' | 'SUPPORT' | string; 
  
  listingId?: string;
  buyerId: string;
  sellerId: string;
  lastMessageAt: number;
  lastMessage?: string;
  unreadCount?: number;
  listing?: {
    _id: string;
    title: string;
    price: number;
    thumbnail?: string;
    images: string[];
  } | null;
  otherUserId: string;
  otherUser?: {
    name?: string;
    image?: string;
    isVerified?: boolean;
  };
}

interface MessagesClientProps {
  conversations: Conversation[];
  userId: string;
  newConversationListing?: any; // Typed loosely here, strict in usage
}

// ─── Helper: Upload Logic (Extracted) ─────────────────────────────────────────

const uploadFileWithProgress = (
  file: File, 
  onProgress: (percent: number) => void
): Promise<{ success: boolean; url?: string }> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        onProgress((event.loaded / event.total) * 100);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error('Upload failed'));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Upload failed')));
    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  });
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function MessagesClient({
  conversations: initialConversations,
  userId,
  newConversationListing,
}: MessagesClientProps) {
  // 1. Data Fetching
  // We use the initial data as fallback to prevent layout shift on hydration
  const conversations = useQuery(api.messages.getConversations, { userId }) || initialConversations;
  const searchParams = useSearchParams();

  // 2. State
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [virtualConv, setVirtualConv] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  
  // 3. Refs
  const messagesAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 4. Derived State (Optimization: Memoize active conversation)
  const activeConversation = useMemo(() => {
    if (virtualConv) return virtualConv;
    return conversations?.find(c => c._id === selectedId) || null;
  }, [conversations, selectedId, virtualConv]);

  // Derived state for online presence
  const otherUserIds = useMemo(() => {
    if (!conversations) return [];
    return Array.from(new Set(conversations.map((c) => c.otherUserId).filter(Boolean)));
  }, [conversations]);

  // 5. Messages Query
  // Conditional query: Pass 'skip' if we don't have users, avoiding "never" casts
  const queryArgs = activeConversation?.otherUserId 
    ? { 
        listingId: activeConversation.listingId as Id<"listings"> | undefined, 
        userA: userId, 
        userB: activeConversation.otherUserId 
      } 
    : 'skip';
    
  const messages = useQuery(api.messages.getConversation, queryArgs) || [];

  const sendMessageMutation = useMutation(api.messages.send);
  const markReadMutation = useMutation(api.messages.markConversationAsRead);

  // Focus: Typing and Presence Setup
  const onlineStatusMap = useQuery(
    api.presence.getOnlineUsers,
    otherUserIds.length > 0 ? { userIds: otherUserIds } : 'skip'
  ) || {};
  const heartbeatMutation = useMutation(api.presence.heartbeat);
  const setTypingMutation = useMutation(api.typing.setTyping);
  const typingRecord = useRef<{ [convId: string]: number }>({});

  const typingUsers = useQuery(
    api.typing.getActiveTyping,
    activeConversation && !activeConversation._id.startsWith("virtual")
      ? { conversationId: activeConversation._id, currentUserId: userId }
      : "skip"
  ) || [];

  // 6. Effects

  // Heartbeat for online presence
  useEffect(() => {
    if (!userId) return;
    const ping = () => heartbeatMutation({ userId }).catch(() => {});
    ping();
    const interval = setInterval(ping, 30000); // Send heartbeat every 30s
    return () => clearInterval(interval);
  }, [userId, heartbeatMutation]);

  // Handle URL Params (Deep linking)
  useEffect(() => {
    const listingId = searchParams.get('listingId') || searchParams.get('listing');
    const type = searchParams.get('type');

    if (!conversations) return;

    if (listingId) {
      const found = conversations.find((c) => c.listingId === listingId);
      if (found) {
        setSelectedId(found._id);
        setVirtualConv(null);
      } else if (newConversationListing?._id === listingId) {
        // Create Virtual Conversation
        setVirtualConv({
          _id: `virtual-${listingId}`,
          type: 'LISTING',
          listingId,
          buyerId: userId,
          sellerId: newConversationListing.userId,
          lastMessageAt: Date.now(),
          otherUserId: newConversationListing.userId,
          listing: newConversationListing,
          otherUser: { name: "Seller" }, // Placeholder
        });
        setSelectedId(null);
      }
    } else if (type === 'SUPPORT') {
      const found = conversations.find((c) => c.type === 'SUPPORT');
      if (found) {
        setSelectedId(found._id);
        setVirtualConv(null);
      } else {
        setVirtualConv({
          _id: 'virtual-support',
          type: 'SUPPORT',
          buyerId: userId,
          sellerId: 'ADMIN',
          otherUserId: 'ADMIN',
          lastMessageAt: Date.now(),
        });
        setSelectedId(null);
      }
    }
  }, [conversations, newConversationListing, searchParams, userId]);

  // Mark Read
  useEffect(() => {
    if (activeConversation?.unreadCount && activeConversation.unreadCount > 0) {
      markReadMutation({
        listingId: activeConversation.listingId as Id<"listings"> | undefined,
        userId,
        otherUserId: activeConversation.otherUserId,
      });
    }
  }, [activeConversation, markReadMutation, userId]);

  // Scroll to bottom whenever messages update or conversation changes
  useLayoutEffect(() => {
    const el = messagesAreaRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, activeConversation?._id]);

  // 7. Handlers (Optimization: useCallback)
  
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    // Optimistic clear
    const msgContent = newMessage;
    setNewMessage(''); 

    try {
      if (activeConversation && !activeConversation._id.startsWith("virtual")) {
          setTypingMutation({ conversationId: activeConversation._id, userId, isTyping: false }).catch(() => {});
      }

      await sendMessageMutation({
        content: msgContent,
        listingId: activeConversation.listingId as Id<"listings"> | undefined,
        senderId: userId,
        receiverId: activeConversation.otherUserId,
        type: activeConversation.type as any, // Convex types might vary
      });
    } catch (error) {
      toast.error("Failed to send message");
      setNewMessage(msgContent); // Rollback on error
    }
  }, [newMessage, activeConversation, sendMessageMutation, setTypingMutation, userId]);

  const handleTyping = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    if (!activeConversation || activeConversation._id.startsWith("virtual")) return;

    if (e.target.value.trim() === '') {
        setTypingMutation({ conversationId: activeConversation._id, userId, isTyping: false });
        return;
    }

    const now = Date.now();
    const lastTyped = typingRecord.current[activeConversation._id] || 0;
    
    // Throttle typing indicators to DB to avoid hitting limits
    if (now - lastTyped > 2500) {
      typingRecord.current[activeConversation._id] = now;
      setTypingMutation({ conversationId: activeConversation._id, userId, isTyping: true });
    }
  }, [activeConversation, setTypingMutation, userId]);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeConversation) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const data = await uploadFileWithProgress(file, setUploadProgress);
      
      if (data.success && data.url) {
        await sendMessageMutation({
          content: 'Sent an image',
          imageUrl: data.url,
          listingId: activeConversation.listingId as Id<"listings"> | undefined,
          senderId: userId,
          receiverId: activeConversation.otherUserId,
          type: activeConversation.type as any,
        });
        toast.success('Image sent');
      }
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [activeConversation, sendMessageMutation, userId]);

  // 8. Filter Logic (Optimization: useMemo)
  const filteredConversations = useMemo(() => {
    if (!conversations) return [];
    if (!searchQuery) return conversations;
    
    const query = searchQuery.toLowerCase();
    return conversations.filter((conv) => {
      const titleMatch = conv.listing?.title.toLowerCase().includes(query);
      const nameMatch = conv.otherUser?.name?.toLowerCase().includes(query);
      const supportMatch = conv.type === 'SUPPORT' && 'support'.includes(query);
      return titleMatch || nameMatch || supportMatch;
    });
  }, [conversations, searchQuery]);

  return (
    <div className="space-y-3 md:space-y-4 h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-1 shrink-0">
        <div className="p-2 bg-primary/10 rounded-xl">
          <MessageSquare className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Messages</h1>
          <p className="text-xs text-muted-foreground font-medium">
            {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 min-h-0">
        
        {/* ── Sidebar ── */}
        <div className={cn(
          "bg-card border rounded-2xl flex flex-col overflow-hidden shadow-sm",
          activeConversation ? "hidden lg:flex" : "flex"
        )}>
          {/* Search */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-muted/50 border-0"
              />
            </div>
          </div>

          {/* List */}
          <ScrollArea className="flex-1">
            <div className="divide-y divide-border/40">
              {virtualConv && (
                <ConversationItem
                  conversation={virtualConv}
                  isSelected={true}
                  onClick={() => {}}
                />
              )}
              {filteredConversations.map((conv) => (
                <ConversationItem
                  key={conv._id}
                  conversation={conv}
                  isSelected={selectedId === conv._id}
                  isOnline={!!onlineStatusMap[conv.otherUserId]}
                  onClick={() => {
                    setSelectedId(conv._id);
                    setVirtualConv(null);
                  }}
                />
              ))}
              {filteredConversations.length === 0 && !virtualConv && (
                <div className="p-8 text-center text-muted-foreground">
                  <p className="text-sm">No messages found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* ── Chat Window ── */}
        <div className={cn(
          "bg-card border rounded-2xl flex flex-col overflow-hidden shadow-sm",
          activeConversation ? "flex" : "hidden lg:flex"
        )}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-3 border-b flex items-center gap-3 shrink-0 bg-background/50 backdrop-blur-sm z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden -ml-2"
                  onClick={() => {
                    setSelectedId(null);
                    setVirtualConv(null);
                  }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>

                {/* Dynamic Header Content */}
                {activeConversation.type === 'SUPPORT' ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                       <ShieldAlert className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Support Team</p>
                      {typingUsers.length > 0 ? (
                         <p className="text-xs text-primary animate-pulse font-medium">Support is typing...</p>
                      ) : (
                         <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <p className="text-xs text-muted-foreground">Online Help Desk</p>
                         </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link href={`/listings/${activeConversation.listingId}`} className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted border">
                      {activeConversation.listing?.thumbnail && (
                        <Image
                          src={activeConversation.listing.thumbnail}
                          alt="Thumbnail"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                            {activeConversation.listing?.title || "Unknown Item"}
                          </p>
                      </div>
                      <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-primary">
                            €{activeConversation.listing?.price?.toLocaleString() ?? 0}
                          </p>
                          {typingUsers.length > 0 ? (
                             <span className="text-[10px] text-green-600 dark:text-green-500 animate-pulse font-medium bg-green-500/10 px-1.5 rounded-full lowercase">
                                {activeConversation.otherUser?.name || "User"} is typing...
                             </span>
                          ) : onlineStatusMap[activeConversation.otherUserId] ? (
                             <div className="flex items-center gap-1 bg-green-500/10 px-1.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <span className="text-[10px] text-green-600 dark:text-green-400 font-medium tracking-wide">Online</span>
                             </div>
                          ) : null}
                      </div>
                    </div>
                  </Link>
                )}
              </div>

              {/* Messages Area */}
              <div
                ref={messagesAreaRef}
                className="flex-1 overflow-y-auto p-4 bg-slate-50/50 dark:bg-slate-900/20"
              >
                <div className="flex flex-col justify-end min-h-full gap-4">
                  {messages.length === 0 && (
                    <div className="flex-1 flex items-center justify-center opacity-30">
                      <div className="text-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2" />
                        <p className="font-bold uppercase tracking-widest">Start Chatting</p>
                      </div>
                    </div>
                  )}
                  {messages.map((msg) => (
                    <MessageBubble
                      key={msg._id}
                      message={msg}
                      isOwn={msg.senderId === userId}
                      otherUser={activeConversation.otherUser}
                    />
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-3 border-t bg-background shrink-0">
                {uploadProgress !== null && (
                  <div className="h-1 w-full bg-muted mb-3 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex gap-2 relative"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                  </Button>
                  
                  <Input
                    value={newMessage}
                    onChange={handleTyping}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full px-4 border-muted-foreground/20 focus-visible:ring-primary/20"
                    disabled={isUploading}
                  />
                  
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="rounded-full shadow-md"
                    disabled={!newMessage.trim() && !isUploading}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-Components (Memoized) ────────────────────────────────────────────────

const ConversationItem = memo(function ConversationItem({
  conversation,
  isSelected,
  isOnline,
  onClick,
}: {
  conversation: Conversation;
  isSelected: boolean;
  isOnline?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-3 flex items-start gap-3 hover:bg-muted/50 transition-all text-left border-l-2",
        isSelected 
          ? "bg-primary/5 border-l-primary" 
          : "border-l-transparent"
      )}
    >
      <div className="relative shrink-0">
        {conversation.type === 'SUPPORT' ? (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-primary" />
          </div>
        ) : (
          <div className="relative">
             <UserAvatar user={conversation.otherUser} className="w-10 h-10 border" />
             {isOnline && (
                 <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
             )}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex justify-between items-center mb-0.5">
          <span className="font-bold text-sm truncate">
            {conversation.type === 'SUPPORT' 
              ? "Support" 
              : (conversation.otherUser?.name || "User")}
          </span>
          <span className="text-[10px] text-muted-foreground shrink-0">
            {formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: false })}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className={cn(
            "text-xs truncate max-w-[140px]",
            conversation.unreadCount ? "font-semibold text-foreground" : "text-muted-foreground"
          )}>
            {conversation.lastMessage || "Attachment"}
          </p>
          {conversation.unreadCount ? (
            <Badge className="h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full bg-primary">
              {conversation.unreadCount}
            </Badge>
          ) : null}
        </div>
      </div>
    </button>
  );
});

const MessageBubble = memo(function MessageBubble({
  message,
  isOwn,
  otherUser,
}: {
  message: Message;
  isOwn: boolean;
  otherUser?: Conversation['otherUser'];
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-2 w-full", isOwn ? "justify-end" : "justify-start")}
    >
      {!isOwn && (
        <UserAvatar user={otherUser} className="w-6 h-6 self-end mb-1" />
      )}
      <div className={cn(
        "max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm",
        isOwn 
          ? "bg-primary text-primary-foreground rounded-br-none" 
          : "bg-white dark:bg-slate-800 border rounded-bl-none"
      )}>
        {message.imageUrl && (
          <div className="mb-2 relative aspect-video w-56 rounded-lg overflow-hidden bg-black/10">
            <Image 
              src={message.imageUrl} 
              alt="attachment" 
              fill 
              className="object-cover" 
              sizes="300px"
            />
          </div>
        )}
        <p className="whitespace-pre-wrap break-words leading-relaxed">
          {message.content}
        </p>
        <p className={cn(
          "text-[10px] text-right mt-1 opacity-70",
          isOwn ? "text-primary-foreground" : "text-muted-foreground"
        )}>
          {formatDistanceToNow(message.createdAt)}
        </p>
      </div>
    </motion.div>
  );
});