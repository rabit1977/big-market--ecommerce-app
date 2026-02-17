'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Headset,
    MessageCircle,
    Send,
    ShieldCheck,
    User,
    X
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import { api } from '../../../convex/_generated/api';

export function SupportChatWidget() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const ADMIN_ID = 'ADMIN';
  const userId = session?.user?.id;

  // Fetch messages if open and logged in
  const messages = useQuery(api.messages.getConversation, 
    isOpen && userId ? {
      listingId: undefined,
      userA: userId,
      userB: ADMIN_ID
    } : "skip"
  ) || [];

  const sendMessage = useMutation(api.messages.send);
  const markRead = useMutation(api.messages.markConversationAsRead);

  // Mark as read when opening or receiving messages
  useEffect(() => {
    if (isOpen && userId && messages.length > 0) {
      markRead({
        listingId: undefined,
        userId: userId,
        otherUserId: ADMIN_ID
      }).catch(console.error);
    }
  }, [isOpen, userId, messages.length, markRead]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    try {
      await sendMessage({
        content: newMessage,
        senderId: userId,
        receiverId: ADMIN_ID,
        type: 'SUPPORT'
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send support message:', error);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-card border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Headset className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Customer Support</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] opacity-80 uppercase font-bold tracking-wider">Online</span>
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

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden relative flex flex-col">
              {!userId ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold">Sign in to chat</h4>
                    <p className="text-sm text-muted-foreground">
                      Please log in to your account to start a conversation with our support team.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {/* Initial Greeting */}
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-3 text-sm max-w-[85%]">
                          <p className="font-medium mb-1">Big Market Support</p>
                          <p>Hi there! 👋 How can we help you today? Whether it&apos;s a technical issue or a question about our services, we&apos;re here for you.</p>
                        </div>
                      </div>

                      {/* Messages */}
                      {messages.map((msg) => (
                        <div 
                          key={msg._id} 
                          className={cn(
                            "flex",
                            msg.senderId === userId ? "justify-end" : "justify-start"
                          )}
                        >
                          <div className={cn(
                            "max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                            msg.senderId === userId 
                              ? "bg-primary text-primary-foreground rounded-br-none" 
                              : "bg-muted text-foreground rounded-bl-none"
                          )}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            <p className={cn(
                              "text-[9px] mt-1 opacity-70",
                              msg.senderId === userId ? "text-right" : "text-left"
                            )}>
                              {formatDistanceToNow(msg.createdAt, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={scrollRef} />
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="p-4 border-t bg-muted/30">
                    <form onSubmit={handleSend} className="flex gap-2">
                      <Input 
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="bg-background"
                      />
                      <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                    <p className="text-[10px] text-center text-muted-foreground mt-2 flex items-center justify-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Secure support channel
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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300",
          isOpen ? "bg-card border rotate-90" : "bg-primary text-primary-foreground"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-foreground" />
        ) : (
          <MessageCircle className="h-7 w-7" />
        )}
        
        {/* Pulsing indicator if unread messages (optional) */}
        {!isOpen && (
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-background animate-bounce" />
        )}
      </motion.button>
    </div>
  );
}
