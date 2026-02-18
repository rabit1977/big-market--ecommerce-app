'use client';

import { UserAvatar } from '@/components/shared/user-avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import {
  ArrowLeft,
  Headset,
  Loader2,
  MessageCircle,
  Search,
  Send,
  ShieldCheck,
  User,
  X
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

export function SupportChatWidget() {
  const { data: session } = useSession();
  
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState<string | null>(null);
  const [selectedUserObj, setSelectedUserObj] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false); // Track dragging state

  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Constants
  const ADMIN_ID = 'ADMIN';
  const userId = session?.user?.id;
  const userRole = (session?.user as { role?: string })?.role;
  const isAdmin = userRole === 'ADMIN';

  // --- QUERIES ---

  // 1. Regular User Messages
  const userMessages = useQuery(api.messages.getConversation, 
    !isAdmin && isOpen && userId ? {
      listingId: undefined,
      userA: userId,
      userB: ADMIN_ID
    } : "skip"
  ) || [];

  // 2. Admin: List of Conversations
  const adminConversations = useQuery(api.messages.getSupportConversations, 
    isAdmin && isOpen ? {} : "skip"
  ) || [];

  // 3. Admin: Active Chat Messages
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

  // Mutations
  const sendMessage = useMutation(api.messages.send);
  const markRead = useMutation(api.messages.markConversationAsRead);

  // --- EFFECTS ---

  // 1. Handle Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // 2. Optimized Mark as Read (Only fires if unread items exist)
  useEffect(() => {
    const markAsReadSafe = async (targetUserId: string, selfId: string) => {
      try {
        await markRead({ listingId: undefined, userId: selfId, otherUserId: targetUserId });
      } catch (err) {
        console.error("Failed to mark read", err);
      }
    };

    // User Scenario
    if (!isAdmin && isOpen && userId && userMessages.length > 0) {
      // Check if the last message is NOT from me and is NOT read (Optimistic check could go here)
      const lastMsg = userMessages[userMessages.length - 1];
      if (lastMsg.senderId !== userId && !lastMsg.read) {
        markAsReadSafe(ADMIN_ID, userId);
      }
    }

    // Admin Scenario
    if (isAdmin && isOpen && activeChatUser && adminActiveMessages.length > 0) {
      const lastMsg = adminActiveMessages[adminActiveMessages.length - 1];
      if (lastMsg.senderId !== ADMIN_ID && !lastMsg.read) {
         markAsReadSafe(activeChatUser, ADMIN_ID);
      }
    }
  }, [isOpen, userId, userMessages, adminActiveMessages, isAdmin, activeChatUser, markRead]);

  // 3. Smooth Scroll to Bottom (useLayoutEffect prevents visual jitter)
  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [userMessages.length, adminActiveMessages.length, isOpen, activeChatUser]);

  // --- HANDLERS ---

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    const content = newMessage;
    setNewMessage(''); // Optimistic clear

    try {
      await sendMessage({
        content,
        senderId: isAdmin ? ADMIN_ID : userId,
        receiverId: isAdmin ? (activeChatUser!) : ADMIN_ID,
        type: 'SUPPORT'
      });
    } catch (error) {
      setNewMessage(content); // Restore on failure
      console.error('Failed to send:', error);
    }
  };

  // Logic to prevent click when dragging
  const onDragEnd = (event: any, info: PanInfo) => {
    // If moved more than 3 pixels, consider it a drag, not a click
    if (Math.abs(info.offset.x) > 3 || Math.abs(info.offset.y) > 3) {
      setIsDragging(true);
      setTimeout(() => setIsDragging(false), 100); // Reset after short delay
    }
  };

  // Filter Admin Convos
  const filteredAdminsConversations = adminConversations.filter(c => 
    c.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.otherUser?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = isAdmin ? adminActiveMessages : userMessages;

  return (
    <div ref={widgetRef} className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] flex flex-col items-end pointer-events-none">
      {/* pointer-events-none on wrapper allows clicking through empty space, 
         but we must re-enable pointer-events-auto on children 
      */}
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="pointer-events-auto mb-4 w-[90vw] sm:w-[400px] h-[80dvh] sm:h-[550px] bg-card border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between shadow-md z-10">
              <div className="flex items-center gap-3">
                {isAdmin && activeChatUser ? (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => { setActiveChatUser(null); setSelectedUserObj(null); }}
                        className="h-8 w-8 hover:bg-primary-foreground/10 text-primary-foreground -ml-2"
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
            <div className="flex-1 overflow-hidden relative flex flex-col bg-background min-h-0">
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
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input 
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 h-9 text-xs bg-background/50 border-transparent focus:bg-background transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto overscroll-contain">
                        {filteredAdminsConversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                                <MessageCircle className="h-8 w-8 opacity-20" />
                                <p className="text-sm">No active support chats.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border/40">
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
                                            <p className="text-xs text-muted-foreground truncate opacity-80 group-hover:opacity-100">
                                                {conv.lastMessage}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
              ) : (
                // --- CHAT VIEW ---
                <>
                  <div className="flex-1 overflow-y-auto overscroll-contain p-4 bg-slate-50 dark:bg-slate-900/50">
                    <div className="space-y-4">
                      {!isAdmin && (
                        <div className="flex justify-start animate-in slide-in-from-left-2 duration-300">
                           <div className="bg-white dark:bg-card border rounded-2xl rounded-bl-none px-4 py-3 text-sm max-w-[85%] shadow-sm">
                             <p className="font-bold text-primary mb-1 text-xs">Big Market Support</p>
                             <p>Hi! How can we help you today? We're usually online to help with technical issues.</p>
                           </div>
                        </div>
                      )}

                      {currentMessages.map((msg) => {
                        const isMe = isAdmin ? msg.senderId === ADMIN_ID : msg.senderId === userId;
                        return (
                            <div key={msg._id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                              <div className={cn(
                                "max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                                isMe 
                                    ? "bg-primary text-primary-foreground rounded-br-none" 
                                    : "bg-white dark:bg-card border text-foreground rounded-bl-none"
                              )}>
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                <p className={cn(
                                    "text-[9px] mt-1 opacity-70", 
                                    isMe ? "text-right text-primary-foreground/80" : "text-left text-muted-foreground"
                                )}>
                                  {formatDistanceToNow(msg.createdAt)}
                                </p>
                              </div>
                            </div>
                        );
                      })}
                      <div ref={scrollRef} />
                    </div>
                  </div>

                  <div className="p-3 border-t bg-background">
                    <form onSubmit={handleSend} className="flex gap-2">
                      <Input 
                        placeholder="Type a response..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="bg-muted/30 border-transparent focus:bg-background focus:border-primary/20 transition-all rounded-full px-4"
                      />
                      <Button 
                        type="submit" 
                        size="icon" 
                        disabled={!newMessage.trim()}
                        className="rounded-full h-10 w-10 shrink-0"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                    <p className="text-[10px] text-center text-muted-foreground mt-2 flex items-center justify-center gap-1.5 opacity-70">
                      <ShieldCheck className="h-3 w-3" /> 
                      {isAdmin ? 'Direct Admin Reply' : 'Secure Encrypted Channel'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        drag 
        dragConstraints={{ top: -500, left: -300, right: 0, bottom: 0 }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragEnd={onDragEnd}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
            // Only toggle if we aren't dragging
            if (!isDragging) setIsOpen(!isOpen);
        }}
        className={cn(
          "pointer-events-auto h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-2xl flex items-center justify-center transition-colors duration-300 relative",
          isOpen ? "bg-card border text-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-7 w-7" />
        )}
        
        {/* Unread Badge */}
        {!isOpen && (
             (isAdmin && totalUnreadForAdmin > 0) || 
             (!isAdmin && userMessages.some(m => !m.read && m.senderId === ADMIN_ID))
        ) && (
            <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white shadow-sm animate-pulse">
              {isAdmin ? (totalUnreadForAdmin > 9 ? '9+' : totalUnreadForAdmin) : 1}
            </div>
        )}
      </motion.button>
    </div>
  );
}