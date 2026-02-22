'use client';

import { Button } from '@/components/ui/button';
import { useCompareStore } from '@/lib/store/compare-store';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRight, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function CompareWidget() {
  const { items, removeItem, clearItems } = useCompareStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 150, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-50 pointer-events-auto"
        >
          <div className="bg-background/80 backdrop-blur-xl border border-border/60 shadow-2xl shadow-primary/10 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full flex items-center justify-between sm:justify-start gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar">
              {items.map((item: any) => (
                <div key={item._id} className="relative group shrink-0 snap-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-border bg-muted relative">
                    {item.thumbnail || item.images[0] ? (
                      <Image
                        src={item.thumbnail || item.images[0]}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                        <span className="text-[10px] text-muted-foreground whitespace-pre-wrap text-center px-1 break-words">{item.title}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {Array.from({ length: 3 - items.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 border-dashed border-border flex items-center justify-center shrink-0 snap-center"
                >
                  <span className="text-muted-foreground/40 text-sm font-bold">{items.length + i + 1}</span>
                </div>
              ))}
            </div>

            <div className="flex w-full sm:w-auto items-center gap-2 sm:gap-3 shrink-0">
              <div className="flex flex-col flex-1 sm:flex-initial">
                <span className="text-xs font-medium text-muted-foreground hidden sm:block">Compare up to 3</span>
                <span className="text-sm font-bold">{items.length} selected</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearItems}
                className="h-10 w-10 text-muted-foreground hover:text-destructive shrink-0"
              >
                <X className="w-5 h-5" />
              </Button>
              <Button
                disabled={items.length < 2}
                onClick={() => router.push('/compare')}
                className="btn-premium btn-glow font-bold rounded-xl h-10 px-4 sm:px-6 w-full sm:w-auto flex-1 sm:flex-initial"
              >
                <ArrowLeftRight className="w-4 h-4 mr-2" />
                Compare
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
