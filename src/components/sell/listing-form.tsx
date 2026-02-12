'use client';

import { createListingAction, getCategoryTemplateAction, updateListingAction } from '@/actions/listing-actions';
import { Button } from '@/components/ui/button';
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
import { Listing, ListingWithRelations } from '@/lib/types/listing';
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
  
  // Try to determine category ID from initialData
  const getInitialCategoryId = () => {
      const targetCategoryName = initialData?.subCategory || initialData?.category;
      if (!targetCategoryName) return '';
      
      const cat = categories.find(c => c.name === targetCategoryName);
      return cat?.id || '';
  };

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(getInitialCategoryId());
  
  // Track Parent and Child category separately for UI
  const initialCat = categories.find(c => c.id === selectedCategoryId);
  const [mainCatId, setMainCatId] = useState<string>(
      initialCat?.parentId ? initialCat.parentId : (initialCat ? initialCat.id : '')
  );
  const [subCatId, setSubCatId] = useState<string>(
      initialCat?.parentId ? initialCat.id : ''
  );

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
          setTitlePlaceholder(template.titlePlaceholder || 'e.g. iPhone 14 Pro Max');
      } else {
          setTemplateFields([]);
          setTitlePlaceholder('e.g. iPhone 14 Pro Max');
      }
      
      if (resetSpecs && !initialData) {
          setSpecifications({});
      }
  };
  
  const mainCategories = categories.filter(c => !c.parentId);
  const subCategories = categories.filter(c => c.parentId === mainCatId);

  const handleMainCatChange = (val: string) => {
      setMainCatId(val);
      setSubCatId(''); // Reset subcat when main changes
      handleCategoryChange(val); // Load template for main if no sub exists
  };

  const handleSubCatChange = (val: string) => {
      setSubCatId(val);
      handleCategoryChange(val);
  };
  
  const renderCategorySelects = () => {
      return (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
                <Label className="text-[13px] font-bold text-foreground">Main Category</Label>
                <Select value={mainCatId} onValueChange={handleMainCatChange}>
                    <SelectTrigger className="h-10 rounded-xl bg-background border-border/50">
                        <SelectValue placeholder="Select Main Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {mainCategories.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1.5">
                <Label className="text-[13px] font-bold text-foreground">Sub Category</Label>
                <Select 
                    value={subCatId} 
                    onValueChange={handleSubCatChange}
                    disabled={subCategories.length === 0}
                >
                    <SelectTrigger className="h-10 rounded-xl bg-background border-border/50">
                        <SelectValue placeholder={subCategories.length === 0 ? "No Sub-categories" : "Select Sub-category"} />
                    </SelectTrigger>
                    <SelectContent>
                        {subCategories.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
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
    <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Section */}
        <div className="space-y-5">
            <div>
                <h3 className="text-base font-black text-foreground uppercase tracking-tight">Basic Information</h3>
                <p className="text-[12px] text-muted-foreground font-medium">Core details about your listing.</p>
            </div>
            
            <div className="grid gap-4">
                {/* Category Selection */}
                {renderCategorySelects()}

                <div className="grid gap-1.5">
                    <Label htmlFor="title" className="text-[13px] font-bold">Listing Title</Label>
                    <Input 
                        id="title"
                        name="title" 
                        placeholder={titlePlaceholder} 
                        value={formData.title} 
                        onChange={handleInputChange} 
                        required 
                        className="h-10 rounded-xl bg-background/50 border-border/50 text-sm"
                    />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="price" className="text-[13px] font-bold">Price</Label>
                        <div className="relative">
                            <Input 
                                id="price"
                                name="price" 
                                type="number" 
                                placeholder="0.00" 
                                value={formData.price} 
                                onChange={handleInputChange} 
                                required 
                                className="h-10 rounded-xl pl-9 bg-background/50 border-border/50 text-sm"
                            />
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs">€</span>
                        </div>
                    </div>
                    <div className="grid gap-1.5">
                         <Label htmlFor="phone" className="text-[13px] font-bold">Contact Phone</Label>
                         <Input 
                            id="phone"
                            name="phone" 
                            placeholder="+1 234..." 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                            required 
                            className="h-10 rounded-xl bg-background/50 border-border/50 text-sm"
                         />
                    </div>
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="description" className="text-[13px] font-bold">Full Description</Label>
                    <Textarea 
                        id="description"
                        name="description" 
                        placeholder="Describe your item in detail..." 
                        className="h-32 rounded-xl resize-none bg-background/50 border-border/50 text-sm" 
                        value={formData.description} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>
            </div>
        </div>

        {/* Images Section */}
        <div className="space-y-5 pt-5 border-t border-border/40">
            <div>
                <h3 className="text-base font-black text-foreground uppercase tracking-tight">Media & Gallery</h3>
                <p className="text-[12px] text-muted-foreground font-medium">Upload photos to showcase your item.</p>
            </div>
            <div className="bg-muted/20 p-4 rounded-2xl border border-dashed border-border/60">
                <ListingImageUpload value={images} onChange={setImages} />
            </div>
        </div>

        {/* Dynamic Specifications Section */}
        {templateFields.length > 0 && (
            <div className="space-y-5 pt-5 border-t border-border/40">
                <div>
                    <h3 className="text-base font-black text-foreground uppercase tracking-tight">Specification Details</h3>
                    <p className="text-[12px] text-muted-foreground font-medium">Additional details for the selected category.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 p-5 bg-muted/10 rounded-2xl border border-border/30">
                    {templateFields.map((field: any, idx) => (
                        <div key={idx} className="grid gap-1.5">
                            <Label className="text-[13px] font-bold">{field.label || field.name}</Label>
                            {field.type === 'select' ? (
                                 <Select 
                                    value={specifications[field.key || field.name] || ''}
                                    onValueChange={(val) => handleSpecChange(field.key || field.name, val)}
                                 >
                                    <SelectTrigger className="h-10 rounded-xl bg-background border-border/50 text-sm">
                                        <SelectValue placeholder={`Select ${field.label || field.name}...`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field.options?.map((opt: string) => (
                                            <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                 </Select>
                            ) : (
                                <Input 
                                    type={field.type || 'text'} 
                                    placeholder={field.placeholder || ''}
                                    value={specifications[field.key || field.name] || ''}
                                    onChange={(e) => handleSpecChange(field.key || field.name, e.target.value)}
                                    className="h-10 rounded-xl bg-background border-border/50 text-sm"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Location Section */}
        <div className="space-y-5 pt-5 border-t border-border/40">
            <div>
                <h3 className="text-base font-black text-foreground uppercase tracking-tight">Location Details</h3>
                <p className="text-[12px] text-muted-foreground font-medium">Where can buyer find this item?</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                 <div className="grid gap-1.5">
                     <Label htmlFor="city" className="text-[13px] font-bold">City</Label>
                     <Input 
                        id="city"
                        name="city" 
                        placeholder="e.g. Skopje" 
                        value={formData.city} 
                        onChange={handleInputChange} 
                        required 
                        className="h-10 rounded-xl bg-background/50 border-border/50 text-sm"
                    />
                 </div>
                 <div className="grid gap-1.5">
                     <Label htmlFor="state" className="text-[13px] font-bold">Region / State</Label>
                     <Input 
                        id="state"
                        name="state" 
                        placeholder="e.g. Karpos" 
                        value={formData.state} 
                        onChange={handleInputChange} 
                        className="h-10 rounded-xl bg-background/50 border-border/50 text-sm"
                    />
                 </div>
            </div>
        </div>

        {/* Submit Section */}
        <div className="flex items-center justify-end gap-3 pt-8 border-t border-border/40">
            <Button 
                type="button" 
                variant="ghost" 
                className="font-bold rounded-xl h-10 px-6 text-xs uppercase tracking-widest"
                onClick={() => router.back()}
            >
                Cancel
            </Button>
            <Button 
                type="submit" 
                size="lg" 
                disabled={isPending}
                className="font-bold rounded-full h-10 px-8 bg-primary text-primary-foreground text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                ) : (initialData ? 'Save Changes' : 'Publish Listing')}
            </Button>
        </div>
    </form>
  );
}
