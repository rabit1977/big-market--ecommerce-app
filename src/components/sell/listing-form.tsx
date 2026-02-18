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
import { cn } from '@/lib/utils';
import { Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { ListingImageUpload } from './listing-image-upload';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  slug?: string;
  _id?: string; // Handle Convex ID variation
}

interface ListingFormProps {
  categories: Category[];
  initialData?: ListingWithRelations;
  onSuccess?: (listing: Listing) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ListingForm({ categories, initialData, onSuccess }: ListingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // 1. Intelligent Category Initialization
  const getInitialCategoryId = useCallback(() => {
    const target = initialData?.subCategory || initialData?.category;
    if (!target) return '';

    const normalizedTarget = String(target).toLowerCase().trim();
    
    // Efficient lookup map could be built outside component, but array find is fine for < 100 cats
    const cat = categories.find(c => {
      const id = String(c.id || c._id).toLowerCase();
      const name = String(c.name).toLowerCase();
      const slug = String(c.slug || '').toLowerCase();
      
      return id === normalizedTarget || 
             name === normalizedTarget || 
             slug === normalizedTarget ||
             name.replace('&', 'and').replace(/\s+/g, '-') === normalizedTarget.replace(/\s+/g, '-');
    });
    return cat?.id || cat?._id || '';
  }, [categories, initialData]);

  // 2. State Management
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(getInitialCategoryId());
  
  // Track Parent/Child logic
  const initialCat = categories.find(c => (c.id || c._id) === selectedCategoryId);
  const [mainCatId, setMainCatId] = useState<string>(
     initialCat?.parentId ? initialCat.parentId : (initialCat ? (initialCat.id || initialCat._id) : '') || ''
  );
  const [subCatId, setSubCatId] = useState<string>(
     initialCat?.parentId ? (initialCat.id || initialCat._id) || '' : ''
  );

  const [templateFields, setTemplateFields] = useState<any[]>([]);
  const [titlePlaceholder, setTitlePlaceholder] = useState<string>('e.g. iPhone 14 Pro Max');
  const [specifications, setSpecifications] = useState<Record<string, any>>(initialData?.specifications ? (initialData.specifications as any) : {});
  
  const [images, setImages] = useState<string[]>(
    initialData?.images?.map(i => i.url) || 
    (initialData?.thumbnail ? [initialData.thumbnail] : [])
  );

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    price: initialData?.price?.toString() || '',
    description: initialData?.description || '',
    city: initialData?.city || '',
    state: (initialData as any)?.region || '',
    phone: initialData?.contactPhone || '',
    email: (initialData as any)?.contactEmail || '',
    currency: (initialData as any)?.currency || 'MKD',
  });

  // 3. Category Template Logic
  const loadTemplate = useCallback(async (categoryId: string) => {
    if (!categoryId) {
        setTemplateFields([]);
        return;
    }
    
    try {
        const res = await getCategoryTemplateAction(categoryId);
        if (res.success && res.data?.template) {
            const template = res.data.template as any;
            setTemplateFields(Array.isArray(template.fields) ? template.fields : []);
            setTitlePlaceholder(template.titlePlaceholder || 'e.g. iPhone 14 Pro Max');
        } else {
            setTemplateFields([]);
            setTitlePlaceholder('e.g. iPhone 14 Pro Max');
        }
    } catch (err) {
        console.error("Template load failed", err);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    if (selectedCategoryId) {
        loadTemplate(selectedCategoryId);
    }
  }, [selectedCategoryId, loadTemplate]);


  // 4. Handlers
  const handleMainCatChange = (val: string) => {
    setMainCatId(val);
    setSubCatId(''); // Clear sub
    setSelectedCategoryId(val);
    setSpecifications({}); // Clear specs on major change
    loadTemplate(val);
  };

  const handleSubCatChange = (val: string) => {
    setSubCatId(val);
    setSelectedCategoryId(val);
    setSpecifications({});
    loadTemplate(val);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecChange = (key: string, value: any) => {
    setSpecifications(prev => ({ ...prev, [key]: value }));
  };

  // 5. Submit Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!selectedCategoryId) return toast.error('Please select a category');
    if (!formData.title.trim()) return toast.error('Title is required');
    if (!formData.price || parseFloat(formData.price) < 0) return toast.error('Valid price is required');
    if (images.length === 0) return toast.error('Please upload at least one image');

    startTransition(async () => {
        // Resolve Slugs
        const currentCategory = categories.find(c => (c.id || c._id) === selectedCategoryId);
        let categorySlug = currentCategory?.slug || '';
        let subCategorySlug = ''; 

        if (currentCategory?.parentId) {
            const parent = categories.find(p => (p.id || p._id) === currentCategory.parentId);
            if (parent) {
                categorySlug = parent.slug || '';
                subCategorySlug = currentCategory.slug || '';
            }
        }

        const listingData: any = {
            ...formData,
            price: parseFloat(formData.price),
            category: categorySlug,
            subCategory: subCategorySlug || undefined,
            region: formData.state || undefined,
            contactPhone: formData.phone || undefined,
            contactEmail: formData.email || undefined,
            specifications,
            images,
            thumbnail: images[0] || '',
            status: initialData?.status || 'PENDING_APPROVAL',
        };

        const listingId = initialData?.id || (initialData as any)?._id;
        let res;

        try {
            if (listingId) {
                res = await updateListingAction(listingId, listingData);
                if (res.success) {
                    toast.success('Listing updated successfully');
                    if (onSuccess && initialData) onSuccess(initialData as any);
                    else router.push(`/listings/${listingId}`);
                } else throw new Error(res.error);
            } else {
                res = await createListingAction(listingData);
                if (res.success && 'listing' in res && res.listing) {
                    toast.success('Listing created successfully!');
                    if (onSuccess) onSuccess(res.listing as any);
                    else router.push(`/listings/${res.listing.id}/success`);
                } else throw new Error('error' in res ? res.error : 'Failed');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    });
  };

  // Derived Data
  const mainCategories = categories.filter(c => !c.parentId);
  const subCategories = categories.filter(c => c.parentId === mainCatId);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
        
        {/* ── Basic Information ────────────────────────────────────────────── */}
        <div className="space-y-4">
            <SectionHeader title="Basic Information" />
            
            <div className="grid gap-5">
                {/* Categories */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Category</Label>
                        <Select value={mainCatId} onValueChange={handleMainCatChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {mainCategories.map(c => (
                                    <SelectItem key={c.id || c._id} value={c.id || c._id || ''}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Subcategory</Label>
                        <Select 
                            value={subCatId} 
                            onValueChange={handleSubCatChange}
                            disabled={!mainCatId || subCategories.length === 0}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={!mainCatId ? "Select main category first" : (subCategories.length === 0 ? "General" : "Select Subcategory")} />
                            </SelectTrigger>
                            <SelectContent>
                                {subCategories.map(c => (
                                    <SelectItem key={c.id || c._id} value={c.id || c._id || ''}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Listing Title</Label>
                    <Input 
                        id="title" name="title" 
                        placeholder={titlePlaceholder} 
                        value={formData.title} onChange={handleInputChange} 
                        required className="font-medium"
                    />
                </div>

                {/* Price & Currency */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="price" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Price</Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Input 
                                    id="price" name="price" type="number" min="0" step="0.01"
                                    placeholder="0.00" 
                                    value={formData.price} onChange={handleInputChange} 
                                    required 
                                    className={cn("font-mono", formData.currency === 'EUR' ? "pl-8" : "pl-12")}
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs pointer-events-none">
                                    {formData.currency === 'EUR' ? '€' : 'MKD'}
                                </span>
                            </div>
                            <Select 
                                value={formData.currency} 
                                onValueChange={(val) => setFormData(prev => ({ ...prev, currency: val }))}
                            >
                                <SelectTrigger className="w-[80px] font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MKD">MKD</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    {/* Phone (Optional but recommended) */}
                    <div className="space-y-1.5">
                         <Label htmlFor="phone" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Phone Number</Label>
                         <Input 
                            id="phone" name="phone" 
                            placeholder="+389 70 123 456" 
                            value={formData.phone} onChange={handleInputChange} 
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Description</Label>
                    <Textarea 
                        id="description" name="description" 
                        placeholder="Describe your item in detail..." 
                        className="h-32 resize-none leading-relaxed" 
                        value={formData.description} onChange={handleInputChange} 
                        required 
                    />
                </div>
            </div>
        </div>

        {/* ── Media Section ────────────────────────────────────────────────── */}
        <div className="space-y-4">
            <SectionHeader title="Media Gallery" />
            <div className="bg-muted/10 p-4 rounded-xl border border-dashed border-border/60 hover:border-border transition-colors">
                <ListingImageUpload value={images} onChange={setImages} />
                <p className="text-[10px] text-muted-foreground mt-2 text-center">
                    Upload up to 10 images. Drag and drop to reorder. First image will be the thumbnail.
                </p>
            </div>
        </div>

        {/* ── Dynamic Specifications ───────────────────────────────────────── */}
        {templateFields.length > 0 && (
            <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                <SectionHeader title="Specifications" />
                <div className="grid sm:grid-cols-2 gap-4 p-5 bg-secondary/20 rounded-xl border border-secondary/40">
                    {templateFields.map((field: any, idx) => (
                        <div key={idx} className="space-y-1.5">
                            <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                                {field.label || field.name}
                            </Label>
                            {field.type === 'select' ? (
                                 <Select 
                                    value={specifications[field.key || field.name] || ''}
                                    onValueChange={(val) => handleSpecChange(field.key || field.name, val)}
                                 >
                                    <SelectTrigger className="bg-background/80">
                                        <SelectValue placeholder="Select..." />
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
                                    className="bg-background/80"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* ── Location ─────────────────────────────────────────────────────── */}
        <div className="space-y-4">
            <SectionHeader title="Location" />
            <div className="grid sm:grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                      <Label htmlFor="city" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">City</Label>
                      <Input 
                        id="city" name="city" placeholder="e.g. Skopje" 
                        value={formData.city} onChange={handleInputChange} required 
                    />
                 </div>
                 <div className="space-y-1.5">
                      <Label htmlFor="state" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Region / Municipality</Label>
                      <Input 
                        id="state" name="state" placeholder="e.g. Centar" 
                        value={formData.state} onChange={handleInputChange} 
                    />
                 </div>
            </div>
        </div>

        {/* ── Actions ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
            <Button 
                type="button" variant="ghost" 
                onClick={() => router.back()}
                className="text-muted-foreground hover:text-foreground"
            >
                Cancel
            </Button>
            <Button 
                type="submit" 
                disabled={isPending}
                className="min-w-[140px] font-bold tracking-wide rounded-full"
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        {initialData ? 'Update Listing' : 'Publish Listing'}
                    </>
                )}
            </Button>
        </div>
    </form>
  );
}

// ─── Sub-Component: Section Header ────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-3 py-2">
            <div className="h-px flex-1 bg-border/40" />
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] whitespace-nowrap">
                {title}
            </h3>
            <div className="h-px flex-1 bg-border/40" />
        </div>
    );
}