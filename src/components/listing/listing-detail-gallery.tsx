'use client';

import { Badge } from '@/components/ui/badge';
import { ListingWithRelations } from '@/lib/types/listing';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface ListingDetailGalleryProps {
  listing: ListingWithRelations;
}

export function ListingDetailGallery({ listing }: ListingDetailGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const images = useMemo(() => {
    const urls = listing.images?.map((img) => img.url) ?? [];
    if (urls.length === 0 && listing.thumbnail) urls.push(listing.thumbnail);
    const unique = [...new Set(urls)];
    return unique.length > 0 ? unique : ['/placeholder.png'];
  }, [listing.images, listing.thumbnail]);

  const currentImage = images[activeImageIndex];

  // Reset zoom when active image changes
  useEffect(() => {
    setIsZoomed(false);
  }, [activeImageIndex]);

  const handleNext = useCallback(() => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (images.length <= 1) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [images.length, handleNext, handlePrev]);

  // Use ref for mouse position — no re-render needed, CSS transform reads it via inline style
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    mousePositionRef.current = {
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100,
    };
    // Apply directly to the image element to avoid a render cycle on every mousemove
    if (imageRef.current) {
      imageRef.current.style.transformOrigin = `${mousePositionRef.current.x}% ${mousePositionRef.current.y}%`;
    }
  }, [isZoomed]);

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Main Image */}
      <div
        className="group relative aspect-[4/3] sm:aspect-square w-full overflow-hidden rounded-3xl border border-border bg-white shadow-sm cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        role="region"
        aria-label="Listing image gallery"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full"
          >
            <Image
              ref={imageRef as any}
              src={currentImage}
              alt={`${listing.title} — image ${activeImageIndex + 1} of ${images.length}`}
              fill
              className={cn(
                'object-cover transition-transform duration-200',
                isZoomed ? 'scale-150' : 'scale-100'
              )}
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Nav Controls */}
        {images.length > 1 && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="pointer-events-auto h-10 w-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/40 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="pointer-events-auto h-10 w-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/40 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
            <Badge variant="secondary" className="backdrop-blur-md bg-black/30 text-white text-[10px]">
              {activeImageIndex + 1} / {images.length}
            </Badge>
          </div>
        )}

        <div className="absolute top-4 right-4 pointer-events-none">
          <Badge variant="secondary" className="backdrop-blur-md bg-white/70">
            <ZoomIn className="h-3 w-3 mr-1" />
            Hover to Zoom
          </Badge>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2" role="tablist" aria-label="Image thumbnails">
          {images.map((img, idx) => (
            <button
              key={img}
              role="tab"
              aria-selected={activeImageIndex === idx}
              aria-label={`View image ${idx + 1}`}
              onClick={() => setActiveImageIndex(idx)}
              className={cn(
                'relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border transition-all hover:opacity-100',
                activeImageIndex === idx
                  ? 'border-primary ring-2 ring-primary/20 opacity-100'
                  : 'border-transparent opacity-60 hover:border-border'
              )}
            >
              <Image
                src={img}
                alt={`${listing.title} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}