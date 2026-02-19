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
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { ListingImageUpload } from './listing-image-upload';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  slug?: string;
  _id?: string;
}

interface ListingFormProps {
  categories: Category[];
  initialData?: ListingWithRelations;
  onSuccess?: (listing: Listing) => void;
  isAdmin?: boolean;
}

const DEFAULT_TITLE_PLACEHOLDER = 'e.g. iPhone 14 Pro Max';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCategoryId(c: Category) {
  return c.id || c._id || '';
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ListingForm({ categories, initialData, onSuccess, isAdmin = false }: ListingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // ── Category init ─────────────────────────────────────────────────────────

  // Find the initial category once on mount — stable ref avoids re-running on every render
  const initialCatRef = useRef<Category | null>(null);

  if (!initialCatRef.current) {
    const target = initialData?.subCategory ?? initialData?.category;
    if (target) {
      const normalised = String(target).toLowerCase().trim();
      initialCatRef.current = categories.find((c) => {
        const id = getCategoryId(c).toLowerCase();
        const name = c.name.toLowerCase();
        const slug = (c.slug ?? '').toLowerCase();
        return (
          id === normalised ||
          name === normalised ||
          slug === normalised ||
          name.replace('&', 'and').replace(/\s+/g, '-') === normalised.replace(/\s+/g, '-')
        );
      }) ?? null;
    }
  }

  const initCat = initialCatRef.current;
  const initCatId = initCat ? getCategoryId(initCat) : '';
  const initMainId = initCat?.parentId ?? (initCat ? getCategoryId(initCat) : '');
  const initSubId = initCat?.parentId ? initCatId : '';

  const [mainCatId, setMainCatId] = useState(initMainId);
  const [subCatId, setSubCatId] = useState(initSubId);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initCatId);

  const [templateFields, setTemplateFields] = useState<any[]>([]);
  const [titlePlaceholder, setTitlePlaceholder] = useState(DEFAULT_TITLE_PLACEHOLDER);
  const [specifications, setSpecifications] = useState<Record<string, any>>(
    (initialData?.specifications as any) ?? {}
  );
  const [images, setImages] = useState<string[]>(
    initialData?.images?.map((i) => i.url) ??
    (initialData?.thumbnail ? [initialData.thumbnail] : [])
  );
  const [formData, setFormData] = useState({
    title:       initialData?.title ?? '',
    price:       initialData?.price?.toString() ?? '',
    description: initialData?.description ?? '',
    city:        initialData?.city ?? '',
    state:       (initialData as any)?.region ?? '',
    phone:       initialData?.contactPhone ?? '',
    email:       (initialData as any)?.contactEmail ?? '',
    currency:    (initialData as any)?.currency ?? 'MKD',
    status:      initialData?.status ?? 'PENDING_APPROVAL',
  });

  // ── Template loading ──────────────────────────────────────────────────────

  const loadTemplate = useCallback(async (categoryId: string) => {
    if (!categoryId) { setTemplateFields([]); return; }
    try {
      const res = await getCategoryTemplateAction(categoryId);
      if (res.success && res.data?.template) {
        const tpl = res.data.template as any;
        setTemplateFields(Array.isArray(tpl.fields) ? tpl.fields : []);
        setTitlePlaceholder(tpl.titlePlaceholder ?? DEFAULT_TITLE_PLACEHOLDER);
      } else {
        setTemplateFields([]);
        setTitlePlaceholder(DEFAULT_TITLE_PLACEHOLDER);
      }
    } catch {
      // Silent — form remains usable without template fields
      setTemplateFields([]);
    }
  }, []);

  // Load template for initial category on mount
  useEffect(() => {
    if (initCatId) loadTemplate(initCatId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once on mount

  // ── Derived category data ─────────────────────────────────────────────────

  const mainCategories = useMemo(() => categories.filter((c) => !c.parentId), [categories]);
  const subCategories = useMemo(
    () => categories.filter((c) => c.parentId === mainCatId),
    [categories, mainCatId]
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleMainCatChange = useCallback((val: string) => {
    setMainCatId(val);
    setSubCatId('');
    setSelectedCategoryId(val);
    setSpecifications({});
    loadTemplate(val);
  }, [loadTemplate]);

  const handleSubCatChange = useCallback((val: string) => {
    setSubCatId(val);
    setSelectedCategoryId(val);
    setSpecifications({});
    loadTemplate(val);
  }, [loadTemplate]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSpecChange = useCallback((key: string, value: any) => {
    setSpecifications((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e?: React.FormEvent, statusOverride?: string) => {
    if (e) e.preventDefault();

    if (!selectedCategoryId) return void toast.error('Please select a category');
    if (!formData.title.trim()) return void toast.error('Title is required');
    if (!formData.price || parseFloat(formData.price) < 0) return void toast.error('Valid price is required');
    if (images.length === 0) return void toast.error('Please upload at least one image');

    startTransition(async () => {
      const currentCategory = categories.find((c) => getCategoryId(c) === selectedCategoryId);
      let categorySlug = currentCategory?.slug ?? '';
      let subCategorySlug = '';

      if (currentCategory?.parentId) {
        const parent = categories.find((p) => getCategoryId(p) === currentCategory.parentId);
        if (parent) {
          categorySlug = parent.slug ?? '';
          subCategorySlug = currentCategory.slug ?? '';
        }
      }

      // Determine status: Override > Admin Form State > Initial > Default
      const finalStatus = statusOverride ?? (isAdmin ? (formData as any).status : (initialData?.status ?? 'PENDING_APPROVAL'));

      const { state, phone, email, ...baseFormData } = formData;

      const listingData: any = {
        ...baseFormData,
        price: parseFloat(formData.price),
        category: categorySlug,
        subCategory: subCategorySlug || undefined,
        region: state || undefined,
        contactPhone: phone || undefined,
        contactEmail: email || undefined,
        specifications,
        images,
        thumbnail: images[0] ?? '',
        status: finalStatus,
      };

      const listingId = initialData?.id ?? (initialData as any)?._id;

      try {
        if (listingId) {
          const res = await updateListingAction(listingId, listingData);
          if (!res.success) throw new Error(res.error);
          toast.success(finalStatus === 'ACTIVE' && statusOverride ? 'Listing updated & approved!' : 'Listing updated successfully');
          if (onSuccess && initialData) onSuccess(initialData as any);
          else router.push(`/listings/${listingId}`);
        } else {
          const res = await createListingAction(listingData);
          if (!res.success) throw new Error('error' in res ? res.error : 'Failed');
          if ('listing' in res && res.listing) {
            toast.success('Listing created successfully!');
            if (onSuccess) onSuccess(res.listing as any);
            else router.push(`/listings/${res.listing.id}/success`);
          }
        }
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : 'Something went wrong');
      }
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-8 animate-in fade-in duration-500">

      {/* Basic Information */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <SectionHeader title="Basic Information" />
            {isAdmin && (
                <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full border border-yellow-200 dark:border-yellow-800">
                    <Label htmlFor="status" className="text-[10px] uppercase font-black text-yellow-800 dark:text-yellow-500">Status</Label>
                    <Select 
                        value={(formData as any).status} 
                        onValueChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                    >
                        <SelectTrigger className="h-6 w-[110px] text-xs border-0 bg-transparent focus:ring-0 px-0 font-bold text-yellow-900 dark:text-yellow-400">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="end">
                            <SelectItem value="PENDING_APPROVAL">Pending</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                            <SelectItem value="SOLD">Sold</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
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
                  {mainCategories.map((c) => (
                    <SelectItem key={getCategoryId(c)} value={getCategoryId(c)}>{c.name}</SelectItem>
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
                  <SelectValue placeholder={
                    !mainCatId ? 'Select main category first'
                    : subCategories.length === 0 ? 'General'
                    : 'Select Subcategory'
                  } />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((c) => (
                    <SelectItem key={getCategoryId(c)} value={getCategoryId(c)}>{c.name}</SelectItem>
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
                    className={cn('font-mono', formData.currency === 'EUR' ? 'pl-8' : 'pl-12')}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs pointer-events-none">
                    {formData.currency === 'EUR' ? '€' : 'MKD'}
                  </span>
                </div>
                <Select
                  value={formData.currency}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, currency: val }))}
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

      {/* Media */}
      <div className="space-y-4">
        <SectionHeader title="Media Gallery" />
        <div className="bg-muted/10 p-4 rounded-xl border border-dashed border-border/60 hover:border-border transition-colors">
          <ListingImageUpload value={images} onChange={setImages} />
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            Upload up to 10 images. Drag and drop to reorder. First image will be the thumbnail.
          </p>
        </div>
      </div>

      {/* Dynamic Specifications */}
      {templateFields.length > 0 && (
        <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
          <SectionHeader title="Specifications" />
          <div className="grid sm:grid-cols-2 gap-4 p-5 bg-secondary/20 rounded-xl border border-secondary/40">
            {templateFields.map((field: any) => {
              const key = field.key ?? field.name;
              return (
                <div key={key} className="space-y-1.5">
                  <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    {field.label ?? field.name}
                  </Label>
                  {field.type === 'select' ? (
                    <Select
                      value={specifications[key] ?? ''}
                      onValueChange={(val) => handleSpecChange(key, val)}
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
                      type={field.type ?? 'text'}
                      placeholder={field.placeholder ?? ''}
                      value={specifications[key] ?? ''}
                      onChange={(e) => handleSpecChange(key, e.target.value)}
                      className="bg-background/80"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Location */}
      <div className="space-y-4">
        <SectionHeader title="Location" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="city" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">City</Label>
            <Input id="city" name="city" placeholder="e.g. Skopje" value={formData.city} onChange={handleInputChange} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="state" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Region / Municipality</Label>
            <Input id="state" name="state" placeholder="e.g. Centar" value={formData.state} onChange={handleInputChange} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
        <Button type="button" variant="ghost" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
          Cancel
        </Button>

        {isAdmin && (initialData?.status === 'PENDING_APPROVAL' || (formData as any).status === 'PENDING_APPROVAL') && (
            <Button 
                type="button" 
                variant="default"
                disabled={isPending} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-wide rounded-full min-w-[160px]"
                onClick={() => handleSubmit(undefined, 'ACTIVE')}
            >
                {isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
                ) : (
                    <><Save className="mr-2 h-4 w-4" />Approve & Save</>
                )}
            </Button>
        )}

        <Button type="submit" disabled={isPending} className="min-w-[140px] font-bold tracking-wide rounded-full">
          {isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
          ) : (
            <><Save className="mr-2 h-4 w-4" />{initialData ? 'Update Listing' : 'Publish Listing'}</>
          )}
        </Button>
      </div>
    </form>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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