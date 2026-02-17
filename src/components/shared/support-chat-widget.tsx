'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserAvatar } from '@/components/shared/user-avatar';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
    Headset, 
    MessageCircle, 
    Send, 
    X, 
    User,
    ShieldCheck,
    ArrowLeft,
    Search
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import { api } from '../../../convex/_generated/api';
import { formatDistanceToNow } from 'date-fns';

export function SupportChatWidget() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState<string | null>(null);
  const [selectedUserObj, setSelectedUserObj] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const ADMIN_ID = 'ADMIN';
  const userId = session?.user?.id;
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  // --- REGULAR USER QUERIES ---
  const userMessages = useQuery(api.messages.getConversation, 
    !isAdmin && isOpen && userId ? {
      listingId: undefined,
      userA: userId,
      userB: ADMIN_ID
    } : "skip"
  ) || [];

  // --- ADMIN QUERIES ---
  const adminConversations = useQuery(api.messages.getSupportConversations, 
    isAdmin && isOpen ? {} : "skip"
  ) || [];

  const adminActiveMessages = useQuery(api.messages.getConversation, 
    isAdmin && isOpen && activeChatUser ? {
      listingId: undefined,
      userA: ADMIN_ID,
      userB: activeChatUser
    } : "skip"
  ) || [];

  const totalUnreadForAdmin = useQuery(api.messages.getTotalSupportUnread, 
    isAdmin ? {} : "skip"
  ) || 0;

  const sendMessage = useMutation(api.messages.send);
  const markRead = useMutation(api.messages.markConversationAsRead);

  // Mark as read logic
  useEffect(() => {
    // User marks admin messages as read
    if (!isAdmin && isOpen && userId && userMessages.length > 0) {
      markRead({ listingId: undefined, userId: userId, otherUserId: ADMIN_ID }).catch(console.error);
    }
    // Admin marks user messages as read
    if (isAdmin && isOpen && activeChatUser && adminActiveMessages.length > 0) {
      markRead({ listingId: undefined, userId: ADMIN_ID, otherUserId: activeChatUser }).catch(console.error);
    }
  }, [isOpen, userId, userMessages.length, adminActiveMessages.length, isAdmin, activeChatUser, markRead]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [userMessages, adminActiveMessages, isOpen, activeChatUser]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    try {
      await sendMessage({
        content: newMessage,
        senderId: isAdmin ? ADMIN_ID : userId,
        receiverId: isAdmin ? (activeChatUser!) : ADMIN_ID,
        type: 'SUPPORT'
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send support message:', error);
    }
  };

  const filteredAdminsConversations = adminConversations.filter(c => 
    c.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.otherUser?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[550px] bg-card border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isAdmin && activeChatUser ? (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => { setActiveChatUser(null); setSelectedUserObj(null); }}
                        className="h-8 w-8 hover:bg-primary-foreground/10 text-primary-foreground"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                ) : (
                    <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                        <Headset className="h-6 w-6" />
                    </div>
                )}
                <div>
                  <h3 className="font-bold text-sm">
                    {isAdmin 
                        ? (activeChatUser ? selectedUserObj?.name : 'Support Inbox') 
                        : 'Customer Support'}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] opacity-80 uppercase font-bold tracking-wider">
                        {isAdmin && !activeChatUser ? `${adminConversations.length} Active Chats` : 'Online'}
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="hover:bg-primary-foreground/10 text-primary-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative flex flex-col bg-background">
              {!userId ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold">Sign in to chat</h4>
                    <p className="text-sm text-muted-foreground">Log in to contact our support team.</p>
                  </div>
                </div>
              ) : isAdmin && !activeChatUser ? (
                // --- ADMIN LIST VIEW ---
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-3 border-b bg-muted/20">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input 
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 h-8 text-xs bg-background"
                            />
                        </div>
                    </div>
                    <ScrollArea className="flex-1">
                        {filteredAdminsConversations.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground text-sm">
                                No active support chats.
                            </div>
                        ) : (
                            <div className="divide-y">
                                {filteredAdminsConversations.map((conv) => (
                                    <button
                                        key={conv._id}
                                        onClick={() => {
                                            setActiveChatUser(conv.otherUserId);
                                            setSelectedUserObj(conv.otherUser);
                                        }}
                                        className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left group"
                                    >
                                        <div className="relative">
                                            <UserAvatar user={conv.otherUser} className="h-10 w-10 border" />
                                            {conv.unreadCount > 0 && (
                                                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-background" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <span className="font-bold text-sm truncate">{conv.otherUser?.name || 'User'}</span>
                                                <span className="text-[10px] text-muted-foreground">{formatDistanceToNow(conv.lastMessageAt, { addSuffix: true })}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate italic">"{conv.lastMessage}"</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                    <div className="p-3 bg-muted/10 border-t text-[10px] text-center text-muted-foreground">
                        Select a user to begin responding to their inquiry
                    </div>
                </div>
              ) : (
                // --- CHAT VIEW (Admin-to-User or User-to-Admin) ---
                <>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {/* Initial Message (Only for regular users) */}
                      {!isAdmin && (
                        <div className="flex justify-start">
                           <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-3 text-sm max-w-[85%]">
                             <p className="font-medium mb-1">Big Market Support</p>
                             <p>Hi! How can we help you today? We're usually online to help with technical issues.</p>
                           </div>
                        </div>
                      )}

                      {(isAdmin ? adminActiveMessages : userMessages).map((msg) => {
                        const isMe = isAdmin ? msg.senderId === ADMIN_ID : msg.senderId === userId;
                        return (
                            <div key={msg._id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                              <div className={cn(
                                "max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                                isMe ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-foreground rounded-bl-none"
                              )}>
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                <p className={cn("text-[9px] mt-1 opacity-70", isMe ? "text-right" : "text-left")}>
                                  {formatDistanceToNow(msg.createdAt, { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                        );
                      })}
                      <div ref={scrollRef} />
                    </div>
                  </ScrollArea>

                  <div className="p-4 border-t bg-muted/30">
                    <form onSubmit={handleSend} className="flex gap-2">
                      <Input 
                        placeholder="Type a response..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="bg-background shadow-inner"
                      />
                      <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                    <p className="text-[10px] text-center text-muted-foreground mt-2 flex items-center justify-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> {isAdmin ? 'Direct Admin Reply' : 'Secure support channel'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button - Now Draggable vertically */}
      <motion.button
        drag="y"
        dragConstraints={{ top: -700, bottom: 0 }}
        dragElastic={0.05}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-[110] relative",
          isOpen ? "bg-card border rotate-90" : "bg-primary text-primary-foreground"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-foreground" />
        ) : (
          <MessageCircle className="h-7 w-7" />
        )}
        
        {/* Real-time Unread Badge */}
        {!isOpen && (isAdmin ? totalUnreadForAdmin > 0 : false) && (
            <div className="absolute -top-1 -right-1 h-6 w-6 bg-red-600 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white shadow-lg animate-pulse">
                {totalUnreadForAdmin > 9 ? '9+' : totalUnreadForAdmin}
            </div>
        )}
        
        {/* Simple User Notification Dot */}
        {!isOpen && !isAdmin && (
            <div className="absolute top-0 right-0 h-4 w-4 bg-emerald-500 rounded-full border-2 border-background animate-pulse" />
        )}
      </motion.button>
    </div>
  );
}
