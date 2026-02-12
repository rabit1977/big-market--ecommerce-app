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
  
  // Enhanced category recognition (ID, Name, or Slug)
  const getInitialCategoryId = () => {
      // Prioritize subCategory for leaf selection, fall back to category
      const target = initialData?.subCategory || initialData?.category;
      if (!target) return '';
      
      const normalizedTarget = String(target).toLowerCase().trim();
      
      const cat = categories.find(c => {
          const id = String(c.id || (c as any)._id).toLowerCase();
          const name = String(c.name).toLowerCase();
          const slug = String((c as any).slug || '').toLowerCase();
          
          return id === normalizedTarget || 
                 name === normalizedTarget || 
                 slug === normalizedTarget ||
                 // Special case for "Home & Garden" vs "Home Garden"
                 name.replace('&', 'and').replace(/\s+/g, '-') === normalizedTarget.replace(/\s+/g, '-');
      });
      return cat?.id || (cat as any)?._id || '';
  };

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(getInitialCategoryId());
  
  // Track Parent and Child category separately for UI
  const initialCat = categories.find(c => (c.id || (c as any)._id) === selectedCategoryId);
  const [mainCatId, setMainCatId] = useState<string>(
      initialCat?.parentId ? initialCat.parentId : (initialCat ? (initialCat.id || (initialCat as any)._id) : '')
  );
  const [subCatId, setSubCatId] = useState<string>(
      initialCat?.parentId ? (initialCat.id || (initialCat as any)._id) : ''
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
      email: (initialData as any)?.contactEmail || '',
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
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1">
                <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Main Category</Label>
                <Select value={mainCatId} onValueChange={handleMainCatChange}>
                    <SelectTrigger className="h-9 rounded-lg bg-background/40 border-border/40 text-xs shadow-none focus:ring-1 focus:ring-primary/20 transition-all">
                        <SelectValue placeholder="Category..." />
                    </SelectTrigger>
                    <SelectContent>
                        {mainCategories.map(c => (
                            <SelectItem key={c.id || (c as any)._id} value={c.id || (c as any)._id} className="text-xs">{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1">
                <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Sub Category</Label>
                <Select 
                    value={subCatId} 
                    onValueChange={handleSubCatChange}
                    disabled={subCategories.length === 0}
                >
                    <SelectTrigger className="h-9 rounded-lg bg-background/40 border-border/40 text-xs shadow-none">
                        <SelectValue placeholder={subCategories.length === 0 ? "General" : "Subcategory..."} />
                    </SelectTrigger>
                    <SelectContent>
                        {subCategories.map(c => (
                            <SelectItem key={c.id || (c as any)._id} value={c.id || (c as any)._id} className="text-xs">{c.name}</SelectItem>
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
          const currentCategory = categories.find(c => (c.id || (c as any)._id) === selectedCategoryId);
          let categorySlug = (currentCategory as any)?.slug || '';
          let subCategorySlug = ''; 

          if (currentCategory?.parentId) {
              const parent = categories.find(p => (p.id || (p as any)._id) === currentCategory.parentId);
              if (parent) {
                  categorySlug = (parent as any).slug;
                  subCategorySlug = (currentCategory as any).slug;
              }
          }

          const listingData: any = {
              title: formData.title,
              description: formData.description,
              price: parseFloat(formData.price),
              category: categorySlug,
              subCategory: subCategorySlug || undefined,
              city: formData.city,
              region: formData.state || undefined,
              contactPhone: formData.phone || undefined,
              contactEmail: formData.email || undefined,
              specifications: specifications,
              images: images,
              thumbnail: images[0] || '',
              status: initialData?.status || 'PENDING_APPROVAL',
          };

          let res;
          const listingId = initialData?.id || (initialData as any)?._id;
          
          if (listingId) {
              res = await updateListingAction(listingId, listingData);
              if (res.success) {
                  if (onSuccess && initialData) {
                      onSuccess(initialData as any); 
                  } else {
                      toast.success('Updated successfully');
                      router.push(`/listings/${listingId}`);
                  }
              } else {
                  toast.error(res.error || 'Failed to update');
              }
          } else {
              res = await createListingAction(listingData);
              if (res.success && 'listing' in res && res.listing) {
                  if (onSuccess) {
                      onSuccess(res.listing as any); 
                  } else {
                      toast.success('Listing created!');
                      router.push(`/listings/${res.listing.id}`);
                  }
              } else {
                  toast.error('error' in res ? res.error : 'Failed to create');
              }
          }
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Section */}
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border/30" />
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] whitespace-nowrap">Basic Information</h3>
                <div className="h-px flex-1 bg-border/30" />
            </div>
            
            <div className="grid gap-3.5">
                {renderCategorySelects()}

                <div className="grid gap-1">
                    <Label htmlFor="title" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Listing Title</Label>
                    <Input 
                        id="title"
                        name="title" 
                        placeholder={titlePlaceholder} 
                        value={formData.title} 
                        onChange={handleInputChange} 
                        required 
                        className="h-9 rounded-lg bg-background/30 border-border/40 text-xs shadow-none"
                    />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                    <div className="grid gap-1">
                        <Label htmlFor="price" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Price</Label>
                        <div className="relative">
                            <Input 
                                id="price"
                                name="price" 
                                type="number" 
                                placeholder="0.00" 
                                value={formData.price} 
                                onChange={handleInputChange} 
                                required 
                                className="h-9 rounded-lg pl-8 bg-background/30 border-border/40 text-xs shadow-none"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-[10px]">€</span>
                        </div>
                    </div>
                    <div className="grid gap-1">
                         <Label htmlFor="phone" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Contact Phone</Label>
                         <Input 
                            id="phone"
                            name="phone" 
                            placeholder="+1 234..." 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                            required 
                            className="h-9 rounded-lg bg-background/30 border-border/40 text-xs shadow-none"
                         />
                    </div>
                </div>

                <div className="grid gap-1">
                    <Label htmlFor="email" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Contact Email</Label>
                    <Input 
                       id="email"
                       name="email" 
                       type="email"
                       placeholder="your@email.com" 
                       value={formData.email} 
                       onChange={handleInputChange} 
                       className="h-9 rounded-lg bg-background/30 border-border/40 text-xs shadow-none"
                    />
                </div>

                <div className="grid gap-1">
                    <Label htmlFor="description" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Description</Label>
                    <Textarea 
                        id="description"
                        name="description" 
                        placeholder="Describe your item..." 
                        className="h-28 rounded-xl resize-none bg-background/30 border-border/40 text-xs shadow-none" 
                        value={formData.description} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>
            </div>
        </div>

        {/* Images Section */}
        <div className="space-y-4 pt-4 border-t border-border/20">
            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border/20" />
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] whitespace-nowrap">Media & Gallery</h3>
                <div className="h-px flex-1 bg-border/20" />
            </div>
            <div className="bg-muted/10 p-3 rounded-2xl border border-dashed border-border/40">
                <ListingImageUpload value={images} onChange={setImages} />
            </div>
        </div>

        {/* Dynamic Specifications Section */}
        {templateFields.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-border/20">
                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border/20" />
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] whitespace-nowrap">Specifications</h3>
                    <div className="h-px flex-1 bg-border/20" />
                </div>
                <div className="grid sm:grid-cols-2 gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    {templateFields.map((field: any, idx) => (
                        <div key={idx} className="grid gap-1">
                            <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{field.label || field.name}</Label>
                            {field.type === 'select' ? (
                                 <Select 
                                    value={specifications[field.key || field.name] || ''}
                                    onValueChange={(val) => handleSpecChange(field.key || field.name, val)}
                                 >
                                    <SelectTrigger className="h-9 rounded-lg bg-background/60 border-border/40 text-xs shadow-none">
                                        <SelectValue placeholder={`Select...`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field.options?.map((opt: string) => (
                                            <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                 </Select>
                            ) : (
                                <Input 
                                    type={field.type || 'text'} 
                                    placeholder={field.placeholder || ''}
                                    value={specifications[field.key || field.name] || ''}
                                    onChange={(e) => handleSpecChange(field.key || field.name, e.target.value)}
                                    className="h-9 rounded-lg bg-background/60 border-border/40 text-xs shadow-none"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Location Section */}
        <div className="space-y-4 pt-4 border-t border-border/20">
            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border/20" />
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] whitespace-nowrap">Location</h3>
                <div className="h-px flex-1 bg-border/20" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
                 <div className="grid gap-1">
                     <Label htmlFor="city" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">City</Label>
                     <Input 
                        id="city"
                        name="city" 
                        placeholder="e.g. Skopje" 
                        value={formData.city} 
                        onChange={handleInputChange} 
                        required 
                        className="h-9 rounded-lg bg-background/30 border-border/40 text-xs shadow-none"
                    />
                 </div>
                 <div className="grid gap-1">
                     <Label htmlFor="state" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Region</Label>
                     <Input 
                        id="state"
                        name="state" 
                        placeholder="e.g. Karpos" 
                        value={formData.state} 
                        onChange={handleInputChange} 
                        className="h-9 rounded-lg bg-background/30 border-border/40 text-xs shadow-none"
                    />
                 </div>
            </div>
        </div>

        {/* Submit Section */}
        <div className="flex items-center justify-end gap-3 pt-6">
            <Button 
                type="button" 
                variant="ghost" 
                className="font-black rounded-lg h-9 px-5 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
                onClick={() => router.back()}
            >
                Cancel
            </Button>
            <Button 
                type="submit" 
                size="sm" 
                disabled={isPending}
                className="font-black rounded-full h-9 px-8 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95"
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Saving...
                    </>
                ) : (initialData ? 'Save Changes' : 'Publish Listing')}
            </Button>
        </div>
    </form>
  );
}
