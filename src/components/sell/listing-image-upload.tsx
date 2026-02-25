'use client';

import { cn } from '@/lib/utils';
import { Loader2, Star, UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

interface ListingImageUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
}

export function ListingImageUpload({ value, onChange }: ListingImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const newUrls: string[] = [];

        try {
            // Upload sequentially or parallel
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append('file', files[i]);

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });
                
                if (!res.ok) throw new Error('Upload failed');
                
                const data = await res.json();
                if (data.success && data.url) {
                    newUrls.push(data.url);
                } else {
                    toast.error(`Failed to upload ${files[i].name}`);
                }
            }
            
            if (newUrls.length > 0) {
                // Update parent state
                onChange([...value, ...newUrls]);
                toast.success(`Uploaded ${newUrls.length} image(s)`);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error uploading images');
        } finally {
            setIsUploading(false);
            // Reset input value to allow selecting same file again if needed
            e.target.value = ''; 
        }
    };

    const handleRemove = (urlToRemove: string) => {
        onChange(value.filter(url => url !== urlToRemove));
    };

    const handleMakeCover = (index: number) => {
        const newImages = [...value];
        const [targetImage] = newImages.splice(index, 1);
        newImages.unshift(targetImage);
        onChange(newImages);
        toast.success('Cover image updated');
    };

    return (
        <div className="space-y-4">
            <h3 className="font-medium text-sm">Product Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {value.map((url, index) => (
                    <div 
                        key={url} 
                        className={cn(
                            "relative aspect-square rounded-xl overflow-hidden border bg-background group transition-all duration-300",
                            index === 0 ? "ring-2 ring-primary ring-offset-2 scale-[1.02] shadow-lg shadow-primary/10" : "hover:border-primary/40 hover:shadow-md"
                        )}
                    >
                        <Image src={url} alt="Listing image" fill className="object-cover" />
                        
                        {/* Cover Badge */}
                        {index === 0 && (
                            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm shadow-sm z-10">
                                Main Cover
                            </div>
                        )}

                        {/* Actions Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between gap-1">
                            {index !== 0 && (
                                <button
                                    type="button"
                                    onClick={() => handleMakeCover(index)}
                                    className="bg-white/90 hover:bg-white text-black text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 transition-colors"
                                >
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    Set Cover
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => handleRemove(url)}
                                className="ml-auto bg-red-500/90 hover:bg-red-500 text-white p-1 rounded-md transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
                
                {/* Upload Button */}
                <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors border-muted-foreground/25">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin mb-2" />
                        ) : (
                            <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                        )}
                        <p className="text-xs text-muted-foreground text-center px-2">
                            {isUploading ? 'Uploading...' : 'Click to upload'}
                        </p>
                    </div>
                    <input 
                        type="file" 
                        className="hidden" 
                        multiple 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        disabled={isUploading}
                    />
                </label>
            </div>
        </div>
    );
}
