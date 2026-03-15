'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface ListingLightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function ListingLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title,
}: ListingLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentIndex(initialIndex);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialIndex]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const toggleZoom = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsZoomed((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className='fixed inset-0 z-100 flex flex-col bg-black/95 backdrop-blur-sm transition-all duration-300'>
      {/* Header */}
      <div className='flex items-center justify-between p-4 text-white z-50'>
        <div className='flex flex-col'>
          <h3 className='text-sm font-bold uppercase tracking-widest opacity-80'>
            {title}
          </h3>
          <span className='text-xs font-medium opacity-60'>
            {currentIndex + 1} / {images.length}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={toggleZoom}
            className='p-2 hover:bg-white/10 rounded-full transition-colors'
            title={isZoomed ? 'Zoom Out' : 'Zoom In'}
          >
            {isZoomed ? <ZoomOut className='w-6 h-6' /> : <ZoomIn className='w-6 h-6' />}
          </button>
          <button
            onClick={onClose}
            className='p-2 hover:bg-white/10 rounded-full transition-colors'
            title='Close'
          >
            <X className='w-6 h-6' />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className='relative flex-1 flex items-center justify-center overflow-hidden'
        onClick={onClose}
      >
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className='relative w-full h-full flex items-center justify-center p-4 md:p-12'
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className={cn(
                'relative w-full h-full transition-all duration-500 ease-in-out',
                isZoomed ? 'scale-[2] cursor-zoom-out' : 'scale-100 cursor-zoom-in'
              )}
              onClick={toggleZoom}
            >
              <Image
                src={images[currentIndex]}
                alt={`Image ${currentIndex + 1}`}
                fill
                className='object-contain select-none pointer-events-none'
                sizes='100vw'
                priority
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className='absolute left-4 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-50'
              aria-label='Previous'
            >
              <ChevronLeft className='w-8 h-8' />
            </button>
            <button
              onClick={handleNext}
              className='absolute right-4 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-50'
              aria-label='Next'
            >
              <ChevronRight className='w-8 h-8' />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Footer */}
      <div className='p-6 z-50 overflow-x-auto no-scrollbar hidden md:block'>
        <div className='flex justify-center gap-3'>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setIsZoomed(false);
                setCurrentIndex(i);
              }}
              className={cn(
                'relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0',
                i === currentIndex ? 'border-primary opacity-100 scale-105' : 'border-transparent opacity-40 hover:opacity-70'
              )}
            >
              <Image
                src={img}
                alt={`Thumb ${i + 1}`}
                fill
                className='object-cover'
              />
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
