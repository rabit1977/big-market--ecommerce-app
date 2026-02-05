'use client';

import { usePathname } from 'next/navigation';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState, useTransition } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  isPending: boolean;
  activeCategory: string | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setActiveCategory: (categoryId: string | null) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  const open = useCallback(() => {
    startTransition(() => {
      setIsOpen(true);
    });
  }, []);

  const close = useCallback(() => {
    startTransition(() => {
      setIsOpen(false);
      // Optional: reset category on close? Maybe not, keeps state if reopened.
      // setActiveCategory(null); 
    });
  }, []);

  const toggle = useCallback(() => {
    startTransition(() => {
      setIsOpen((prev) => !prev);
    });
  }, []);

  // Auto-close on route change
  useEffect(() => {
    if (isOpen) {
      close();
    }
  }, [pathname, close]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, close]);

  return (
    <SidebarContext.Provider value={{ 
      isOpen, 
      isPending, 
      activeCategory, 
      open, 
      close, 
      toggle, 
      setActiveCategory 
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
