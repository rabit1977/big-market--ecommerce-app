'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { VariantProps } from 'class-variance-authority';
import { ChevronRight, Mail, MessageCircle, MessageSquare, Phone } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

interface ContactSellerButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  sellerId: string;
  listingId?: string;
  sellerName?: string;
  label?: React.ReactNode;
  contactPhone?: string | null;
  contactEmail?: string | null;
  listingTitle?: string;
}

/**
 * Professional Shared Contact Button
 * Handles logic for internal chat (logged in) vs guest inquiries
 */
export function ContactSellerButton({ 
  sellerId, 
  listingId, 
  sellerName,
  label,
  contactPhone,
  contactEmail,
  listingTitle,
  className,
  variant = 'default',
  size = 'default',
  ...props 
}: ContactSellerButtonProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  
  const isLoggedIn = !!session?.user;
  const isOwner = session?.user?.id === sellerId;

  if (isOwner) return null;

  const hasPhone = Boolean(contactPhone);
  const hasEmail = Boolean(contactEmail);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          {...props}
        >
          {label ? (
            label
          ) : isLoggedIn ? (
            <><MessageSquare className="w-4 h-4 mr-2" /> Message {sellerName || 'Seller'}</>
          ) : (
            <><Mail className="w-4 h-4 mr-2" /> Contact {sellerName || 'Seller'}</>
          )}
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="max-w-sm rounded-[2rem] p-0 overflow-hidden border-2 shadow-2xl">
        <div className="bg-primary/5 border-b border-border px-6 py-6">
          <AlertDialogTitle className="text-xl font-black tracking-tight uppercase">
            Contact {sellerName || 'Seller'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wider">
            {listingTitle ? `Inquiry about: ${listingTitle}` : 'Choose how you\'d like to get in touch'}
          </AlertDialogDescription>
        </div>

        <div className="px-5 py-5 space-y-3">
          {/* Call */}
          {hasPhone && (
            <a
              href={`tel:${contactPhone}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-green-500/50 hover:bg-green-500/5 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm uppercase">Call</p>
                <p className="text-xs text-muted-foreground font-mono truncate">{contactPhone}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-green-500 transition-colors" />
            </a>
          )}

          {/* SMS */}
          {hasPhone && (
            <a
              href={`sms:${contactPhone}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm uppercase">SMS</p>
                <p className="text-xs text-muted-foreground font-mono truncate">{contactPhone}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-blue-500 transition-colors" />
            </a>
          )}

          {/* WhatsApp */}
          {hasPhone && (
            <a
              href={`https://wa.me/${contactPhone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello, I'm interested in ${listingTitle ? `your listing: ${listingTitle}` : 'one of your items'} on Biggest Market.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-green-600/50 hover:bg-green-600/5 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-green-600/10 flex items-center justify-center shrink-0 group-hover:bg-green-600/20 transition-colors">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-green-700 uppercase">WhatsApp</p>
                <p className="text-xs text-muted-foreground truncate font-bold">Chat now</p>
              </div>
              <ChevronRight className="w-4 h-4 text-green-600/40 group-hover:text-green-600 transition-colors" />
            </a>
          )}

          {/* Viber */}
          {hasPhone && (
            <a
              href={`viber://chat?number=%2B${contactPhone?.replace(/\D/g, '')}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-violet-600/50 hover:bg-violet-600/5 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-violet-600/10 flex items-center justify-center shrink-0 group-hover:bg-violet-600/20 transition-colors">
                <Phone className="w-5 h-5 text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-violet-700 uppercase">Viber</p>
                <p className="text-xs text-muted-foreground truncate font-bold">Message on Viber</p>
              </div>
              <ChevronRight className="w-4 h-4 text-violet-600/40 group-hover:text-violet-600 transition-colors" />
            </a>
          )}

          {/* Email */}
          {hasEmail && (
            <a
              href={`mailto:${contactEmail}?subject=${encodeURIComponent(listingTitle ? `Inquiry about: ${listingTitle}` : 'Inquiry from Biggest Market')}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 group-hover:bg-orange-500/20 transition-colors">
                <Mail className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm uppercase">Email</p>
                <p className="text-xs text-muted-foreground truncate font-bold">{contactEmail}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-orange-500 transition-colors" />
            </a>
          )}

          {/* Internal Chat */}
          {isLoggedIn && (
            <Link
              href={listingId ? `/messages?listingId=${listingId}` : `/messages?recipientId=${sellerId}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-primary uppercase">Chat on Platform</p>
                <p className="text-xs text-muted-foreground font-bold">Fastest Response</p>
              </div>
              <ChevronRight className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
            </Link>
          )}

          {/* Guest Inquiry - if not logged in */}
          {!isLoggedIn && (
             <Link
                href={listingId ? `/contact?listingId=${listingId}&sellerId=${sellerId}` : `/contact?sellerId=${sellerId}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 p-4 rounded-2xl border-2 border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 transition-all group"
             >
                <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors">
                    <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-primary uppercase">Send Inquiry</p>
                    <p className="text-xs text-muted-foreground font-bold">Contact via form</p>
                </div>
                <ChevronRight className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
             </Link>
          )}

          {!hasPhone && !hasEmail && !isLoggedIn && (
            <p className="text-sm text-muted-foreground text-center py-4 font-bold uppercase tracking-tighter">No contact details available</p>
          )}
        </div>

        <div className="px-5 pb-5 pt-0">
          <AlertDialogCancel className="w-full rounded-2xl font-black uppercase tracking-widest h-12 border-2 active:scale-95 transition-all">
            Cancel
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
