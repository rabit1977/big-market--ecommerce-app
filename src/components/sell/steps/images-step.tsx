'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Image as ImageIcon, Star, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { ListingFormData } from '../post-listing-wizard';

interface ImagesStepProps {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
}

export function ImagesStep({ formData, updateFormData }: ImagesStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

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

  // Helper to compress image
  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new globalThis.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if too big (max 800px is enough for mobile/web listings usually)
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.6 quality (good balance)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6); 
          resolve(dataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
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

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      
      try {
        // Compress image before adding
        const compressedDataUrl = await compressImage(file);
        uploadedImages.push(compressedDataUrl);
      } catch (err) {
        console.error("Failed to compress image", err);
      }

      setUploadProgress(((i + 1) / imageFiles.length) * 100);
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
          border-2 border-dashed transition-all
          ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            
            <h3 className="font-semibold mb-2">
              {isDragging ? 'Drop images here' : 'Upload Images'}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop or click to browse
            </p>
            
            <Button type="button" variant="outline" size="sm">
              <ImageIcon className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
            
            <p className="text-xs text-muted-foreground mt-4">
              Supported: JPG, PNG, WebP (Max 5MB each)
            </p>
          </div>
        </label>
        
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </Card>

      {/* Upload Progress */}
      {uploadProgress !== null && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

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
