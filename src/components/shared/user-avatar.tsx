import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import * as React from "react"

interface UserAvatarProps extends React.ComponentPropsWithoutRef<typeof Avatar> {
  user: {
    name?: string | null
    image?: string | null
  } | null | undefined
  fallbackText?: string
  fallbackClassName?: string
}

export function UserAvatar({ 
  user, 
  fallbackText,
  fallbackClassName, 
  className,
  ...props 
}: UserAvatarProps) {
  const imageUrl = user?.image 
    ? (user.image.startsWith('http') || user.image.startsWith('/') ? user.image : `/${user.image}`) 
    : '';

  const initials = React.useMemo(() => {
    if (fallbackText) return fallbackText;
    const nameToUse = (user as any)?.accountType === 'COMPANY' && (user as any)?.companyName 
        ? (user as any).companyName 
        : (user?.name || '');
        
    if (!nameToUse) return 'U';
    
    const parts = nameToUse.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return nameToUse.slice(0, 2).toUpperCase();
  }, [user, fallbackText]);

  return (
    <Avatar className={className} {...props}>
      {imageUrl && <AvatarImage src={imageUrl} alt={user?.name || ''} className="object-cover" />}
      <AvatarFallback 
        className={cn(
          "bg-muted text-muted-foreground font-bold",
          fallbackClassName
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
