'use client';

import { UserAvatar } from '@/components/shared/user-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Image as ImageIcon, Search, Send, ShieldAlert } from 'lucide-react';
import Image from 'next/image';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

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
  const conversations = useQuery(api.messages.getSupportConversations) as Conversation[] | undefined;

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

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

  // ── Filtered conversations ─────────────────────────────────────────────────
  const filteredConversations = useMemo(() => {
    if (!conversations) return [];
    const q = searchQuery.toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (conv) =>
        conv.otherUser?.name?.toLowerCase().includes(q) ||
        conv.otherUser?.email?.toLowerCase().includes(q),
    );
  }, [conversations, searchQuery]);

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
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-0 lg:gap-4 h-[600px] border rounded-xl overflow-hidden bg-card shadow-sm">

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <div className={cn(
        'flex flex-col border-r border-border bg-muted/10',
        selectedConversation ? 'hidden lg:flex' : 'flex',
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
          {filteredConversations.length === 0 ? (
            <p className="p-6 text-center text-muted-foreground text-sm">
              No support conversations found.
            </p>
          ) : (
            <div className="divide-y divide-border/50">
              {filteredConversations.map((conv) => (
                <ConversationRow
                  key={conv._id}
                  conv={conv}
                  isSelected={selectedConversation?._id === conv._id}
                  onSelect={setSelectedConversation}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* ── Chat Area ─────────────────────────────────────────────────────── */}
      <div className={cn(
        'flex flex-col bg-background',
        !selectedConversation ? 'hidden lg:flex' : 'flex',
      )}>
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-3 border-b flex items-center gap-3 shadow-sm z-10">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSelectedConversation(null)}
                aria-label="Back to conversations"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <UserAvatar user={selectedConversation.otherUser} className="w-8 h-8 md:w-10 md:h-10 border" />
              <div>
                <h3 className="font-bold text-sm md:text-base">{selectedConversation.otherUser?.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedConversation.otherUser?.email}</p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
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
            </ScrollArea>

            {/* Upload progress */}
            {uploadProgress !== null && (
              <div className="px-3 pb-1">
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t bg-muted/10">
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
                  aria-label="Upload image"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  aria-label="Attach image"
                >
                  <ImageIcon className="w-5 h-5 text-muted-foreground" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a reply..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim() || isUploading}>
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
        'w-full p-3 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left relative',
        isSelected && 'bg-primary/5 border-l-2 border-l-primary',
      )}
    >
      <UserAvatar user={conv.otherUser} className="w-10 h-10 border bg-background shrink-0" />
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-sm truncate">{conv.otherUser?.name ?? 'User'}</span>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
            {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
      </div>
      {(conv.unreadCount ?? 0) > 0 && (
        <Badge className="h-2 w-2 p-0 rounded-full shrink-0 mt-1" />
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
        <UserAvatar user={otherUser} className="w-6 h-6 self-end mb-1 shrink-0" />
      )}
      <div className={cn(
        'max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm',
        isAdmin
          ? 'bg-primary text-primary-foreground rounded-br-none'
          : 'bg-muted text-foreground rounded-bl-none',
      )}>
        {msg.imageUrl && (
          <div className="relative aspect-video w-48 rounded-lg overflow-hidden mb-2">
            <Image src={msg.imageUrl} alt="Image attachment" fill className="object-cover" />
          </div>
        )}
        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
        <p className={cn(
          'text-[9px] mt-1 text-right opacity-70',
          isAdmin ? 'text-primary-foreground' : 'text-muted-foreground',
        )}>
          {formatDistanceToNow(msg.createdAt, { addSuffix: true })}
        </p>
      </div>
    </div>
  );
});