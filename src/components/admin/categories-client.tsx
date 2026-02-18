'use client';

import { UserAvatar } from '@/components/shared/user-avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Image as ImageIcon, Menu, MoreVertical, Search, Send } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
  _id: string;
  content: string;
  senderId: string;
  createdAt: number;
  imageUrl?: string;
};

type Conversation = {
  _id: string;
  otherUserId: string;
  lastMessageAt: number;
  lastMessage?: string;
  unreadCount?: number;
  otherUser?: {
    name?: string;
    image?: string;
    email?: string;
  };
};

const ADMIN_ID = 'ADMIN' as const;

// ─── Main Container ───────────────────────────────────────────────────────────

export function AdminSupportChatClient() {
  // Convex Hooks
  const conversations = useQuery(api.messages.getSupportConversations);
  
  // State
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Derived State
  const selectedConversation = useMemo(
    () => conversations?.find((c) => c._id === selectedId) || null,
    [conversations, selectedId]
  );

  // Auto-select first on desktop load (React 19 Effect)
  useEffect(() => {
    if (!selectedId && conversations?.length && window.innerWidth >= 1024) {
      setSelectedId(conversations[0]._id);
    }
  }, [conversations, selectedId]);

  return (
    <div className="flex h-[85vh] w-full flex-col overflow-hidden rounded-2xl border bg-background shadow-xl md:flex-row">
      
      {/* ── Desktop Sidebar (Hidden on Mobile) ── */}
      <div className="hidden w-80 border-r md:flex md:flex-col">
        <ConversationList 
          conversations={conversations} 
          selectedId={selectedId} 
          onSelect={setSelectedId} 
        />
      </div>

      {/* ── Mobile Sidebar (Slide-over Sheet) ── */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-80 p-0 sm:w-[350px]">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Conversations</SheetTitle>
          </SheetHeader>
          <ConversationList 
            conversations={conversations} 
            selectedId={selectedId} 
            onSelect={(id) => {
              setSelectedId(id);
              setIsMobileMenuOpen(false); // Close sheet on select
            }} 
          />
        </SheetContent>
      </Sheet>

      {/* ── Chat Area ── */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {selectedConversation ? (
          <ChatWindow 
            conversation={selectedConversation} 
            onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
          />
        ) : (
          <EmptyState onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />
        )}
      </div>
    </div>
  );
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function ConversationList({ 
  conversations, 
  selectedId, 
  onSelect 
}: { 
  conversations?: Conversation[], 
  selectedId: string | null, 
  onSelect: (id: string) => void 
}) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!conversations) return [];
    if (!query) return conversations;
    const lower = query.toLowerCase();
    return conversations.filter(c => 
      c.otherUser?.name?.toLowerCase().includes(lower) || 
      c.otherUser?.email?.toLowerCase().includes(lower)
    );
  }, [conversations, query]);

  return (
    <div className="flex h-full flex-col bg-muted/30">
      <div className="p-4 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search messages..." 
            className="pl-9 bg-background/50 border-transparent focus:border-input focus:bg-background transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {!conversations ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No conversations found.
          </div>
        ) : (
          <div className="flex flex-col p-2 gap-1">
            {filtered.map((conv) => (
              <button
                key={conv._id}
                onClick={() => onSelect(conv._id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-muted",
                  selectedId === conv._id && "bg-primary/10 hover:bg-primary/15"
                )}
              >
                <div className="relative shrink-0">
                  <UserAvatar user={conv.otherUser} className="h-10 w-10 border shadow-sm" />
                  {!!conv.unreadCount && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-primary ring-2 ring-background">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                    </span>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className={cn("font-medium text-sm", selectedId === conv._id && "text-primary")}>
                      {conv.otherUser?.name || 'Unknown User'}
                    </span>
                    <span className="text-[10px] text-muted-foreground/70">
                      {formatDistanceToNow(conv.lastMessageAt, { addSuffix: false })}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground mt-0.5 font-light">
                    {conv.lastMessage || 'Sent an attachment'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

function ChatWindow({ 
  conversation, 
  onMobileMenuToggle 
}: { 
  conversation: Conversation, 
  onMobileMenuToggle: () => void 
}) {
 const messages = useQuery(api.messages.getConversation, {
  userA: ADMIN_ID,
  userB: conversation.otherUserId
}) as Message[] | undefined || [];
  
  const sendMessage = useMutation(api.messages.send);
  const markRead = useMutation(api.messages.markConversationAsRead);
  
  const [text, setText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mark Read Effect
  useEffect(() => {
    if (messages.length > 0) {
      markRead({
        userId: ADMIN_ID,
        otherUserId: conversation.otherUserId
      }).catch(() => {}); // silent fail
    }
  }, [messages.length, conversation._id, markRead]);

  // Auto Scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, conversation._id]);

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      await sendMessage({
        content: text,
        senderId: ADMIN_ID,
        receiverId: conversation.otherUserId,
        type: 'SUPPORT'
      });
      setText('');
    } catch {
      toast.error("Failed to send");
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Get upload URL
      const postUrl = await fetch(process.env.NEXT_PUBLIC_CONVEX_URL + '/api/upload', {
        method: 'POST',
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await postUrl.json();

      // 2. Send Message with ID (Assuming your backend handles storageId -> URL)
      await sendMessage({
        content: 'Image',
        imageUrl: storageId, // Ideally pass storageId and handle URL generation on backend or client
        senderId: ADMIN_ID,
        receiverId: conversation.otherUserId,
        type: 'SUPPORT'
      });
      toast.success("Uploaded!");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b px-4 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden -ml-2" 
            onClick={onMobileMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <UserAvatar user={conversation.otherUser} className="h-9 w-9 border" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">{conversation.otherUser?.name}</span>
            <span className="text-xs text-muted-foreground mt-1">{conversation.otherUser?.email}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden relative bg-slate-50 dark:bg-slate-950/30">
        <ScrollArea className="h-full px-4 py-6">
          <div className="flex flex-col gap-4 max-w-3xl mx-auto pb-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => {
                const isAdmin = msg.senderId === ADMIN_ID;
                return (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "flex w-full max-w-[75%]",
                      isAdmin ? "ml-auto justify-end" : "mr-auto"
                    )}
                  >
                    <div className={cn(
                      "relative rounded-2xl px-4 py-2.5 shadow-sm text-sm",
                      isAdmin 
                        ? "bg-primary text-primary-foreground rounded-br-sm" 
                        : "bg-white dark:bg-slate-900 border text-foreground rounded-bl-sm"
                    )}>
                      {msg.imageUrl && (
                        <div className="mb-2 relative aspect-video w-64 overflow-hidden rounded-lg border bg-muted">
                           {/* Handle URL resolution properly based on your backend */}
                          <Image src={msg.imageUrl} alt="Attachment" fill className="object-cover" />
                        </div>
                      )}
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      <span className={cn(
                        "text-[9px] block mt-1 opacity-70",
                        isAdmin ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}>
                        {formatDistanceToNow(msg.createdAt)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="p-4 bg-background border-t">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-end gap-2 max-w-3xl mx-auto relative bg-muted/30 p-1.5 rounded-3xl border focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleUpload} 
          />
          <Button 
            type="button" 
            size="icon" 
            variant="ghost" 
            className="h-9 w-9 rounded-full shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          
          <Input 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 min-h-[44px] py-3"
          />
          
          <Button 
            type="submit" 
            size="icon" 
            disabled={!text.trim() || isUploading}
            className="h-9 w-9 rounded-full shrink-0 shadow-sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </>
  );
}

function EmptyState({ onMobileMenuToggle }: { onMobileMenuToggle: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/20 text-center p-8">
      <div className="md:hidden absolute top-4 left-4">
        <Button variant="outline" size="icon" onClick={onMobileMenuToggle}>
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      <div className="bg-background p-4 rounded-full shadow-sm mb-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg">No Conversation Selected</h3>
      <p className="text-muted-foreground text-sm max-w-xs mt-2">
        Select a user from the sidebar to start chatting or resolve support tickets.
      </p>
    </div>
  );
}