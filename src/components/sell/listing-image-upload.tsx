'use client';

import { Loader2, UploadCloud, X } from 'lucide-react';
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

    return (
        <div className="space-y-4">
            <h3 className="font-medium text-sm">Product Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {value.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border bg-background group">
                        <Image src={url} alt="Listing image" fill className="object-cover" />
                        <button
                            type="button"
                            onClick={() => handleRemove(url)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
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
