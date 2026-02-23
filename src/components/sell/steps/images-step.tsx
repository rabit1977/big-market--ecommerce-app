'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { Image as ImageIcon, Star, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ListingFormData } from '../post-listing-wizard';

interface ImagesStepProps {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
}

export function ImagesStep({ formData, updateFormData }: ImagesStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [displayProgress, setDisplayProgress] = useState(0);

  // Smooth progress animation
  const progressTargetRef = useRef<number | null>(null);

  useEffect(() => {
    progressTargetRef.current = uploadProgress;
  }, [uploadProgress]);

  useEffect(() => {
    if (uploadProgress === null) {
      setDisplayProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        const target = progressTargetRef.current ?? 0;
        if (prev < target) {
          const jump = Math.max(1, (target - prev) / 5);
          return Math.min(prev + jump, target);
        }
        return prev;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [uploadProgress === null]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    },
    [formData]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };


  const handleFiles = async (files: File[]) => {
    // Filter for images only
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      alert('Please select image files only');
      return;
    }

    setUploadProgress(0);
    const uploadedImages: string[] = [];
    const totalSize = imageFiles.reduce((acc, file) => acc + file.size, 0);
    let bytesUploadedSoFar = 0;

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      
      try {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        const uploadImage = (): Promise<string | null> => {
          return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/upload', true);

            xhr.upload.onprogress = (event) => {
              if (event.lengthComputable) {
                const currentProgress = ((bytesUploadedSoFar + event.loaded) / totalSize) * 100;
                setUploadProgress(Math.min(currentProgress, 99)); // Keep at 99 until finished
              }
            };

            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                try {
                  const data = JSON.parse(xhr.responseText);
                  resolve(data.url);
                } catch {
                  reject(new Error('Invalid response'));
                }
              } else {
                reject(new Error('Upload failed'));
              }
            };

            xhr.onerror = () => reject(new Error('Network error'));
            xhr.send(formDataUpload);
          });
        };

        const url = await uploadImage();
        if (url) {
          uploadedImages.push(url);
        }
        bytesUploadedSoFar += file.size;
        setUploadProgress((bytesUploadedSoFar / totalSize) * 100);
        
        console.log("Uploaded images:", uploadedImages);
      } catch (err) {
        console.error("Failed to upload image", err);
        import('sonner').then(({ toast }) => toast.error(`Error uploading ${file.name}`));
        // Even if one fails, we count its "size" as processed to keep progress moving
        bytesUploadedSoFar += file.size;
      }
    }

    // Update form data
    const currentImages = formData.images || [];
    const newImages = [...currentImages, ...uploadedImages];
    
    updateFormData({
      images: newImages,
      thumbnail: formData.thumbnail || newImages[0],
    });

    setUploadProgress(null);
  };

  const removeImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    
    updateFormData({
      images: newImages,
      thumbnail: newImages[0] || undefined,
    });
  };

  const setThumbnail = (imageUrl: string) => {
    updateFormData({ thumbnail: imageUrl });
  };

  const images = formData.images || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Upload Photos</h2>
        <p className="text-muted-foreground">
          Add photos to make your listing stand out. First image will be the cover.
        </p>
      </div>

      {/* Upload Area */}
      <Card
        className={`
          border-2 border-dashed transition-all cursor-pointer overflow-hidden relative
          ${
            isDragging
              ? 'border-primary bg-primary/5 active:scale-[0.99]'
              : 'border-border hover:border-primary/50 hover:bg-muted/30 active:scale-[0.98]'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <div className="p-10 md:p-14 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          
          <h3 className="text-lg font-bold mb-2">
            {isDragging ? 'Drop images here' : 'Add Photos'}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
            Drag and drop your photos here, or click to browse files
          </p>
          
          <Button type="button" variant="secondary" className="rounded-xl shadow-sm border font-bold">
            <ImageIcon className="w-4 h-4 mr-2" />
            Select Files
          </Button>
          
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-6 opacity-60">
            JPG, PNG, WebP • Max 5MB per image
          </p>
        </div>

        {/* Overlaid Progress - Cool Visual */}
        <AnimatePresence>
          {uploadProgress !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center p-8"
            >
              <div className="relative w-24 h-24 mb-6">
                {/* Circular Progress Path */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-muted/20"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="251.2"
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (251.2 * displayProgress) / 100 }}
                    className="text-primary"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-black">{Math.round(displayProgress)}%</span>
                </div>
              </div>
              <p className="text-sm font-bold animate-pulse text-primary tracking-tight">OPTIMIZING & UPLOADING...</p>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase font-black tracking-widest">To Cloudinary</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </Card>

      {/* Image Grid */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">
              Uploaded Images ({images.length})
            </h3>
            <p className="text-sm text-muted-foreground">
              Click star to set as cover
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((imageUrl, index) => (
              <Card key={index} className="relative group overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={imageUrl}
                    alt={`Upload ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={() => setThumbnail(imageUrl)}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          formData.thumbnail === imageUrl
                            ? 'fill-yellow-400 text-yellow-400'
                            : ''
                        }`}
                      />
                    </Button>
                    
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Cover Badge */}
                  {formData.thumbnail === imageUrl && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Cover
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          📸 Photo Tips
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Use good lighting and clear backgrounds</li>
          <li>• Show the item from multiple angles</li>
          <li>• Include close-ups of important details</li>
          <li>• First image will be shown in search results</li>
        </ul>
      </Card>
    </div>
  );
}
