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
  MessageSquare,
  Search,
  Send,
  ShieldAlert,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { api } from '../../../convex/_generated/api';

interface Message {
  _id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: number;
  read: boolean;
}

interface Conversation {
  _id: string;
  type?: 'LISTING' | 'SUPPORT';
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
  newConversationListing?: {
    _id: string;
    title: string;
    price: number;
    thumbnail?: string;
    images: string[];
    userId: string;
  } | null;
}

export function MessagesClient({
  conversations: initialConversations,
  userId,
  newConversationListing,
}: MessagesClientProps) {
  const conversations = (useQuery(api.messages.getConversations, { userId }) as Conversation[] | undefined) || initialConversations;
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [virtualConversation, setVirtualConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = (useQuery(api.messages.getConversation, 
    selectedConversation ? {
      listingId: selectedConversation.listingId as any,
      userA: userId,
      userB: selectedConversation.otherUserId
    } : "skip"
  ) as Message[] | undefined) || [];

  const sendMessageMutation = useMutation(api.messages.send);
  const markReadMutation = useMutation(api.messages.markConversationAsRead);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const searchParams = useSearchParams();

  useEffect(() => {
    const listingIdParam = searchParams.get('listingId') || searchParams.get('listing');
    const type = searchParams.get('type');
    
    if (conversations) {
      if (listingIdParam) {
        const found = conversations.find((c) => c.listingId === listingIdParam);
        if (found) {
          handleSelectConversation(found);
        } else if (newConversationListing && newConversationListing._id === listingIdParam) {
            // Start virtual chat for listing
            setVirtualConversation({
                _id: 'virtual-listing-' + listingIdParam,
                type: 'LISTING',
                listingId: listingIdParam,
                buyerId: userId,
                sellerId: newConversationListing.userId,
                otherUserId: newConversationListing.userId,
                lastMessageAt: Date.now(),
                listing: newConversationListing,
                otherUser: (newConversationListing as any).seller,
            } as any);
        }
      } else if (type === 'SUPPORT') {
        const found = conversations.find((c) => c.type === 'SUPPORT');
        if (found) {
          handleSelectConversation(found);
        } else {
          // Virtual support conversation
          setVirtualConversation({
            _id: 'virtual-support',
            type: 'SUPPORT',
            buyerId: userId,
            sellerId: 'ADMIN',
            otherUserId: 'ADMIN',
            lastMessageAt: Date.now(),
          } as any);
        }
      }
    }
  }, [conversations, userId, newConversationListing]);

  const handleSelectConversation = async (conversation: Conversation) => {
    setVirtualConversation(null);
    setSelectedConversation(conversation);
    if (conversation.unreadCount && conversation.unreadCount > 0) {
      await markReadMutation({
        listingId: (conversation.listingId as any) || undefined,
        userId: userId,
        otherUserId: conversation.otherUserId,
      });
    }
  };

  const activeConversation = selectedConversation || virtualConversation;

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;
    try {
      await sendMessageMutation({
        content: newMessage,
        listingId: (activeConversation.listingId as any) || undefined,
        senderId: userId,
        receiverId: activeConversation.otherUserId,
        type: activeConversation.type,
      });
      setNewMessage('');
      // If it was virtual, the query will eventually pick up the new real conversation
      // and the useEffect will select it.
    } catch (error) {
      console.error("Failed to send", error);
    }
  };

  const filteredConversations = (conversations || []).filter((conv) => {
    const titleMatch = conv.listing?.title.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const supportMatch = conv.type === 'SUPPORT' && 'support'.includes(searchQuery.toLowerCase());
    return titleMatch || supportMatch;
  });

  const showChatOnMobile = !!activeConversation;

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg md:rounded-xl">
          <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-base md:text-xl font-black tracking-tight text-foreground">Messages</h1>
          <p className="text-[10px] md:text-xs text-muted-foreground font-medium">
            {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-0 lg:gap-3 h-[calc(100vh-180px)] md:h-[calc(100vh-200px)]">
        
        {/* Conversations Sidebar */}
        <div className={cn(
          "bg-card border border-border rounded-xl md:rounded-2xl flex flex-col overflow-hidden",
          showChatOnMobile ? "hidden lg:flex" : "flex"
        )}>
          {/* Search */}
          <div className="p-2.5 md:p-3 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 md:h-9 text-xs md:text-sm bg-muted/50 border-0 rounded-lg focus-visible:ring-1"
              />
            </div>
          </div>

          {/* Conversation List */}
          <ScrollArea className="flex-1">
            {(filteredConversations.length > 0 || virtualConversation) ? (
              <div className="divide-y divide-border/50">
                {virtualConversation && (
                  <ConversationItem
                    conversation={virtualConversation}
                    isSelected={true}
                    onClick={() => {}}
                  />
                )}
                {filteredConversations.map((conversation) => (
                  <ConversationItem
                    key={conversation._id}
                    conversation={conversation}
                    isSelected={selectedConversation?._id === conversation._id}
                    onClick={() => handleSelectConversation(conversation)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                  <MessageSquare className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  {searchQuery ? 'No results' : 'No messages yet'}
                </p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={cn(
          "bg-card border border-border rounded-xl md:rounded-2xl flex flex-col overflow-hidden",
          showChatOnMobile ? "flex" : "hidden lg:flex"
        )}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-2.5 md:p-3 border-b border-border/50 flex items-center gap-2.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-7 w-7 rounded-lg"
                  onClick={() => {
                      setSelectedConversation(null);
                      setVirtualConversation(null);
                  }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Button>

                {activeConversation.type === 'SUPPORT' ? (
                  <div className="flex items-center gap-2.5 flex-1 p-1.5 rounded-lg min-w-0">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-xs md:text-sm text-foreground">Big Market Support</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground font-medium">Internal Help Desk</p>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={`/listings/${activeConversation.listingId}`}
                    className="flex items-center gap-2.5 flex-1 hover:bg-muted/50 p-1.5 rounded-lg transition-colors min-w-0"
                  >
                    {activeConversation.listing?.thumbnail && (
                      <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image
                          src={activeConversation.listing.thumbnail}
                          alt={activeConversation.listing.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs md:text-sm line-clamp-1 text-foreground">
                        {activeConversation.listing?.title}
                      </p>
                      <p className="text-[10px] md:text-xs text-primary font-bold">
                        €{activeConversation.listing?.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                )}
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-3 md:p-4">
                <div className="space-y-2.5 md:space-y-3">
                  {messages.length > 0 ? (
                    messages.map((message: any) => (
                      <MessageBubble
                        key={message._id}
                        message={message}
                        isOwn={message.senderId === userId}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-center opacity-40">
                      <MessageSquare className="w-8 h-8 mb-2" />
                      <p className="text-xs font-bold uppercase tracking-widest">No messages yet</p>
                      <p className="text-[10px] max-w-[150px] mx-auto">Send your first message to start the conversation.</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-2.5 md:p-3 border-t border-border/50 bg-muted/30 relative z-[60]">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2 md:gap-3"
                >
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 md:h-10 md:w-10 rounded-xl shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        // Form onSubmit will handle this
                      }
                    }}
                    className="flex-1 h-10 md:h-11 text-sm md:text-base bg-background border-border rounded-xl focus-visible:ring-primary shadow-sm px-4"
                  />
                  <Button
                    type="submit"
                    disabled={!newMessage.trim() || !activeConversation}
                    size="icon"
                    className="h-10 w-10 md:h-11 md:w-11 rounded-xl shrink-0 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6 md:w-7 md:h-7 text-muted-foreground" />
              </div>
              <h3 className="text-sm md:text-base font-bold text-foreground mb-1">
                Select a conversation
              </h3>
              <p className="text-[10px] md:text-xs text-muted-foreground font-medium max-w-[200px]">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Conversation Item Component
function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}) {
  const timeAgo = formatDistanceToNow(new Date(conversation.lastMessageAt), {
    addSuffix: true,
  });

  const isSupport = conversation.type === 'SUPPORT';

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-2.5 md:p-3 flex items-start gap-2.5 hover:bg-muted/50 transition-colors text-left",
        isSelected && "bg-primary/5 border-l-2 border-l-primary"
      )}
    >
      {isSupport ? (
        <div className="shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldAlert className="w-5 h-5 text-primary" />
        </div>
      ) : (
        <UserAvatar 
          user={conversation.otherUser || ({ id: conversation.otherUserId } as any)}
          fallbackText={(conversation.otherUser?.name || conversation.otherUserId).substring(0, 2).toUpperCase()}
          className="shrink-0 w-9 h-9 md:w-10 md:h-10"
        />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1.5 mb-0.5">
          <p className="font-bold text-xs md:text-sm line-clamp-1 text-foreground">
            {isSupport ? "Big Market Support" : (conversation.listing?.title || "Unknown Listing")}
          </p>
          <span className="text-[9px] md:text-[10px] text-muted-foreground shrink-0 font-medium mt-0.5">
            {timeAgo}
          </span>
        </div>
        <p className="text-[11px] md:text-xs text-muted-foreground line-clamp-1 mb-1">
          {conversation.lastMessage}
        </p>
        <div className="flex items-center gap-1.5">
          {!isSupport && (
            <span className="text-[10px] md:text-xs font-bold text-primary">
              €{conversation.listing?.price.toLocaleString()}
            </span>
          )}
          {conversation.unreadCount && conversation.unreadCount > 0 && (
            <Badge className="h-4 min-w-4 px-1 text-[9px] font-bold bg-primary text-primary-foreground rounded-full">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}

// Message Bubble Component
function MessageBubble({
  message,
  isOwn,
}: {
  message: Message;
  isOwn: boolean;
}) {
  const timeAgo = formatDistanceToNow(new Date(message.createdAt), {
    addSuffix: true,
  });

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-3 py-2",
          isOwn
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-muted rounded-bl-sm'
        )}
      >
        <p className={cn(
          "text-xs md:text-sm whitespace-pre-wrap break-words",
          isOwn ? "text-white" : "text-foreground"
        )}>
          {message.content}
        </p>
        <p
          className={cn(
            "text-[9px] md:text-[10px] mt-0.5",
            isOwn ? 'text-white/70' : 'text-muted-foreground'
          )}
        >
          {timeAgo}
        </p>
      </div>
    </div>
  );
}
