'use client';

import { usePathname } from 'next/navigation';
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState, useTransition } from 'react';

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
  const isOpenRef = useRef(isOpen);

  // Keep ref in sync so the ESC handler can read current value without re-registering
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const open = useCallback(() => startTransition(() => setIsOpen(true)), []);
  const close = useCallback(() => startTransition(() => setIsOpen(false)), []);
  const toggle = useCallback(() => startTransition(() => setIsOpen((prev) => !prev)), []);

  // Close on route change
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Close on Escape — registered once, reads isOpen from ref
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpenRef.current) close();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [close]);

  return (
    <SidebarContext.Provider value={{ isOpen, isPending, activeCategory, open, close, toggle, setActiveCategory }}>
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