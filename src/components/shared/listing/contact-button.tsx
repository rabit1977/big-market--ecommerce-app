'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { VariantProps } from 'class-variance-authority';
import { Mail, MessageSquare } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface ContactSellerButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  sellerId: string;
  listingId?: string;
  sellerName?: string;
}

/**
 * Professional Shared Contact Button
 * Handles logic for internal chat (logged in) vs guest inquiries
 */
export function ContactSellerButton({ 
  sellerId, 
  listingId, 
  sellerName,
  className,
  variant = 'default',
  size = 'default',
  ...props 
}: ContactSellerButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  
  const isLoggedIn = !!session?.user;
  const isOwner = session?.user?.id === sellerId;

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOwner) return;

    startTransition(() => {
      if (isLoggedIn) {
        // Internal Chat
        const url = listingId 
            ? `/messages?listingId=${listingId}&recipientId=${sellerId}`
            : `/messages?recipientId=${sellerId}`;
        router.push(url);
      } else {
        // Guest Inquiry
        const url = listingId
            ? `/contact?listingId=${listingId}&sellerId=${sellerId}`
            : `/contact?sellerId=${sellerId}`;
        router.push(url);
      }
    });
  };

  if (isOwner) return null;

  return (
    <Button
      onClick={handleContact}
      disabled={isPending}
      variant={variant}
      size={size}
      className={className}
      {...props}
    >
      {isLoggedIn ? (
        <><MessageSquare className="w-4 h-4 mr-2" /> Message {sellerName || 'Seller'}</>
      ) : (
        <><Mail className="w-4 h-4 mr-2" /> Contact {sellerName || 'Seller'}</>
      )}
    </Button>
  );
}
