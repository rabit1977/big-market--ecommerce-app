'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface SignOutButtonProps {
    className?: string;
}

export function SignOutButton({ className }: SignOutButtonProps) {
    return (
        <Button 
            onClick={() => signOut({ callbackUrl: '/' })}
            variant="outline" 
            size="lg" 
            className={className}
        >
            <LogOut className="h-4 w-4" />
            Sign Out
        </Button>
    );
}
