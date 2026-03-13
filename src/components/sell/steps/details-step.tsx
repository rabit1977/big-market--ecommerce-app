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
import { cn } from '@/lib/utils';
import {
  ArrowRightLeft,
  Check,
  ChevronLeft,
  Info,
  Package,
  PenLine,
  Tag,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ListingFormData } from '../post-listing-wizard';
import { MK_LOCATIONS } from '@/lib/locations';

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

// ─────────────────────────────────────────────────────────────────────────────
// Macedonia — all municipalities grouped by city/region
// Imported from @/lib/locations
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Other static data
// ─────────────────────────────────────────────────────────────────────────────

const CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used' },
];

const BODY_TYPES = [
  { value: 'sedan', label: 'Sedan', icon: '🚗' },
  { value: 'hatchback', label: 'Hatchback', icon: '🚙' },
  { value: 'suv', label: 'SUV', icon: '🛻' },
  { value: 'coupe', label: 'Coupé', icon: '🏎️' },
  { value: 'convertible', label: 'Cabrio', icon: '🚘' },
  { value: 'wagon', label: 'Wagon', icon: '🚐' },
  { value: 'van', label: 'Van', icon: '🚌' },
  { value: 'pickup', label: 'Pickup', icon: '🛻' },
];

const EMISSION_STANDARDS = [
  'Euro 1',
  'Euro 2',
  'Euro 3',
  'Euro 4',
  'Euro 5',
  'Euro 6',
  'Euro 6d',
];

const MILEAGE_OPTIONS = [
  { value: '0-10000', label: '0 – 10.000 km' },
  { value: '10-30000', label: '10.000 – 30.000 km' },
  { value: '30-60000', label: '30.000 – 60.000 km' },
  { value: '60-100000', label: '60.000 – 100.000 km' },
  { value: '100-150000', label: '100.000 – 150.000 km' },
  { value: '150-200000', label: '150.000 – 200.000 km' },
  { value: '200000+', label: '200.000+ km' },
];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1979 }, (_, i) =>
  String(currentYear - i),
);

const CAR_COLORS = [
  { value: 'black', label: 'Црна', hex: '#1a1a1a' },
  { value: 'white', label: 'Бела', hex: '#f5f5f5' },
  { value: 'silver', label: 'Сребрена', hex: '#c0c0c0' },
  { value: 'gray', label: 'Сива', hex: '#6b7280' },
  { value: 'red', label: 'Црвена', hex: '#dc2626' },
  { value: 'blue', label: 'Сина', hex: '#2563eb' },
  { value: 'dark-blue', label: 'Т.сина', hex: '#1e3a5f' },
  { value: 'green', label: 'Зелена', hex: '#16a34a' },
  { value: 'beige', label: 'Беж', hex: '#d4b896' },
  { value: 'brown', label: 'Кафена', hex: '#7c3f1e' },
];

const CAR_BRANDS: Record<string, string[]> = {
  Audi: [
    'A1',
    'A2',
    'A3',
    'A4',
    'A5',
    'A6',
    'A7',
    'A8',
    'Q2',
    'Q3',
    'Q4 e-tron',
    'Q5',
    'Q7',
    'Q8',
    'TT',
    'R8',
    'e-tron',
    'S3',
    'S4',
    'S5',
    'S6',
    'RS3',
    'RS4',
    'RS6',
  ],
  BMW: [
    '1 Series',
    '2 Series',
    '3 Series',
    '4 Series',
    '5 Series',
    '6 Series',
    '7 Series',
    '8 Series',
    'X1',
    'X2',
    'X3',
    'X4',
    'X5',
    'X6',
    'X7',
    'Z3',
    'Z4',
    'M2',
    'M3',
    'M4',
    'M5',
    'i3',
    'i4',
    'iX',
  ],
  Mercedes: [
    'A-Class',
    'B-Class',
    'C-Class',
    'E-Class',
    'S-Class',
    'CLA',
    'CLS',
    'GLA',
    'GLB',
    'GLC',
    'GLE',
    'GLS',
    'EQA',
    'EQB',
    'EQC',
    'G-Class',
    'AMG GT',
    'SL',
    'SLK',
  ],
  Volkswagen: [
    'Golf',
    'Polo',
    'Passat',
    'Tiguan',
    'Touareg',
    'Touran',
    'T-Roc',
    'T-Cross',
    'Sharan',
    'Arteon',
    'ID.3',
    'ID.4',
    'ID.5',
    'Phaeton',
    'Scirocco',
    'Beetle',
    'Up',
    'Caddy',
  ],
  Toyota: [
    'Yaris',
    'Corolla',
    'Camry',
    'Auris',
    'Avensis',
    'Prius',
    'RAV4',
    'Land Cruiser',
    'Hilux',
    'C-HR',
    'Aygo',
    'Supra',
    'GR86',
    'Verso',
    'Previa',
    'bZ4X',
  ],
  Honda: [
    'Civic',
    'Accord',
    'Jazz',
    'CR-V',
    'HR-V',
    'Pilot',
    'Fit',
    'Insight',
    'Element',
    'Ridgeline',
    'e',
    'ZR-V',
  ],
  Ford: [
    'Fiesta',
    'Focus',
    'Mondeo',
    'Puma',
    'Kuga',
    'Explorer',
    'Mustang',
    'Edge',
    'Ranger',
    'Transit',
    'EcoSport',
    'Bronco',
    'F-150',
    'Maverick',
  ],
  Opel: [
    'Astra',
    'Corsa',
    'Insignia',
    'Zafira',
    'Meriva',
    'Mokka',
    'Crossland',
    'Grandland',
    'Adam',
    'Agila',
    'Combo',
    'Vivaro',
    'Vectra',
    'Omega',
  ],
  Renault: [
    'Clio',
    'Megane',
    'Laguna',
    'Scenic',
    'Captur',
    'Koleos',
    'Kadjar',
    'Talisman',
    'Zoe',
    'Arkana',
    'Austral',
    'Espace',
    'Twingo',
    'Kangoo',
  ],
  Peugeot: [
    '108',
    '208',
    '308',
    '408',
    '508',
    '2008',
    '3008',
    '5008',
    'Rifter',
    'Partner',
    'Traveller',
    'e-208',
    'e-2008',
  ],
  Seat: [
    'Ibiza',
    'Leon',
    'Ateca',
    'Arona',
    'Tarraco',
    'Alhambra',
    'Toledo',
    'Mii',
  ],
  Skoda: [
    'Fabia',
    'Octavia',
    'Superb',
    'Rapid',
    'Karoq',
    'Kodiaq',
    'Scala',
    'Kamiq',
    'Enyaq',
    'Citigo',
  ],
  Hyundai: [
    'i10',
    'i20',
    'i30',
    'i40',
    'ix35',
    'Tucson',
    'Santa Fe',
    'Ioniq',
    'Ioniq 5',
    'Ioniq 6',
    'Kona',
    'Bayon',
  ],
  Kia: [
    'Picanto',
    'Rio',
    'Ceed',
    'ProCeed',
    'Optima',
    'Sportage',
    'Sorento',
    'Soul',
    'Stinger',
    'Niro',
    'EV6',
  ],
  Nissan: [
    'Micra',
    'Note',
    'Leaf',
    'Qashqai',
    'X-Trail',
    'Juke',
    'Navara',
    'Pathfinder',
    'Murano',
    '370Z',
    'Ariya',
  ],
  Mazda: [
    'Mazda2',
    'Mazda3',
    'Mazda6',
    'CX-3',
    'CX-5',
    'CX-30',
    'CX-50',
    'MX-5',
    'MX-30',
  ],
  Subaru: ['Impreza', 'Legacy', 'Outback', 'Forester', 'XV', 'BRZ', 'WRX'],
  Mitsubishi: [
    'Colt',
    'Lancer',
    'Outlander',
    'Eclipse Cross',
    'ASX',
    'Pajero',
    'L200',
    'Space Star',
  ],
  Volvo: [
    'V40',
    'V60',
    'V70',
    'V90',
    'S40',
    'S60',
    'S80',
    'S90',
    'XC40',
    'XC60',
    'XC90',
    'C30',
    'EX30',
  ],
  Fiat: [
    'Punto',
    'Uno',
    'Panda',
    '500',
    'Tipo',
    'Bravo',
    'Stilo',
    'Ducato',
    'Doblo',
    '500X',
    '600',
  ],
  'Alfa Romeo': [
    '147',
    '156',
    '159',
    'Giulia',
    'Giulietta',
    'Stelvio',
    'Tonale',
    'Spider',
    '4C',
    'Brera',
  ],
  Jeep: [
    'Renegade',
    'Compass',
    'Cherokee',
    'Grand Cherokee',
    'Wrangler',
    'Gladiator',
    'Avenger',
  ],
  Chevrolet: [
    'Spark',
    'Aveo',
    'Cruze',
    'Malibu',
    'Camaro',
    'Corvette',
    'Equinox',
    'Trax',
    'Captiva',
    'Blazer',
  ],
  Tesla: ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck'],
  Porsche: [
    '911',
    'Cayenne',
    'Macan',
    'Panamera',
    'Taycan',
    'Boxster',
    'Cayman',
  ],
  'Land Rover': [
    'Defender',
    'Discovery',
    'Freelander',
    'Range Rover',
    'Range Rover Sport',
    'Range Rover Evoque',
  ],
  Jaguar: ['XE', 'XF', 'XJ', 'F-Type', 'E-Pace', 'F-Pace', 'I-Pace'],
  Lexus: ['IS', 'ES', 'GS', 'LS', 'UX', 'NX', 'RX', 'LX', 'LC'],
  Dacia: ['Logan', 'Sandero', 'Duster', 'Lodgy', 'Dokker', 'Spring', 'Jogger'],
  Suzuki: ['Swift', 'Ignis', 'Baleno', 'Vitara', 'SX4', 'Jimny', 'S-Cross'],
  Citroen: [
    'C1',
    'C2',
    'C3',
    'C4',
    'C5',
    'Berlingo',
    'Picasso',
    'C5 X',
    'C3 Aircross',
    'C5 Aircross',
  ],
  Mini: ['One', 'Cooper', 'Clubman', 'Countryman', 'Convertible'],
  Cupra: ['Formentor', 'Born', 'Ateca', 'Leon'],
  Polestar: ['2', '3', '4'],
  Genesis: ['G70', 'G80', 'G90', 'GV70', 'GV80'],
  DS: ['DS3', 'DS4', 'DS5', 'DS7', 'DS9'],
  Smart: ['ForTwo', 'ForFour', '#1', '#3'],
};

const BRAND_NAMES = Object.keys(CAR_BRANDS).sort();
const VEHICLE_SLUGS = [
  'cars',
  'motorcycles',
  'trucks',
  'vehicles',
  'vechicles',
  'auto',
  'vozila',
  'avtomobili',
];
const MANUAL_KEYS = new Set<string>([
  // 'condition', // Removed to allow dynamic condition field
  // 'sostojba',
]);

// ─────────────────────────────────────────────────────────────────────────────
// Style tokens
// ─────────────────────────────────────────────────────────────────────────────
const ghostSelect =
  'h-10 border-none shadow-none ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent hover:bg-secondary/30 transition-colors rounded-md px-3 font-medium text-sm [&>svg]:opacity-40';
const ghostInput =
  'h-10 border-none shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent hover:bg-secondary/30 transition-colors rounded-md px-3 font-medium text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
function FieldRow({
  label,
  required,
  children,
  tall,
  id,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  tall?: boolean;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        'flex gap-3 px-4',
        tall
          ? 'flex-col py-2 sm:flex-row sm:items-start'
          : 'items-center min-h-[40px]',
      )}
    >
      <span className='hidden sm:block text-sm text-muted-foreground w-28 shrink-0 truncate'>
        {label}
        {required && <span className='text-destructive ml-0.5'>*</span>}
      </span>
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
      onClick={() => onChange(!checked)}
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
    <div className='flex items-center gap-3 px-4 min-h-[52px]'>
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

  const isVehicle = false; // Deprecated, using dynamic templates

  const handleSpec = (key: string, value: any) => {
    const updates: Partial<ListingFormData> = {
      specifications: { ...(formData.specifications || {}), [key]: value },
    };
    
    // Promote key fields to top-level for validation
    if (key === 'condition') updates.condition = value;
    if (key === 'description') updates.description = value;
    
    updateFormData(updates);
  };

  const selectedBrand = formData.specifications?.brand || '';
  const availableModels = selectedBrand
    ? (CAR_BRANDS[selectedBrand] ?? [])
    : [];
  const selectedColor = formData.specifications?.color || '';
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
            {/* Ad title */}

            <div
              id='title'
              className='p-4 sm:p-6 bg-primary/5 transition-colors'
            >
              <div className='mb-3 flex items-center justify-between'>
                <div className='flex items-center gap-1.5'>
                  <span className='text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5'>
                    <PenLine className='w-4 h-4' />
                    Listing Title
                  </span>
                  <span className='text-destructive font-bold text-sm'>*</span>
                </div>
              </div>
              <Input
                placeholder={
                  selectedCategory?.template?.titlePlaceholder ||
                  t('label_title')
                }
                value={formData.title || ''}
                onChange={(e) => updateFormData({ title: e.target.value })}
                className='text-lg sm:text-2xl font-bold h-12 sm:h-16 px-4 bg-background border-2 border-primary/20 hover:border-primary/40 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 transition-all rounded-xl placeholder:text-muted-foreground/40 placeholder:font-medium shadow-sm'
              />
              <p className='text-xs text-muted-foreground mt-3 flex items-center gap-1.5 font-medium'>
                <Info className='w-4 h-4 text-primary/70 shrink-0' />
                This is the main title that buyers will see when searching for
                your item. Make it clear!
              </p>
            </div>

            {/* ── Dynamic template fields ── */}
            {dynamicFields.map((field) => {
              if (field.key === 'isTradePossible') {
                return (
                  <SwitchRow
                    key={field.key}
                    icon={ArrowRightLeft}
                    label={field.label}
                    checked={['Да', 'Yes', 'True', 'true'].includes(formData.specifications?.isTradePossible)}
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
                      className={cn(ghostInput, 'max-w-xs')}
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
            {!dynamicFields.some(f => f.key === 'condition') && (
              <div id='condition' className='px-4 py-3 space-y-2'>
                <span className='text-sm text-muted-foreground'>
                  Condition <span className='text-destructive ml-0.5'>*</span>
                </span>
                <div className='flex gap-2 flex-wrap'>
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
              </div>
            )}
            {/* Price */}
            <FieldRow id='price' label='Price' required>
              <div className='flex items-center justify-between flex-wrap w-full'>
                <div className='flex flex-2 items-center border-r'>
                  <Input
                    type='number'
                    placeholder=''
                    min={0}
                    step={500}
                    value={formData.price ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateFormData({
                        price: val === '' ? undefined : parseFloat(val),
                      });
                    }}
                    className={cn(
                      ghostInput,
                      '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                    )}
                  />
                  <span className='text-xs text-muted-foreground pointer-events-none select-none pr-4'>
                    {currencySymbol}
                  </span>
                </div>
                <Select
                  value={formData.currency || 'MKD'}
                  onValueChange={(val) => updateFormData({ currency: val })}
                >
                  <SelectTrigger className='flex-1 h-10 w-[84px] px-2 border-none shadow-none ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent hover:bg-secondary/30 transition-colors rounded-md text-xs font-medium'>
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
            {selectedRegion && selectedRegion !== 'Друго' &&
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
            {!dynamicFields.some(f => f.key === 'description') && (
              <FieldRow id='description' label='Description' required tall>
                <Textarea
                  placeholder='Describe the product...'
                  value={formData.description || ''}
                  onChange={(e) =>
                    updateFormData({ description: e.target.value })
                  }
                  rows={4}
                  className='resize-none text-sm border-none shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent hover:bg-secondary/30 transition-colors rounded-md px-3 py-2 -mt-1'
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
