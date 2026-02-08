'use client';

import { UserAvatar } from '@/components/shared/user-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMutation, useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import {
    ArrowLeft,
    Image as ImageIcon,
    MessageSquare,
    MoreVertical,
    Search,
    Send,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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
  listingId: string;
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
}

interface MessagesClientProps {
  conversations: Conversation[];
  userId: string;
}

export function MessagesClient({
  conversations: initialConversations, // We can use this as initial data or just ignore if we want purely dynamic
  userId,
}: MessagesClientProps) {
  // Use Convex Query for real-time updates
  const conversations = (useQuery(api.messages.getConversations, { userId }) as Conversation[] | undefined) || initialConversations;
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Messages Query
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

  // Handle initial selection from URL if present
  useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const listingId = params.get('listingId');
      if (listingId && conversations) {
          const found = conversations.find(c => c.listingId === listingId);
          if (found) {
              handleSelectConversation(found);
          }
      }
  }, [conversations]);

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    
    // Mark as read
    if (conversation.unreadCount && conversation.unreadCount > 0) {
        await markReadMutation({
            listingId: conversation.listingId as any,
            userId: userId,
            otherUserId: conversation.otherUserId
        });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
        await sendMessageMutation({
            content: newMessage,
            listingId: selectedConversation.listingId as any,
            senderId: userId,
            receiverId: selectedConversation.otherUserId,
        });
        setNewMessage('');
    } catch (error) {
        console.error("Failed to send", error);
    }
  };

  const filteredConversations = (conversations || []).filter((conv) =>
    conv.listing?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container-wide max-w-7xl">
        <h1 className="text-4xl font-bold mb-8">Messages</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="flex flex-col overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Conversation List */}
            <ScrollArea className="flex-1">
              {filteredConversations.length > 0 ? (
                <div className="divide-y text-left">
                  {filteredConversations.map((conversation) => (
                    <ConversationItem
                      key={conversation._id}
                      conversation={conversation}
                      isSelected={
                        selectedConversation?._id === conversation._id
                      }
                      onClick={() => handleSelectConversation(conversation)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? 'No conversations found'
                      : 'No messages yet'}
                  </p>
                </div>
              )}
            </ScrollArea>
          </Card>

          {/* Chat Area */}
          <Card className="flex flex-col overflow-hidden">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>

                  <Link
                    href={`/listings/${selectedConversation.listingId}`}
                    className="flex items-center gap-3 flex-1 hover:bg-muted/50 p-2 rounded-lg transition-colors"
                  >
                    {selectedConversation.listing?.thumbnail && (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image
                          src={selectedConversation.listing.thumbnail}
                          alt={selectedConversation.listing.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold line-clamp-1">
                        {selectedConversation.listing?.title}
                      </p>
                      <p className="text-sm text-primary font-bold">
                        €{selectedConversation.listing?.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>

                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message: any) => (
                      <MessageBubble
                        key={message._id}
                        message={message}
                        isOwn={message.senderId === userId}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Select a conversation
                </h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            )}
          </Card>
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

  return (
    <button
      onClick={onClick}
      className={`
        w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left
        ${isSelected ? 'bg-muted' : ''}
      `}
    >
      <UserAvatar 
        user={{ id: conversation.otherUserId } as any}
        fallbackText={conversation.otherUserId.substring(0, 2).toUpperCase()}
        className="shrink-0"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="font-semibold line-clamp-1">
            {conversation.listing?.title}
          </p>
          <span className="text-xs text-muted-foreground shrink-0">
            {timeAgo}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
          {conversation.lastMessage}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-primary">
            €{conversation.listing?.price.toLocaleString()}
          </span>
          {conversation.unreadCount && conversation.unreadCount > 0 && (
            <Badge variant="destructive" className="h-5 min-w-5 px-1.5">
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
        className={`
          max-w-[70%] rounded-2xl px-4 py-2
          ${
            isOwn
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-muted rounded-bl-sm'
          }
        `}
      >
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <p
          className={`
            text-xs mt-1
            ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}
          `}
        >
          {timeAgo}
        </p>
      </div>
    </div>
  );
}
