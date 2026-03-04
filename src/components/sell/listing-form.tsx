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
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
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
  const t = useTranslations('Sell');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // ── Category init ─────────────────────────────────────────────────────────

  // Helper: find a category in the list by slug, name, or id
  function findCatByVal(val: string | undefined): Category | null {
    if (!val) return null;
    const normalised = val.toLowerCase().trim();
    return categories.find((c) => {
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

  // Compute initial category IDs. This function is stable because it is only
  // called once by useState (lazy initializer pattern).
  function computeInitCatIds() {
    const subCat = findCatByVal(initialData?.subCategory ?? undefined);
    const mainCat = findCatByVal(initialData?.category ?? undefined);

    if (!mainCat && !subCat) return { mainId: '', subId: '', selId: '' };

    // ── Helpers ──────────────────────────────────────────────────────────────

    // Walk up the tree recursively to find the true root (no parentId)
    function findRootAncestor(cat: Category): Category {
      const pid = cat.parentId;
      if (!pid || pid === 'null' || pid === 'undefined') return cat;
      const parent = categories.find(
        (c) => getCategoryId(c) === pid || c.slug === pid,
      );
      if (!parent) return cat;
      return findRootAncestor(parent);
    }

    // Walk from `cat` upward and return the direct child of `rootId`
    function findDirectChildOfRoot(cat: Category, rootId: string): Category {
      const pid = cat.parentId;
      if (!pid || pid === 'null' || pid === 'undefined') return cat;
      const parent = categories.find(
        (c) => getCategoryId(c) === pid || c.slug === pid,
      );
      if (!parent) return cat;
      if (getCategoryId(parent) === rootId) return cat; // `cat` is the direct child
      return findDirectChildOfRoot(parent, rootId);
    }

    // ── Logic ─────────────────────────────────────────────────────────────────

    // Use the stored `category` field as the primary reference; fall back to subCat
    const refCat = mainCat ?? subCat!;
    const root = findRootAncestor(refCat);
    const rootId = getCategoryId(root);

    if (getCategoryId(refCat) === rootId) {
      // refCat IS already the root (top-level selection, e.g. "real-estate")
      // The stored subCategory is its direct child
      const subId = subCat ? getCategoryId(subCat) : '';
      return { mainId: rootId, subId, selId: subId || rootId };
    }

    // refCat is a child/grandchild of root.
    // Find the direct child of root along the ancestor path.
    const directChild = findDirectChildOfRoot(refCat, rootId);

    // selId: use the most specific item available for template loading
    const selId = subCat ? getCategoryId(subCat) : getCategoryId(directChild);

    return {
      mainId: rootId,
      subId: getCategoryId(directChild),
      selId,
    };
  }

  const [mainCatId, setMainCatId] = useState(() => computeInitCatIds().mainId);
  const [subCatId, setSubCatId] = useState(() => computeInitCatIds().subId);
  const [selectedCategoryId, setSelectedCategoryId] = useState(() => computeInitCatIds().selId);

  // Keep category state in sync if categories load asynchronously (edge case)
  useEffect(() => {
    if (!initialData) return;
    const { mainId, subId, selId } = computeInitCatIds();
    if (mainId && !mainCatId) setMainCatId(mainId);
    if (subId && !subCatId) setSubCatId(subId);
    if (selId && !selectedCategoryId) setSelectedCategoryId(selId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.length]);

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
    condition:   (initialData as any)?.condition ?? 'new',
    currency:    (initialData as any)?.currency ?? 'MKD',
    isPriceNegotiable: (initialData as any)?.isPriceNegotiable ?? false,
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
    if (selectedCategoryId) loadTemplate(selectedCategoryId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once on mount

  // ── Derived category data ─────────────────────────────────────────────────

  const mainCategories = useMemo(() => {
    // A main category is one that has no parent, or its parentId was mistakenly saved as 'null'.
    // We also make sure the currently resolved parentCat is included if it somehow has a parentId.
    return categories.filter((c) => {
      const isRoot = !c.parentId || c.parentId === 'null' || c.parentId === 'undefined';
      return isRoot || getCategoryId(c) === mainCatId;
    });
  }, [categories, mainCatId]);
  const subCategories = useMemo(() => {
    const parent = categories.find((c) => getCategoryId(c) === mainCatId || c.slug === mainCatId);
    if (!parent) return [];
    const pId = getCategoryId(parent);
    const pSlug = parent.slug;
    return categories.filter((c) => c.parentId === pId || (pSlug && c.parentId === pSlug));
  }, [categories, mainCatId]);

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

    if (!selectedCategoryId) return void toast.error(t('fill_field', { field: t('step_category') }));
    if (!formData.title.trim()) return void toast.error(t('fill_field', { field: t('label_title') }));
    if (!formData.price || parseFloat(formData.price) < 0) return void toast.error(t('fill_field', { field: t('label_price') }));
    if (images.length === 0) return void toast.error(t('check_images'));

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
        currency: formData.currency,
        isPriceNegotiable: formData.isPriceNegotiable,
        category: categorySlug,
        subCategory: subCategorySlug || undefined,
        condition: (formData as any).condition || undefined,
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
          toast.success(t('toast_updated'));
          if (onSuccess && initialData) onSuccess(initialData as any);
          else router.push(`/listings/${listingId}`);
        } else {
          const res = await createListingAction(listingData);
          if (!res.success) throw new Error('error' in res ? res.error : 'Failed');
          if ('listing' in res && res.listing) {
            toast.success(t('toast_created'));
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
            <SectionHeader title={t('details_title')} />
            {isAdmin && (
                <div className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-lg border border-border transition-colors">
                    <Label htmlFor="status" className="text-[10px] uppercase font-bold text-muted-foreground">{t('status_label')}</Label>
                    <Select 
                        value={(formData as any).status} 
                        onValueChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                    >
                        <SelectTrigger className="h-6 w-[110px] text-xs border-0 bg-transparent focus:ring-0 px-0 font-bold text-foreground">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="end">
                            <SelectItem value="PENDING_APPROVAL">{t('status_pending')}</SelectItem>
                            <SelectItem value="ACTIVE">{t('status_active')}</SelectItem>
                            <SelectItem value="REJECTED">{t('status_rejected')}</SelectItem>
                            <SelectItem value="SOLD">{t('status_sold')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
        <div className="grid gap-5">

          {/* Categories */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{t('label_category')}</Label>
              <Select value={mainCatId} onValueChange={handleMainCatChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('cat_select_title')} />
                </SelectTrigger>
                <SelectContent>
                  {mainCategories.map((c) => (
                    <SelectItem key={getCategoryId(c)} value={getCategoryId(c)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{t('label_subcategory')}</Label>
              <Select
                value={subCatId}
                onValueChange={handleSubCatChange}
                disabled={!mainCatId || subCategories.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    !mainCatId ? t('cat_select_main_first')
                    : subCategories.length === 0 ? t('general')
                    : t('cat_select_sub')
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
            <Label htmlFor="title" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{t('label_title')}</Label>
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
              <Label htmlFor="price" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{t('label_price')}</Label>
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
              <div className="flex gap-2 mt-2">
                <Select
                  value={formData.isPriceNegotiable ? 'negotiable' : 'fixed'}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, isPriceNegotiable: val === 'negotiable' }))}
                >
                  <SelectTrigger className="w-full font-bold">
                    <SelectValue placeholder={t('price_type')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">{t('price_fixed')}</SelectItem>
                    <SelectItem value="negotiable">{t('price_negotiable')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{t('label_contact_phone')}</Label>
              <Input
                id="phone" name="phone"
                placeholder="+389 70 123 456"
                value={formData.phone} onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{t('label_description')}</Label>
            <Textarea
              id="description" name="description"
              placeholder={t('desc_placeholder')}
              className="h-32 resize-none leading-relaxed"
              value={formData.description} onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="space-y-4">
        <SectionHeader title={t('images_title')} />
        <div className="bg-secondary/20 p-4 rounded-lg border border-border/40 hover:border-border/60 transition-colors">
          <ListingImageUpload value={images} onChange={setImages} />
          <p className="text-[10px] text-muted-foreground mt-2 text-center font-medium">
            {t('images_desc')}
          </p>
        </div>
      </div>

      {/* Dynamic Specifications */}
      {templateFields.length > 0 && (
        <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
          <SectionHeader title={t('specs_header', { name: '' })} />
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
                        <SelectValue placeholder={t('select_placeholder', { label: '' })} />
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
        <SectionHeader title={t('label_location_contact')} />
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="city" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{t('label_city')}</Label>
            <Input id="city" name="city" placeholder={t('city_placeholder')} value={formData.city} onChange={handleInputChange} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="state" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{t('label_region')}</Label>
            <Input id="state" name="state" placeholder={t('region_placeholder')} value={formData.state} onChange={handleInputChange} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="condition" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{t('tip_condition')}</Label>
            <Select value={(formData as any).condition} onValueChange={(val) => setFormData(prev => ({ ...prev, condition: val }))}>
              <SelectTrigger id="condition" className="bg-background">
                <SelectValue placeholder={t('tip_condition')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="like-new">Like New</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="used">Used</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
        <Button type="button" variant="ghost" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
          {t('cancel')}
        </Button>

        {isAdmin && (initialData?.status === 'PENDING_APPROVAL' || (formData as any).status === 'PENDING_APPROVAL') && (
            <Button 
                type="button" 
                variant="default"
                disabled={isPending} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-wide rounded-lg min-w-[160px] shadow-none"
                onClick={() => handleSubmit(undefined, 'ACTIVE')}
            >
                {isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('processing')}</>
                ) : (
                    <><Save className="mr-2 h-4 w-4" />{t('approve_save')}</>
                )}
            </Button>
        )}

        <Button type="submit" disabled={isPending} className="min-w-[140px] font-bold tracking-wide rounded-lg shadow-none">
          {isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('submitting')}</>
          ) : (
            <><Save className="mr-2 h-4 w-4" />{initialData ? t('update_listing') : t('publish_listing')}</>
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