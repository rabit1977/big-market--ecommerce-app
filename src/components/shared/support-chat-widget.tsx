'use client';

import { UserAvatar } from '@/components/shared/user-avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion, PanInfo, useMotionValue } from 'framer-motion';
import {
    ArrowLeft,
    Headset,
    MessageCircle,
    Search,
    Send,
    ShieldCheck,
    User,
    X
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

// ─── Constants ────────────────────────────────────────────────────────────────

const ADMIN_ID = 'ADMIN';
const DRAG_THRESHOLD = 3; // px

// ─── Component ────────────────────────────────────────────────────────────────

export function SupportChatWidget() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const isAdmin = (session?.user as { role?: string })?.role === 'ADMIN';

  const [isOpen, setIsOpen] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState<string | null>(null);
  const [selectedUserObj, setSelectedUserObj] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  // Use ref for drag detection — no re-render needed
  const isDraggingRef = useRef(false);
  // Controlled motion values so the icon stays centered during/after drag
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // ── Queries ───────────────────────────────────────────────────────────────

  const userMessages = useQuery(
    api.messages.getConversation,
    !isAdmin && isOpen && userId
      ? { listingId: undefined, userA: userId, userB: ADMIN_ID }
      : 'skip'
  ) ?? [];

  const adminConversations = useQuery(
    api.messages.getSupportConversations,
    isAdmin && isOpen ? {} : 'skip'
  ) ?? [];

  const adminActiveMessages = useQuery(
    api.messages.getConversation,
    isAdmin && isOpen && activeChatUser
      ? { listingId: undefined, userA: ADMIN_ID, userB: activeChatUser }
      : 'skip'
  ) ?? [];

  const totalUnreadForAdmin = useQuery(
    api.messages.getTotalSupportUnread,
    isAdmin ? {} : 'skip'
  ) ?? 0;

  const sendMessage = useMutation(api.messages.send);
  const markRead = useMutation(api.messages.markConversationAsRead);

  const currentMessages = isAdmin ? adminActiveMessages : userMessages;

  // ── Effects ───────────────────────────────────────────────────────────────

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Mark as read
  useEffect(() => {
    if (!isOpen || !userId) return;

    const markSafe = async (targetId: string, selfId: string) => {
      try {
        await markRead({ listingId: undefined, userId: selfId, otherUserId: targetId });
      } catch {
        // Silent — non-critical
      }
    };

    if (!isAdmin && userMessages.length > 0) {
      const last = userMessages[userMessages.length - 1];
      if (last.senderId !== userId && !last.read) markSafe(ADMIN_ID, userId);
    }

    if (isAdmin && activeChatUser && adminActiveMessages.length > 0) {
      const last = adminActiveMessages[adminActiveMessages.length - 1];
      if (last.senderId !== ADMIN_ID && !last.read) markSafe(activeChatUser, ADMIN_ID);
    }
  }, [isOpen, userId, userMessages, adminActiveMessages, isAdmin, activeChatUser, markRead]);

  // Scroll to bottom
  useLayoutEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [currentMessages.length, isOpen, activeChatUser]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSend = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    const content = newMessage;
    setNewMessage('');

    try {
      await sendMessage({
        content,
        senderId: isAdmin ? ADMIN_ID : userId,
        receiverId: isAdmin ? activeChatUser! : ADMIN_ID,
        type: 'SUPPORT',
      });
    } catch {
      toast.error('Failed to send message');
      setNewMessage(content);
    }
  }, [newMessage, userId, isAdmin, activeChatUser, sendMessage]);

  const handleDragEnd = useCallback((_: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > DRAG_THRESHOLD || Math.abs(info.offset.y) > DRAG_THRESHOLD) {
      isDraggingRef.current = true;
      setTimeout(() => { isDraggingRef.current = false; }, 100);
    }
  }, []);

  const handleToggle = useCallback(() => {
    if (!isDraggingRef.current) setIsOpen((prev) => !prev);
  }, []);

  const handleBackToList = useCallback(() => {
    setActiveChatUser(null);
    setSelectedUserObj(null);
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────

  const filteredConversations = useMemo(() =>
    adminConversations.filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        c.otherUser?.name?.toLowerCase().includes(q) ||
        c.otherUser?.email?.toLowerCase().includes(q)
      );
    }),
    [adminConversations, searchQuery]
  );

  const hasUserUnread = useMemo(
    () => userMessages.some((m) => !m.read && m.senderId === ADMIN_ID),
    [userMessages]
  );

  const showUnreadBadge = !isOpen && (
    (isAdmin && totalUnreadForAdmin > 0) || (!isAdmin && hasUserUnread)
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      ref={widgetRef}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] flex flex-col items-end pointer-events-none"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="pointer-events-auto mb-4 w-[90vw] sm:w-[360px] h-[80dvh] sm:h-[500px] bg-card border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Support chat"
          >
            {/* Header */}
            <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between shadow-md z-10">
              <div className="flex items-center gap-3">
                {isAdmin && activeChatUser ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBackToList}
                    className="h-8 w-8 hover:bg-primary-foreground/10 text-primary-foreground -ml-2"
                    aria-label="Back to conversations"
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
                      {isAdmin && !activeChatUser
                        ? `${adminConversations.length} Active Chats`
                        : 'Online'}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-10 w-10 hover:bg-white/20 text-white rounded-full bg-black/5"
                aria-label="Close support chat"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Content */}
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
                // Admin list view
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
                    {filteredConversations.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                        <MessageCircle className="h-8 w-8 opacity-20" />
                        <p className="text-sm">No active support chats.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border/40">
                        {filteredConversations.map((conv) => (
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
                                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-background" aria-hidden="true" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="font-bold text-sm truncate">{conv.otherUser?.name ?? 'User'}</span>
                                <span className="text-[10px] text-muted-foreground">
                                  {formatDistanceToNow(conv.lastMessageAt, { addSuffix: true })}
                                </span>
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
                // Chat view
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
                          <div key={msg._id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                            <div className={cn(
                              'max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm',
                              isMe
                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                : 'bg-white dark:bg-card border text-foreground rounded-bl-none'
                            )}>
                              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                              <p className={cn(
                                'text-[9px] mt-1 opacity-70',
                                isMe ? 'text-right text-primary-foreground/80' : 'text-left text-muted-foreground'
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
                        aria-label="Message input"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={!newMessage.trim()}
                        className="rounded-full h-10 w-10 shrink-0"
                        aria-label="Send message"
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

      {/* Toggle button - only shown when closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="chat-toggle"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            drag
            style={{ x: dragX, y: dragY }}
            dragConstraints={{ top: -500, left: -300, right: 0, bottom: 0 }}
            dragElastic={0.1}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggle}
            aria-label="Open support chat"
            className="pointer-events-auto h-11 w-11 sm:h-12 sm:w-12 rounded-full shadow-2xl transition-colors duration-300 relative bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <span className="absolute inset-0 flex items-center justify-center">
              <MessageCircle className="h-6 w-6" />
            </span>

            {showUnreadBadge && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 rounded-full border-2 border-background flex items-center justify-center text-[9px] font-bold text-white shadow-sm animate-pulse" aria-label="Unread messages">
                {isAdmin ? (totalUnreadForAdmin > 9 ? '9+' : totalUnreadForAdmin) : 1}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}