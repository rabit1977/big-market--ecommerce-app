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
  Eye,
  Info,
  MessageSquare,
  Package,
  PenLine,
  Phone,
  RefreshCw,
  Shield,
  Tag,
  Truck,
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
  { value: 'new', label: 'Ново' },
  { value: 'used', label: 'Користено' },
];

const MANUAL_KEYS = new Set<string>([]);

// ─────────────────────────────────────────────────────────────────────────────
// Shared row hover class — ONE source of truth for all row backgrounds
// ─────────────────────────────────────────────────────────────────────────────
const ROW_HOVER = 'hover:bg-muted/40 transition-colors duration-150';
const ROW_BASE = 'flex items-center gap-3 px-4 min-h-[52px] cursor-pointer group';

// Ghost input — transparent, no border, full width
const ghostInput =
  'h-10 border-0 border-none outline-none shadow-none ring-0 focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 !bg-transparent hover:!bg-transparent focus:!bg-transparent px-0 text-sm font-medium w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-foreground/70 placeholder:font-normal';

// SelectTrigger ghost — transparent, no border, no shadcn hover bg
const ghostTrigger =
  'h-10 border-0 border-none outline-none shadow-none ring-0 focus:ring-0 focus:border-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 !bg-transparent hover:!bg-transparent focus:!bg-transparent px-0 text-sm font-medium w-full data-[placeholder]:text-foreground/70 [&>span]:font-normal data-[placeholder]:[&>span]:font-normal';

// ─────────────────────────────────────────────────────────────────────────────
// FieldRow — no label, placeholder carries the hint
// ─────────────────────────────────────────────────────────────────────────────
function FieldRow({
  icon: Icon,
  children,
  id,
  className,
}: {
  icon?: React.ElementType;
  label?: string;
  required?: boolean;
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, select, textarea, [role="combobox"]'))
      return;
    const row = e.currentTarget;
    const focusable = row.querySelector(
      'input, select, textarea, [role="combobox"]',
    ) as HTMLElement;
    focusable?.focus();
  };

  return (
    <div
      id={id}
      onClick={handleClick}
      className={cn(ROW_BASE, ROW_HOVER, 'items-center py-0', className)}
    >
      {Icon ? (
        <Icon className='h-4 w-4 text-muted-foreground/40 shrink-0' />
      ) : (
        <div className='w-4 shrink-0' />
      )}
      <div className='flex-1 min-w-0'>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SectionLabel
// ─────────────────────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className='px-4 py-2 bg-muted/60 border-y border-border/50'>
      <span className='text-[10px] font-bold uppercase tracking-[0.15em] text-foreground'>
        {children}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// iOS-style toggle
// ─────────────────────────────────────────────────────────────────────────────
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
        'relative inline-flex h-[22px] w-[38px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        checked ? 'bg-primary' : 'bg-muted-foreground/25',
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-[18px] w-[18px] rounded-full bg-white shadow ring-0 transition-transform duration-200',
          checked ? 'translate-x-4' : 'translate-x-0',
        )}
      />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SwitchRow — same ROW_BASE + ROW_HOVER as FieldRow for visual consistency
// ─────────────────────────────────────────────────────────────────────────────
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
      className={cn(ROW_BASE, ROW_HOVER)}
      onClick={() => onChange(!checked)}
    >
      <Icon className='h-4 w-4 text-muted-foreground shrink-0' />
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-medium leading-none'>{label}</p>
        {description && (
          <p className='text-[11px] text-muted-foreground mt-0.5'>{description}</p>
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
    if (key === 'condition') updates.condition = value;
    if (key === 'description') updates.description = value;
    updateFormData(updates);
  };

  const selectedRegion = formData.region || '';

  const dynamicFields = (selectedCategory?.template?.fields || []).filter(
    (f) => !MANUAL_KEYS.has(f.key),
  );

  const currencySymbol = formData.currency === 'EUR' ? '€' : 'ден';

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>

        {/* ── Main column ── */}
        <div className='lg:col-span-2 space-y-3'>

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

          {/* ═══════════════ CARD ═══════════════ */}
          <div className='rounded-xl border border-border/60 bg-card overflow-hidden divide-y divide-border/60 shadow-sm'>

            {/* ── Title section ── */}
            <div className='px-4 py-4 space-y-2'>
              {/* Breadcrumb */}
              {(formData.category || formData.subCategory) && (
                <div className='flex flex-wrap items-center gap-1 mb-2'>
                  {formData.category && (
                    <span className='text-[10px] font-bold uppercase tracking-widest text-foreground/60'>
                      {categories.find((c) => c.slug === formData.category)?.name || formData.category}
                    </span>
                  )}
                  {formData.subCategory && formData.subCategory !== formData.category && (
                    <>
                      <span className='text-[10px] text-foreground/60 mx-0.5'>›</span>
                      <span className='text-[10px] font-bold uppercase tracking-widest text-foreground/60'>
                        {categories.find((c) => c.slug === formData.subCategory)?.name || formData.subCategory}
                      </span>
                    </>
                  )}
                </div>
              )}

              <label className='flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-foreground'>
                <PenLine className='w-3 h-3' />
                {t('label_title')}
                <span className='text-red-500'>*</span>
              </label>

              <Input
                placeholder={
                  selectedCategory?.template?.titlePlaceholder ||
                  'пр. iPhone 14 Pro, 256GB, Space Black...'
                }
                value={formData.title || ''}
                onChange={(e) => updateFormData({ title: e.target.value })}
                className='text-base sm:text-lg font-semibold h-11 px-3.5 bg-muted border border-border/70 hover:border-primary/30 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/10 transition-all rounded-lg placeholder:text-muted-foreground placeholder:font-normal shadow-none'
              />

              <div className='flex items-start gap-1.5 pt-0.5'>
                <Info className='w-3 h-3 text-primary/50 mt-0.5 shrink-0' />
                <p className='text-[11px] text-muted-foreground leading-snug'>
                  Насловот го гледаат сите купувачи. Напишете го јасно и конкретно.
                </p>
              </div>
            </div>

            {/* ── Dynamic template fields ── */}
            {dynamicFields.length > 0 && (
              <>
                <SectionLabel>Карактеристики</SectionLabel>
                {dynamicFields.map((field) => {
                  if (field.key === 'isTradePossible') {
                    return (
                      <SwitchRow
                        key={field.key}
                        icon={ArrowRightLeft}
                        label={field.label}
                        description='Дозволувате размена со друг предмет'
                        checked={['Да', 'Yes', 'True', 'true'].includes(
                          formData.specifications?.isTradePossible,
                        )}
                        onChange={(v) => handleSpec('isTradePossible', v ? 'Да' : 'Не')}
                      />
                    );
                  }

                  return (
                    <FieldRow
                      key={field.key}
                      icon={undefined}
                      id={`spec-${field.key}`}
                    >
                      {field.type === 'select' ? (
                        <Select
                          value={formData.specifications?.[field.key] || ''}
                          onValueChange={(val) => handleSpec(field.key, val)}
                        >
                          <SelectTrigger className={ghostTrigger}>
                            <SelectValue placeholder={field.placeholder || field.label} />
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
                            (field.key.toLowerCase().includes('vin') ||
                              field.key.toLowerCase().includes('chassis')) &&
                              'uppercase tracking-wider font-mono',
                          )}
                        />
                      )}
                    </FieldRow>
                  );
                })}
              </>
            )}

            {/* ════════════════════════
                LISTING DETAILS
            ════════════════════════ */}
            <SectionLabel>Детали за огласот</SectionLabel>

            {/* Condition chips */}
            {!dynamicFields.some((f) => f.key === 'condition') && (
              <FieldRow id='condition'>
                <div className='flex gap-2 flex-wrap pt-1'>
                  {CONDITIONS.map((c) => {
                    const active = (formData.condition || '') === c.value;
                    return (
                      <button
                        key={c.value}
                        type='button'
                        onClick={() => updateFormData({ condition: c.value })}
                        className={cn(
                          'px-3.5 py-1 rounded-full border text-xs font-semibold transition-all',
                          active
                            ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                            : 'border-border/70 text-muted-foreground hover:border-foreground/40 hover:text-foreground',
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
            <FieldRow id='price' icon={Tag}>
              <div className='flex items-center gap-2'>
                <Input
                  type='number'
                  placeholder='0'
                  min={0}
                  step={500}
                  value={formData.price ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateFormData({
                      price: val === '' ? undefined : parseFloat(val),
                    });
                  }}
                  className={cn(ghostInput, 'flex-1')}
                />
                <span className='text-sm text-muted-foreground font-medium select-none'>
                  {currencySymbol}
                </span>
                <Select
                  value={formData.currency || 'MKD'}
                  onValueChange={(val) => updateFormData({ currency: val })}
                >
                  <SelectTrigger className='h-8 w-[68px] px-2 border border-border/50 rounded-md shadow-none ring-0 focus:ring-0 focus-visible:ring-0 text-xs font-semibold uppercase bg-transparent hover:bg-transparent transition-colors'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='MKD'>MKD</SelectItem>
                    <SelectItem value='EUR'>EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </FieldRow>

            {/* Switches */}
            <SwitchRow
              icon={RefreshCw}
              label='Прифаќа понуди за цена'
              description='Купувачите можат да испратат контра-понуда'
              checked={formData.acceptsPriceOffers ?? false}
              onChange={(v) => updateFormData({ acceptsPriceOffers: v })}
            />

            <SwitchRow
              icon={Truck}
              label='Достапна испорака'
              description='Можете да го испратите предметот по пошта'
              checked={formData.shippingAvailable ?? false}
              onChange={(v) => updateFormData({ shippingAvailable: v })}
            />

            <SwitchRow
              icon={ArrowRightLeft}
              label='Размена возможна'
              description='Отворени сте за замена со друг предмет'
              checked={formData.specifications?.isTradePossible === 'Да'}
              onChange={(v) => handleSpec('isTradePossible', v ? 'Да' : 'Не')}
            />

            <SwitchRow
              icon={Shield}
              label='Гаранција вклучена'
              description='Предметот сè уште е во гарантен рок'
              checked={formData.specifications?.hasWarranty === 'Да'}
              onChange={(v) => handleSpec('hasWarranty', v ? 'Да' : 'Не')}
            />

            <SwitchRow
              icon={Package}
              label='Оригинална амбалажа'
              description='Предметот се продава со оригиналното пакување'
              checked={formData.specifications?.hasOriginalPackaging === 'Да'}
              onChange={(v) => handleSpec('hasOriginalPackaging', v ? 'Да' : 'Не')}
            />

            <SwitchRow
              icon={Eye}
              label='Огласот е итен'
              description='Прикажи "Итно" ознака на огласот'
              checked={formData.isUrgent ?? false}
              onChange={(v) => updateFormData({ isUrgent: v })}
            />

            {/* ════════════════════════
                LOCATION
            ════════════════════════ */}
            <SectionLabel>Локација</SectionLabel>

            <FieldRow id='region'>
              <Select
                value={selectedRegion}
                onValueChange={(v) => updateFormData({ region: v, city: '' })}
              >
                <SelectTrigger className={ghostTrigger}>
                  <SelectValue placeholder='Изберете регион...' />
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

            {selectedRegion &&
              selectedRegion !== 'Друго' &&
              (MK_LOCATIONS[selectedRegion]?.length ?? 0) > 0 && (
                <FieldRow id='city'>
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
                      updateFormData({ city: v === 'other_municipality' ? 'Друго' : v });
                    }}
                  >
                    <SelectTrigger className={ghostTrigger}>
                      <SelectValue placeholder='Изберете општина...' />
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

            {(selectedRegion === 'Друго' ||
              (selectedRegion &&
                formData.city &&
                !MK_LOCATIONS[selectedRegion]
                  ?.map((m) => m.toLowerCase())
                  .includes(formData.city.toLowerCase()))) && (
              <FieldRow id='custom-city'>
                <Input
                  placeholder='пр. Велес, Центар...'
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
            <SectionLabel>Опис и контакт</SectionLabel>

            {!dynamicFields.some((f) => f.key === 'description') && (
              <FieldRow id='description' icon={MessageSquare}>
                <Textarea
                  placeholder='Опишете го предметот — состојба, причина за продажба, вклучени додатоци...'
                  value={formData.description || ''}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  rows={4}
                  className='resize-none text-xs border-none shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent px-0 py-1.5 w-full min-h-[100px] placeholder:text-foreground/40 placeholder:font-normal'
                />
              </FieldRow>
            )}

            <FieldRow id='contactPhone' icon={Phone}>
              <Input
                type='tel'
                placeholder='+389 70 123 456'
                value={formData.contactPhone || ''}
                onChange={(e) => updateFormData({ contactPhone: e.target.value })}
                className={ghostInput}
              />
            </FieldRow>

            <FieldRow id='contactEmail'>
              <Input
                type='email'
                placeholder='vashiot@email.com'
                value={formData.contactEmail || ''}
                onChange={(e) => updateFormData({ contactEmail: e.target.value })}
                className={ghostInput}
              />
            </FieldRow>

          </div>
          {/* ═══ end card ═══ */}
        </div>

        {/* ── Sidebar — desktop only ── */}
        <div className='hidden lg:block lg:col-span-1'>
          <div className='sticky top-8 rounded-xl border border-border/60 bg-muted/30 p-5 space-y-3'>
            <h2 className='font-semibold text-sm'>{t('details_title')}</h2>
            <p className='text-xs text-muted-foreground leading-relaxed'>
              {t('sidebar_desc', { name: selectedCategory?.name || 'item' })}
            </p>
            <ul className='text-xs text-muted-foreground space-y-2 pt-1'>
              <li className='flex items-start gap-2'>
                <span className='text-primary mt-0.5'>→</span>
                {t('tip_title')}
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-primary mt-0.5'>→</span>
                {t('tip_condition')}
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-primary mt-0.5'>→</span>
                {t('tip_specs')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}