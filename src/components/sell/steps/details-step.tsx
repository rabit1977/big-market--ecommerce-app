'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MK_LOCATIONS } from '@/lib/locations';
import { cn } from '@/lib/utils';
import {
  ArrowRightLeft,
  ChevronLeft,
  Info,
  Package,
  PenLine,
  Tag,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ListingFormData } from '../post-listing-wizard';

interface DetailsStepProps {
  categories: Array<{
    _id: string;
    name: string;
    slug: string;
    template?: {
      titlePlaceholder?: string;
      fields: Array<{
        label: string;
        type: string;
        key: string;
        options?: string[];
        required?: boolean;
        placeholder?: string;
      }>;
    };
  }>;
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
  onBack: () => void;
}

const CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used' },
];

const MANUAL_KEYS = new Set<string>([
  // 'condition', // Removed to allow dynamic condition field
  // 'sostojba',
]);

// ─────────────────────────────────────────────────────────────────────────────
// Style tokens
// ─────────────────────────────────────────────────────────────────────────────
const ghostSelect =
  'h-10 border-none shadow-none ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent transition-colors rounded-none px-0 font-medium text-sm [&>svg]:opacity-40 w-full hover:bg-transparent';
const ghostInput =
  'h-10 border-none shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent transition-colors rounded-none px-0 font-medium text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full hover:bg-transparent';

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
function FieldRow({
  children,
  id,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  tall?: boolean;
  id?: string;
  className?: string;
}) {
  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, select, textarea'))
      return;
    const row = e.currentTarget;
    const focusable = row.querySelector(
      'input, select, textarea, [role="combobox"]',
    ) as HTMLElement;
    if (focusable) focusable.focus();
  };

  return (
    <div
      id={id}
      onClick={handleClick}
      className={cn(
        'flex items-center px-4 transition-all duration-200 hover:bg-muted/50 group cursor-pointer w-full min-h-[52px]',
        className,
      )}
    >
      <div className='flex-1 min-w-0'>{children}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className='px-4 pt-2 pb-1 bg-muted'>
      <span className='text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60'>
        {children}
      </span>
    </div>
  );
}

/** iOS-style toggle switch */
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type='button'
      role='switch'
      aria-checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        checked
          ? 'bg-primary'
          : 'bg-muted-foreground/30 dark:bg-muted-foreground/50',
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </button>
  );
}

/** Switch row inside the card */
function SwitchRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className='flex items-center gap-3 px-4 min-h-[52px] transition-all duration-200 hover:bg-muted/50 cursor-pointer'
      onClick={() => onChange(!checked)}
    >
      <Icon className='h-4 w-4 text-muted-foreground shrink-0' />
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-medium leading-none'>{label}</p>
        {description && (
          <p className='text-xs text-muted-foreground mt-0.5'>{description}</p>
        )}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export function DetailsStep({
  categories,
  formData,
  updateFormData,
  onBack,
}: DetailsStepProps) {
  const t = useTranslations('Sell');

  const selectedCategory =
    categories.find((c) => c.slug === formData.subCategory) ||
    categories.find((c) => c.slug === formData.category);

  const handleSpec = (key: string, value: any) => {
    const updates: Partial<ListingFormData> = {
      specifications: { ...(formData.specifications || {}), [key]: value },
    };

    // Promote key fields to top-level for validation
    if (key === 'condition') updates.condition = value;
    if (key === 'description') updates.description = value;

    updateFormData(updates);
  };

  const selectedRegion = formData.region || '';

  const dynamicFields = (selectedCategory?.template?.fields || []).filter(
    (f) => !MANUAL_KEYS.has(f.key),
  );

  const currencySymbol = formData.currency === 'EUR' ? '€' : 'ден';

  // New / Used — stored in formData.isNew (boolean)
  const isNew = formData.isNew ?? false;

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* ── Main column ── */}
        <div className='lg:col-span-2 space-y-4'>
          {/* Desktop back + title */}
          <div className='hidden lg:flex items-center gap-3 mb-2'>
            <Button
              variant='outline'
              size='icon'
              className='rounded-full shrink-0'
              onClick={onBack}
            >
              <ChevronLeft className='h-5 w-5' />
            </Button>
            <h2 className='text-2xl font-bold'>{t('details_title')}</h2>
          </div>

          {/* ═══════════════ UNIFIED CARD ═══════════════ */}
          <div className='rounded-xl border bg-card overflow-hidden divide-y divide-border'>
            <div
              id='title-section'
              className='transition-all duration-200 hover:bg-muted/50 pb-2'
            >
              <div className='px-4 pt-3 pb-1'>
                <div className='flex flex-wrap items-center gap-1 opacity-50'>
                  {formData.category && (
                    <span className='text-[10px] sm:text-[11px] font-bold text-muted-foreground/90 uppercase tracking-widest'>
                      {categories.find((c) => c.slug === formData.category)
                        ?.name || formData.category}
                    </span>
                  )}
                  {formData.subCategory &&
                    formData.subCategory !== formData.category && (
                      <>
                        <span className='text-[10px] font-bold text-muted-foreground mx-1'>
                          {'>'}
                        </span>
                        <span className='text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-widest'>
                          {categories.find(
                            (c) => c.slug === formData.subCategory,
                          )?.name || formData.subCategory}
                        </span>
                      </>
                    )}
                </div>
              </div>

              <div className='space-y-2 px-4'>
                <label className='flex items-center gap-2 text-xs font-black uppercase tracking-tighter text-muted-foreground my-2'>
                  <PenLine className='w-3.5 h-3.5' />
                  {t('label_title')}
                  <span className='text-red-500'>*</span>
                </label>

                <Input
                  placeholder={
                    selectedCategory?.template?.titlePlaceholder ||
                    t('label_title')
                  }
                  value={formData.title || ''}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                  className='text-lg sm:text-2xl font-bold h-12 sm:h-16 px-4 bg-background border-2 border-border/60 hover:border-primary/30 focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/5 transition-all rounded-xl placeholder:text-muted-foreground/30 shadow-none'
                />

                <div className='flex items-start gap-2 pt-1'>
                  <Info className='w-3.5 h-3.5 text-primary mt-0.5 shrink-0' />
                  <p className='text-[11px] text-muted-foreground/80 leading-snug font-medium italic'>
                    This is the main title that buyers will see when searching
                    for your item. Make it clear and descriptive!
                  </p>
                </div>
              </div>
            </div>

            {/* ── Dynamic template fields ── */}
            {dynamicFields.map((field) => {
              if (field.key === 'isTradePossible') {
                return (
                  <SwitchRow
                    key={field.key}
                    icon={ArrowRightLeft}
                    label={field.label}
                    checked={['Да', 'Yes', 'True', 'true'].includes(
                      formData.specifications?.isTradePossible,
                    )}
                    onChange={(v) =>
                      handleSpec('isTradePossible', v ? 'Да' : 'Не')
                    }
                  />
                );
              }

              return (
                <FieldRow
                  key={field.key}
                  label={field.label}
                  required={field.required}
                  id={`spec-${field.key}`}
                >
                  {field.type === 'select' ? (
                    <Select
                      value={formData.specifications?.[field.key] || ''}
                      onValueChange={(val) => handleSpec(field.key, val)}
                    >
                      <SelectTrigger className={ghostSelect}>
                        <SelectValue placeholder={field.label} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type={field.type === 'number' ? 'number' : 'text'}
                      placeholder={field.placeholder || field.label}
                      value={formData.specifications?.[field.key] || ''}
                      onChange={(e) => handleSpec(field.key, e.target.value)}
                      maxLength={
                        field.key.toLowerCase().includes('vin') ||
                        field.key.toLowerCase().includes('chassis')
                          ? 17
                          : undefined
                      }
                      className={cn(
                        ghostInput,
                        'max-w-xs',
                        (field.key.toLowerCase().includes('vin') ||
                          field.key.toLowerCase().includes('chassis')) &&
                          'uppercase tracking-wider font-mono',
                      )}
                    />
                  )}
                </FieldRow>
              );
            })}

            {/* ════════════════════════
                VEHICLE BLOCK
            ════════════════════════ */}

            {/* ════════════════════════
                LISTING DETAILS
            ════════════════════════ */}
            <SectionLabel>Listing Details</SectionLabel>

            {/* New / Used toggle chips - Only show if not defined in template as dynamic field */}
            {!dynamicFields.some((f) => f.key === 'condition') && (
              <FieldRow id='condition' label='Condition' required>
                <div className='flex gap-2 flex-wrap py-2'>
                  {CONDITIONS.map((c) => {
                    const active = (formData.condition || '') === c.value;
                    return (
                      <button
                        key={c.value}
                        type='button'
                        onClick={() => updateFormData({ condition: c.value })}
                        className={cn(
                          'px-4 py-1.5 rounded-full border text-sm font-medium transition-all',
                          active
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground',
                        )}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </FieldRow>
            )}
            {/* Price */}
            <FieldRow id='price' label='Price' required>
              <div className='flex items-center w-full'>
                <div className='flex-1 flex items-center'>
                  <Input
                    type='number'
                    placeholder='000...'
                    min={0}
                    step={500}
                    value={formData.price ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateFormData({
                        price: val === '' ? undefined : parseFloat(val),
                      });
                    }}
                    className={cn(ghostInput, 'w-full')}
                  />
                  <span className='text-xs text-muted-foreground pointer-events-none select-none pr-4'>
                    {currencySymbol}
                  </span>
                </div>
                <Select
                  value={formData.currency || 'MKD'}
                  onValueChange={(val) => updateFormData({ currency: val })}
                >
                  <SelectTrigger className='h-10 w-[84px] px-0 border-none shadow-none ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent transition-colors rounded-none text-xs font-medium hover:bg-transparent uppercase'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='MKD'>MKD</SelectItem>
                    <SelectItem value='EUR'>EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </FieldRow>

            {/* ─── Switches ─── */}
            <SwitchRow
              icon={Tag}
              label='Accept price offers'
              checked={formData.acceptsPriceOffers ?? false}
              onChange={(v) => updateFormData({ acceptsPriceOffers: v })}
            />

            <SwitchRow
              icon={Package}
              label='Shipping available'
              checked={formData.shippingAvailable ?? false}
              onChange={(v) => updateFormData({ shippingAvailable: v })}
            />

            {/* ════════════════════════
                LOCATION
            ════════════════════════ */}
            <SectionLabel>Location</SectionLabel>

            {/* Region / City */}
            <FieldRow id='region' label='Location' required>
              <Select
                value={selectedRegion}
                onValueChange={(v) => {
                  updateFormData({ region: v, city: '' });
                }}
              >
                <SelectTrigger className={ghostSelect}>
                  <SelectValue placeholder='Select Location' />
                </SelectTrigger>
                <SelectContent className='max-h-64'>
                  {Object.keys(MK_LOCATIONS).map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldRow>

            {/* Municipality — appears after region */}
            {selectedRegion &&
              selectedRegion !== 'Друго' &&
              (MK_LOCATIONS[selectedRegion]?.length ?? 0) > 0 && (
                <FieldRow id='city' label='Municipality' required>
                  <Select
                    value={
                      !formData.city
                        ? ''
                        : formData.city === 'Друго'
                          ? 'other_municipality'
                          : MK_LOCATIONS[selectedRegion]
                                .map((m) => m.toLowerCase())
                                .includes(formData.city.toLowerCase())
                            ? formData.city.toLowerCase()
                            : 'other_municipality'
                    }
                    onValueChange={(v) => {
                      if (v === 'other_municipality') {
                        updateFormData({ city: 'Друго' });
                      } else {
                        updateFormData({ city: v });
                      }
                    }}
                  >
                    <SelectTrigger className={ghostSelect}>
                      <SelectValue placeholder='Select Municipality' />
                    </SelectTrigger>
                    <SelectContent className='max-h-56'>
                      {MK_LOCATIONS[selectedRegion].map((mun) => (
                        <SelectItem key={mun} value={mun.toLowerCase()}>
                          {mun}
                        </SelectItem>
                      ))}
                      <SelectItem value='other_municipality'>Друго</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldRow>
              )}

            {/* Custom Location input if "Друго" (Other) is chosen */}
            {(selectedRegion === 'Друго' ||
              (selectedRegion &&
                formData.city &&
                !MK_LOCATIONS[selectedRegion]
                  ?.map((m) => m.toLowerCase())
                  .includes(formData.city.toLowerCase()))) && (
              <FieldRow id='city' label='Enter Location' required>
                <Input
                  placeholder='Type your location...'
                  value={formData.city === 'Друго' ? '' : formData.city || ''}
                  onChange={(e) =>
                    updateFormData({ city: e.target.value || 'Друго' })
                  }
                  className={ghostInput}
                />
              </FieldRow>
            )}

            {/* ════════════════════════
                DESCRIPTION & CONTACT
            ════════════════════════ */}
            <SectionLabel>Description & Contact</SectionLabel>

            {/* Description */}
            {!dynamicFields.some((f) => f.key === 'description') && (
              <FieldRow id='description' label='Description' tall>
                <Textarea
                  placeholder='Description...'
                  value={formData.description || ''}
                  onChange={(e) =>
                    updateFormData({ description: e.target.value })
                  }
                  rows={4}
                  className='resize-none text-sm border-none shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent transition-colors rounded-none px-0 py-4 w-full min-h-[120px] hover:bg-transparent'
                />
              </FieldRow>
            )}

            {/* Phone */}
            <FieldRow id='contactPhone' label='Phone' required>
              <Input
                type='tel'
                placeholder='+389 70 123 456'
                value={formData.contactPhone || ''}
                onChange={(e) =>
                  updateFormData({ contactPhone: e.target.value })
                }
                className={ghostInput}
              />
            </FieldRow>

            {/* Email */}
            <FieldRow id='contactEmail' label='Email' required>
              <Input
                type='email'
                placeholder='your@email.com'
                value={formData.contactEmail || ''}
                onChange={(e) =>
                  updateFormData({ contactEmail: e.target.value })
                }
                className={ghostInput}
              />
            </FieldRow>
          </div>
          {/* ═══ end card ═══ */}
        </div>

        {/* ── Sidebar — desktop only ── */}
        <div className='hidden lg:block lg:col-span-1'>
          <div className='sticky top-8 rounded-xl border bg-muted/40 p-5 space-y-3'>
            <h2 className='font-semibold text-base'>{t('details_title')}</h2>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              {t('sidebar_desc', { name: selectedCategory?.name || 'item' })}
            </p>
            <ul className='text-sm text-muted-foreground space-y-1.5 pt-1 list-none'>
              <li>{t('tip_title')}</li>
              <li>{t('tip_condition')}</li>
              <li>{t('tip_specs')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
