'use client';

import { UserAvatar } from '@/components/shared/user-avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { useConvex, useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Image as ImageIcon, Loader2, Search, Send, ShieldAlert } from 'lucide-react';
import Image from 'next/image';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { CommunicationFilters } from './communication-filters';

// ─── Types ────────────────────────────────────────────────────────────────────

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
  type?: 'SUPPORT' | 'LISTING';
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

const ADMIN_ID = 'ADMIN' as const;

// ─── Component ────────────────────────────────────────────────────────────────


export function AdminSupportChatClient() {
  const convex = useConvex();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ from?: number; to?: number } | undefined>();

  const { results: conversations, status, loadMore } = usePaginatedQuery(
    api.messages.getSupportConversations,
    {
      search: searchQuery || undefined,
      startDate: dateRange?.from,
      endDate: dateRange?.to,
    },
    { initialNumItems: 15 }
  ) as { results: Conversation[], status: string, loadMore: (n: number) => void };

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const [isExporting, setIsExporting] = useState(false);
  const handleExport = async () => {
    if (conversations.length === 0) {
        toast.error("No conversations to export");
        return;
    }
    
    setIsExporting(true);
    toast.info("Preparing export...");

    try {
        // We fetch the full list for export to ensure we don't just export the currently loaded page
        const allConversations = await convex.query(api.messages.exportSupport);
        
        const headers = ["Date", "User", "Email", "Last Message", "Unread"];
        const csvContent = [
            headers.join(","),
            ...allConversations.map((c: any) => [
                new Date(c.lastMessageAt || 0).toLocaleDateString(),
                `"${c.otherUser?.name || 'User'}"`,
                `"${c.otherUser?.email || ''}"`,
                `"${(c.lastMessage || '').replace(/"/g, '""')}"`,
                (c.buyerId === ADMIN_ID ? c.buyerUnreadCount : c.sellerUnreadCount) || 0
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `support_chats_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Export complete");
    } catch (error) {
        toast.error("Failed to export conversations");
        console.error(error);
    } finally {
        setIsExporting(false);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const hasAutoSelected = useRef(false);

  // Auto-select first conversation once on initial load
  useEffect(() => {
    if (!hasAutoSelected.current && conversations && conversations.length > 0) {
      setSelectedConversation(conversations[0]);
      hasAutoSelected.current = true;
    }
  }, [conversations]);

  const messages = (useQuery(
    api.messages.getConversation,
    selectedConversation
      ? { listingId: undefined, userA: ADMIN_ID, userB: selectedConversation.otherUserId }
      : 'skip',
  ) as Message[] | undefined) ?? [];

  const sendMessageMutation = useMutation(api.messages.send);
  const markReadMutation = useMutation(api.messages.markConversationAsRead);

  // Mark as read — debounced 500ms
  useEffect(() => {
    if (!selectedConversation || messages.length === 0) return;
    const timer = setTimeout(() => {
      markReadMutation({
        listingId: undefined,
        userId: ADMIN_ID,
        otherUserId: selectedConversation.otherUserId,
      }).catch(console.error);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedConversation, messages.length, markReadMutation]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, selectedConversation]);

  // Abort any in-flight XHR on unmount
  useEffect(() => {
    return () => xhrRef.current?.abort();
  }, []);



  // ── Send message ───────────────────────────────────────────────────────────
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    try {
      await sendMessageMutation({
        content: newMessage,
        senderId: ADMIN_ID,
        receiverId: selectedConversation.otherUserId,
        type: 'SUPPORT',
      });
      setNewMessage('');
    } catch {
      toast.error('Failed to send message');
    }
  }, [newMessage, selectedConversation, sendMessageMutation]);

  // ── Image upload ───────────────────────────────────────────────────────────
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset input immediately so the same file can be re-selected
    e.target.value = '';
    if (!file || !selectedConversation) return;

    // Validate file type & size (5 MB) before hitting the network
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are supported');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5 MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const data = await new Promise<{ success: boolean; url?: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;

        xhr.upload.addEventListener('progress', ({ lengthComputable, loaded, total }) => {
          if (lengthComputable) setUploadProgress((loaded / total) * 100);
        });
        xhr.addEventListener('load', () => {
          xhr.status >= 200 && xhr.status < 300
            ? resolve(JSON.parse(xhr.responseText))
            : reject(new Error('Upload failed'));
        });
        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
        xhr.addEventListener('abort', () => reject(new Error('abort')));
        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });

      if (data.success && data.url) {
        await sendMessageMutation({
          content: 'Sent an image',
          imageUrl: data.url,
          senderId: ADMIN_ID,
          receiverId: selectedConversation.otherUserId,
          type: 'SUPPORT',
        });
        toast.success('Image sent');
      }
    } catch (error) {
      if ((error as Error).message !== 'abort') {
        toast.error('Failed to upload image');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  }, [selectedConversation, sendMessageMutation]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <CommunicationFilters 
        onSearch={setSearchQuery}
        onDateChange={(range) => setDateRange(range ? { from: range.from?.getTime(), to: range.to?.getTime() } : undefined)}
        onExport={handleExport}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-0 h-[600px] border border-border rounded-lg overflow-hidden bg-card shadow-none">

        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <div className={cn(
          'flex flex-col border-r border-border bg-secondary/10',
          selectedConversation ? 'hidden lg:flex' : 'flex',
        )}>
          <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 scrollbar-hide">
            {status === "LoadingFirstPage" ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2 opacity-50">
                 <Loader2 className="h-6 w-6 animate-spin text-primary" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Loading...</span>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center space-y-4">
                <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center mx-auto border border-border">
                    <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                    <p className="text-sm font-bold">No results found</p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">Try adjusting your filters or search term.</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {conversations.map((conv) => (
                  <ConversationRow
                    key={conv._id}
                    conv={conv}
                    isSelected={selectedConversation?._id === conv._id}
                    onSelect={setSelectedConversation}
                  />
                ))}
                {status === "CanLoadMore" && (
                  <div className="p-4 bg-muted/5">
                     <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-[10px] font-bold uppercase tracking-widest h-8 rounded-lg border-border" 
                        onClick={() => loadMore(15)}
                    >
                        Load More
                     </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      {/* ── Chat Area ─────────────────────────────────────────────────────── */}
      <div className={cn(
        'flex flex-col bg-background min-h-0 overflow-hidden',
        !selectedConversation ? 'hidden lg:flex' : 'flex',
      )}>
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="px-4 py-3 border-b border-border flex items-center gap-3 bg-muted/30 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-8 w-8 rounded-lg"
                onClick={() => setSelectedConversation(null)}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <UserAvatar user={selectedConversation.otherUser} className="w-8 h-8 md:w-10 md:h-10 border border-border rounded-lg" />
              <div className="min-w-0">
                <h3 className="font-bold text-sm truncate">{selectedConversation.otherUser?.name}</h3>
                <p className="text-[10px] text-muted-foreground font-medium truncate">{selectedConversation.otherUser?.email}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-secondary/5 min-h-0">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg._id}
                    msg={msg}
                    otherUser={selectedConversation.otherUser}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Upload progress */}
            {uploadProgress !== null && (
              <div className="px-4 py-1">
                <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border bg-card">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
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
                  className="h-10 w-10 text-muted-foreground hover:bg-secondary rounded-lg"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <ImageIcon className="w-5 h-5" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 h-10 rounded-lg bg-secondary/30 border-border font-medium"
                />
                <Button type="submit" size="icon" className="h-10 w-10 rounded-lg shadow-none" disabled={!newMessage.trim() || isUploading}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center border border-border">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <p className="font-bold text-foreground">Moderation Chat</p>
              <p className="text-sm font-medium">Select a conversation from the sidebar to start moderating.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}

// ─── Memoized sub-components ──────────────────────────────────────────────────

const ConversationRow = memo(function ConversationRow({
  conv,
  isSelected,
  onSelect,
}: {
  conv: Conversation;
  isSelected: boolean;
  onSelect: (conv: Conversation) => void;
}) {
  return (
    <button
      onClick={() => onSelect(conv)}
      className={cn(
        'w-full p-4 flex items-start gap-3 transition-colors text-left relative group',
        isSelected ? 'bg-secondary border-r-2 border-primary' : 'hover:bg-secondary/40',
      )}
    >
      <UserAvatar user={conv.otherUser} className="w-10 h-10 border border-border bg-background shrink-0 rounded-lg" />
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex justify-between items-center mb-0.5">
          <span className="font-bold text-sm truncate">{conv.otherUser?.name ?? 'User'}</span>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight whitespace-nowrap ml-2">
            {formatDistanceToNow(new Date(conv.lastMessageAt))} ago
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate font-medium">{conv.lastMessage || 'No messages'}</p>
      </div>
      {(conv.unreadCount ?? 0) > 0 && (
        <div className="h-2 w-2 bg-primary rounded-full shrink-0 mt-1.5" />
      )}
    </button>
  );
});

const MessageBubble = memo(function MessageBubble({
  msg,
  otherUser,
}: {
  msg: Message;
  otherUser: Conversation['otherUser'];
}) {
  const isAdmin = msg.senderId === ADMIN_ID;
  return (
    <div className={cn('flex gap-2', isAdmin ? 'justify-end' : 'justify-start')}>
      {!isAdmin && (
        <UserAvatar user={otherUser} className="w-6 h-6 self-end mb-1 shrink-0 rounded-md border border-border" />
      )}
      <div className={cn(
        'max-w-[85%] rounded-lg px-3 py-2 text-sm border shadow-none',
        isAdmin
          ? 'bg-primary text-primary-foreground border-primary/20'
          : 'bg-card border-border text-foreground',
      )}>
        {msg.imageUrl && (
          <div className="relative aspect-video w-48 rounded-lg overflow-hidden mb-2 border border-border/50">
            <Image src={msg.imageUrl} alt="Attachment" fill className="object-cover" />
          </div>
        )}
        <p className={cn(
          "whitespace-pre-wrap break-words leading-relaxed !m-0 font-medium",
          isAdmin ? "text-white" : "text-foreground"
        )}>{msg.content}</p>
        <p className={cn(
          'text-[9px] mt-1 font-bold uppercase tracking-tight opacity-70',
          isAdmin ? 'text-right' : 'text-left',
        )}>
          {formatDistanceToNow(new Date(msg.createdAt))} ago
        </p>
      </div>
    </div>
  );
});