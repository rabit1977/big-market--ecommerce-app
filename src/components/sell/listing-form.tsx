'use client';

import { createListingAction, getCategoryTemplateAction, updateListingAction } from '@/actions/listing-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ListingWithRelations } from '@/lib/types/listing';
import { Listing } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { ListingImageUpload } from './listing-image-upload';

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

interface ListingFormProps {
  categories: Category[];
  initialData?: ListingWithRelations;
  onSuccess?: (listing: Listing) => void;
}

export function ListingForm({ categories, initialData, onSuccess }: ListingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // Try to determine category ID from initialData name
  const getInitialCategoryId = () => {
      if (!initialData?.category) return '';
      // Simple match by name
      const cat = categories.find(c => c.name === initialData.category);
      return cat?.id || '';
  };

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(getInitialCategoryId());
  const [templateFields, setTemplateFields] = useState<any[]>([]);
  const [titlePlaceholder, setTitlePlaceholder] = useState<string>('e.g. iPhone 14 Pro Max');
  const [specifications, setSpecifications] = useState<Record<string, any>>(initialData?.specifications ? (initialData.specifications as any) : {});
  
  const [images, setImages] = useState<string[]>(
      initialData?.images?.map(i => i.url) || 
      (initialData?.thumbnail ? [initialData.thumbnail] : [])
  );

  // Simple form state for core fields
  const [formData, setFormData] = useState({
      title: initialData?.title || '',
      price: initialData?.price?.toString() || '',
      description: initialData?.description || '',
      city: initialData?.city || '',
      state: (initialData as any)?.region || '',
      phone: initialData?.contactPhone || '',
  });

  const [categoryPath, setCategoryPath] = useState<string[]>([]);

  // Effect to load template if initial category is set
  useEffect(() => {
      if (selectedCategoryId) {
          handleCategoryChange(selectedCategoryId, false); // Don't reset specs on initial load
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoryChange = async (categoryId: string, resetSpecs = true) => {
      setSelectedCategoryId(categoryId);
      // Fetch template
      const res = await getCategoryTemplateAction(categoryId);
      if (res.success && res.data?.template) {
          const template = res.data.template as any;
          if (template.fields && Array.isArray(template.fields)) {
              setTemplateFields(template.fields);
          } else {
              setTemplateFields([]);
          }
          // Set Title Placeholder if available
          if (template.titlePlaceholder) {
              setTitlePlaceholder(template.titlePlaceholder);
          } else {
              setTitlePlaceholder('e.g. iPhone 14 Pro Max'); // Default
          }
      } else {
          setTemplateFields([]);
          setTitlePlaceholder('e.g. iPhone 14 Pro Max');
      }
      
      if (resetSpecs && !initialData) {
          setSpecifications({});
      }
  };
  
  // Helper to find children
  const getChildren = (parentId: string | null) => {
      return categories.filter(c => c.parentId === parentId || (parentId === null && !c.parentId));
  };

  const handleLevelChange = (level: number, categoryId: string) => {
      // Update path: keep up to level, add new selection
      const newPath = [...categoryPath.slice(0, level), categoryId];
      setCategoryPath(newPath);
      
      // The "selected" category is the one just clicked.
      handleCategoryChange(categoryId);
  };
  
  // Render Dynamic Selects (Simplified: currently just renders levels if we track them. 
  // But if editing, we might not have populated categoryPath. 
  // For MVP editing, we might show a single Category selector if hierarchy reconstruction is hard.
  // Or just rely on the user to re-select if they want to change.)
  
  const renderCategorySelects = () => {
      // Re-implement if hierarchy navigation is needed. 
      // For now, simpler Category Select
      return (
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={selectedCategoryId} onValueChange={(val) => handleCategoryChange(val)}>
                <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Select the most relevant category.</p>
          </div>
      );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSpecChange = (key: string, value: any) => {
      setSpecifications(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!selectedCategoryId) {
          toast.error('Please select a category');
          return;
      }
      
      if (images.length === 0) {
          toast.error('Please upload at least one image');
          return;
      }

      startTransition(async () => {
          const currentCategory = categories.find(c => c.id === selectedCategoryId);
          let mainCategoryName = currentCategory?.name || '';
          let subCategoryName = ''; // Default if no parent

          // If current category has a parent, then IT IS the subcategory
          if (currentCategory?.parentId) {
              const parent = categories.find(p => p.id === currentCategory.parentId);
              if (parent) {
                  mainCategoryName = parent.name;
                  subCategoryName = currentCategory.name;
              }
          }

          // Prepare data object matching CreateListingData inputs
          const listingData = {
              title: formData.title,
              description: formData.description,
              price: parseFloat(formData.price),
              category: mainCategoryName,
              subCategory: subCategoryName || undefined,
              city: formData.city,
              region: formData.state,
              contactPhone: formData.phone,
              specifications: specifications,
              thumbnail: images[0],
              images: images.map((url, index) => ({
                  url,
                  alt: formData.title,
                  position: index
              })),
              features: [], 
              tags: []
          };

          let res;
          if (initialData?.id) {
              // Update
              res = await updateListingAction(initialData.id, listingData);
              if (res.success) {
                  if (onSuccess) {
                      onSuccess(initialData as any); 
                  } else {
                      toast.success('Listing updated!');
                      router.push(`/listings/${initialData.id}`);
                  }
              } else {
                  toast.error(res.error || 'Failed to update listing');
              }
          } else {
              // Create
              res = await createListingAction(listingData);
              if (res.success && 'listing' in res && res.listing) {
                  if (onSuccess) {
                      onSuccess(res.listing as any); 
                  } else {
                      toast.success('Listing created!');
                      router.push(`/listings/${res.listing.id}`);
                  }
              } else {
                  toast.error('error' in res ? res.error : 'Failed to create listing');
              }
          }
      });
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">
            {initialData ? 'Edit Listing' : 'Create New Listing'}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Core Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Tell us about what you are selling.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Category Selection */}
                    {renderCategorySelects()}

                    <div className="grid gap-2">
                        <Label>Title</Label>
                        <Input name="title" placeholder={titlePlaceholder} value={formData.title} onChange={handleInputChange} required />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Price</Label>
                            <Input name="price" type="number" placeholder="0.00" value={formData.price} onChange={handleInputChange} required />
                        </div>
                        <div className="grid gap-2">
                             <Label>Phone Number</Label>
                             <Input name="phone" placeholder="+1 234..." value={formData.phone} onChange={handleInputChange} required />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Description</Label>
                        <Textarea name="description" placeholder="Describe your item..." className="h-32" value={formData.description} onChange={handleInputChange} required />
                    </div>
                </CardContent>
            </Card>

            {/* Images */}
            <Card>
                <CardHeader>
                    <CardTitle>Images</CardTitle>
                </CardHeader>
                <CardContent>
                    <ListingImageUpload value={images} onChange={setImages} />
                </CardContent>
            </Card>

            {/* Dynamic Specifications */}
            {templateFields.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Specific Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 grid sm:grid-cols-2 gap-4">
                        {templateFields.map((field: any, idx) => (
                            <div key={idx} className="grid gap-2">
                                <Label>{field.label || field.name}</Label>
                                {field.type === 'select' ? (
                                     <Select 
                                        value={specifications[field.key || field.name] || ''}
                                        onValueChange={(val) => handleSpecChange(field.key || field.name, val)}
                                     >
                                        <SelectTrigger>
                                            <SelectValue placeholder={`Select ${field.label || field.name}...`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {field.options?.map((opt: string) => (
                                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                            ))}
                                        </SelectContent>
                                     </Select>
                                ) : (
                                    <Input 
                                        type={field.type || 'text'} 
                                        placeholder={field.placeholder || ''}
                                        value={specifications[field.key || field.name] || ''}
                                        onChange={(e) => handleSpecChange(field.key || field.name, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Location */}
             <Card>
                <CardHeader>
                    <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                     <div className="grid gap-2">
                         <Label>City</Label>
                         <Input name="city" placeholder="e.g. Skopje" value={formData.city} onChange={handleInputChange} required />
                     </div>
                     <div className="grid gap-2">
                         <Label>State/Region</Label>
                         <Input name="state" placeholder="e.g. Karpos" value={formData.state} onChange={handleInputChange} />
                     </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" size="lg" disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {initialData ? 'Update Listing' : 'Publish Listing'}
                        </>
                    ) : (initialData ? 'Update Listing' : 'Publish Listing')}
                </Button>
            </div>
        </form>
    </div>
  );
}
