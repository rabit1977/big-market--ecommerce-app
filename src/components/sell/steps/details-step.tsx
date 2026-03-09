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
import { Check, ChevronLeft, Package, Tag } from 'lucide-react';
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

// ─────────────────────────────────────────────────────────────────────────────
// Macedonia — all municipalities grouped by city/region
// ─────────────────────────────────────────────────────────────────────────────
const MK_LOCATIONS: Record<string, string[]> = {
  Скопје: [
    'Аеродром',
    'Бутел',
    'Гази Баба',
    'Ѓорче Петров',
    'Зелениково',
    'Карпош',
    'Кисела Вода',
    'Петровец',
    'Сарај',
    'Сопиште',
    'Студеничани',
    'Центар',
    'Чаир',
    'Шуто Оризари',
  ],
  Битола: ['Битола', 'Новаци', 'Могила', 'Демир Хисар'],
  Куманово: ['Куманово', 'Липково', 'Старо Нагоричане'],
  Прилеп: ['Прилеп', 'Долнени', 'Кривогаштани'],
  Тетово: ['Тетово', 'Брвеница', 'Јегуновце', 'Теарце', 'Желино', 'Боговиње'],
  Велес: ['Велес', 'Чашка'],
  Охрид: ['Охрид', 'Дебрца'],
  Гостивар: ['Гостивар', 'Врапчиште', 'Маврово и Ростуше'],
  Штип: ['Штип', 'Карбинци', 'Лесново'],
  Струмица: [
    'Струмица',
    'Василево',
    'Босилово',
    'Ново Село',
    'Радовиш',
    'Конче',
  ],
  Кавадарци: ['Кавадарци', 'Росоман', 'Неготино'],
  Кочани: ['Кочани', 'Чешиново-Облешево', 'Зрновци', 'Виница'],
  Кичево: ['Кичево', 'Осломеј', 'Вранештица', 'Зајас', 'Пласница', 'Другово'],
  Струга: ['Струга', 'Вевчани'],
  Гевгелија: ['Гевгелија', 'Богданци', 'Дојран', 'Валандово'],
  Дебар: ['Дебар', 'Центар Жупа', 'Маврово и Ростуше'],
  'Крива Паланка': ['Крива Паланка', 'Кратово', 'Ранковце'],
  'Свети Николе': ['Свети Николе', 'Лозово'],
  Берово: ['Берово', 'Пехчево', 'Делчево', 'Македонска Каменица'],
  'Прешево / Пчиња': ['Врање', 'Бујановац'],
  'Скопска Блатија': ['Илинден', 'Арачиново', 'Чучер-Сандево'],
  Полог: ['Боговиње', 'Желино', 'Теарце'],
  'Овче Поле': ['Свети Николе', 'Лозово', 'Пробиштип'],
  Тиквеш: ['Кавадарци', 'Неготино', 'Росоман'],
};

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
const VEHICLE_SLUGS = ['cars', 'motorcycles', 'trucks', 'vehicles', 'auto'];
const MANUAL_KEYS = new Set([
  'brand',
  'model',
  'year',
  'reg_month',
  'reg_year',
  'mileage',
  'emission',
  'body_type',
  'color',
  'condition',
  'sostojba',
]);

// ─────────────────────────────────────────────────────────────────────────────
// Style tokens
// ─────────────────────────────────────────────────────────────────────────────
const ghostSelect =
  'h-9 border-0 shadow-none focus:ring-0 bg-transparent px-3 font-medium text-sm [&>svg]:opacity-40';
const ghostInput =
  'h-9 border-0 shadow-none focus-visible:ring-0 bg-transparent px-3 font-medium text-sm';

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
function FieldRow({
  label,
  required,
  children,
  tall,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  tall?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex gap-3 px-4',
        tall
          ? 'flex-col py-2 sm:flex-row sm:items-start'
          : 'items-center min-h-[40px]',
      )}
    >
      <span className='hidden sm:block text-sm text-muted-foreground w-28 shrink-0 pt-px truncate'>
        {label}
        {required && <span className='text-destructive ml-0.5'>*</span>}
      </span>
      <div className='flex-1 min-w-0'>{children}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className='px-4 pt-2 pb-1 bg-muted/30'>
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
        checked ? 'bg-primary' : 'bg-input',
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

  const isVehicle = VEHICLE_SLUGS.some(
    (s) => formData.category?.includes(s) || formData.subCategory?.includes(s),
  );

  const handleSpec = (key: string, value: any) =>
    updateFormData({
      specifications: { ...(formData.specifications || {}), [key]: value },
    });

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
      {/* Mobile sticky header */}
      <div className='sticky top-0 z-10 flex items-center gap-3 px-4 py-3 bg-background/95 backdrop-blur border-b lg:hidden'>
        <Button
          variant='ghost'
          size='icon'
          className='shrink-0 -ml-1'
          onClick={onBack}
        >
          <ChevronLeft className='h-5 w-5' />
        </Button>
        <span className='font-semibold text-base truncate'>
          {t('details_title')}
        </span>
      </div>

      <div className='max-w-5xl mx-auto px-4 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-3 gap-8'>
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

          {/* Ad title */}
          <Input
            placeholder={
              selectedCategory?.template?.titlePlaceholder || t('label_title')
            }
            value={formData.title || ''}
            onChange={(e) => updateFormData({ title: e.target.value })}
            className='h-12 text-base font-medium'
          />

          {/* ═══════════════ UNIFIED CARD ═══════════════ */}
          <div className='rounded-xl border bg-card overflow-hidden divide-y divide-border'>
            {/* ── Dynamic template fields ── */}
            {dynamicFields.map((field) => (
              <FieldRow
                key={field.key}
                label={field.label}
                required={field.required}
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
            ))}

            {/* ════════════════════════
                VEHICLE BLOCK
            ════════════════════════ */}
            {isVehicle && (
              <>
                <SectionLabel>Возило</SectionLabel>

                {/* Brand */}
                <FieldRow label='Brand' required>
                  <Select
                    value={selectedBrand}
                    onValueChange={(val) => {
                      updateFormData({
                        specifications: {
                          ...(formData.specifications || {}),
                          brand: val,
                          model: '',
                        },
                      });
                    }}
                  >
                    <SelectTrigger className={ghostSelect}>
                      <SelectValue placeholder='Select Brand' />
                    </SelectTrigger>
                    <SelectContent className='max-h-64'>
                      {BRAND_NAMES.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldRow>

                {/* Model — appears after brand */}
                {selectedBrand && (
                  <FieldRow label='Model' required>
                    <Select
                      value={formData.specifications?.model || ''}
                      onValueChange={(val) => handleSpec('model', val)}
                    >
                      <SelectTrigger className={ghostSelect}>
                        <SelectValue placeholder={`${selectedBrand} model`} />
                      </SelectTrigger>
                      <SelectContent className='max-h-64'>
                        {availableModels.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldRow>
                )}

                {/* Body type */}
                <div className='px-4 py-3 space-y-2'>
                  <span className='hidden sm:block text-sm text-muted-foreground'>
                    Body Type
                  </span>
                  <div className='grid grid-cols-4 sm:grid-cols-8 gap-1.5'>
                    {BODY_TYPES.map((bt) => (
                      <button
                        key={bt.value}
                        type='button'
                        onClick={() => handleSpec('body_type', bt.value)}
                        className={cn(
                          'flex flex-col items-center justify-center gap-1 rounded-lg border py-2 px-1 text-center transition-all text-xs font-medium select-none',
                          formData.specifications?.body_type === bt.value
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border/60 hover:border-border text-muted-foreground hover:text-foreground',
                        )}
                      >
                        <span className='text-xl leading-none'>{bt.icon}</span>
                        <span className='leading-tight'>{bt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Registration ── */}
                <SectionLabel>Registration</SectionLabel>

                {/* Year of manufacture */}
                <FieldRow label='Year of Manufacture' required>
                  <Select
                    value={formData.specifications?.year || ''}
                    onValueChange={(val) => handleSpec('year', val)}
                  >
                    <SelectTrigger className={ghostSelect}>
                      <SelectValue placeholder='Year of manufacture' />
                    </SelectTrigger>
                    <SelectContent className='max-h-56'>
                      {YEARS.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldRow>

                {/* Registration month + year */}
                <FieldRow label='Registration Date'>
                  <div className='flex gap-2 items-center'>
                    <Select
                      value={formData.specifications?.reg_month || ''}
                      onValueChange={(val) => handleSpec('reg_month', val)}
                    >
                      <SelectTrigger
                        className={cn(ghostSelect, 'min-w-[110px]')}
                      >
                        <SelectValue placeholder='Month' />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((m, i) => (
                          <SelectItem
                            key={m}
                            value={String(i + 1).padStart(2, '0')}
                          >
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className='text-muted-foreground text-sm shrink-0'>
                      /
                    </span>
                    <Select
                      value={formData.specifications?.reg_year || ''}
                      onValueChange={(val) => handleSpec('reg_year', val)}
                    >
                      <SelectTrigger className={cn(ghostSelect, 'w-24')}>
                        <SelectValue placeholder='Year' />
                      </SelectTrigger>
                      <SelectContent className='max-h-56'>
                        {YEARS.map((y) => (
                          <SelectItem key={y} value={y}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </FieldRow>

                {/* ── Детали ── */}
                <SectionLabel>Details</SectionLabel>

                {/* Mileage */}
                <FieldRow label='Mileage' required>
                  <Select
                    value={formData.specifications?.mileage || ''}
                    onValueChange={(val) => handleSpec('mileage', val)}
                  >
                    <SelectTrigger className={ghostSelect}>
                      <SelectValue placeholder='Mileage' />
                    </SelectTrigger>
                    <SelectContent>
                      {MILEAGE_OPTIONS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldRow>

                {/* Emission */}
                <FieldRow label='Emission Standard' required>
                  <Select
                    value={formData.specifications?.emission || ''}
                    onValueChange={(val) => handleSpec('emission', val)}
                  >
                    <SelectTrigger className={ghostSelect}>
                      <SelectValue placeholder='Euro standard' />
                    </SelectTrigger>
                    <SelectContent>
                      {EMISSION_STANDARDS.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldRow>

                {/* Color swatches */}
                <div className='px-4 py-3 space-y-2'>
                  <span className='text-sm text-muted-foreground hidden sm:block'>
                    Color
                  </span>
                  {/* Mobile: show "Color" label always */}
                  <span className='text-sm text-muted-foreground sm:hidden'>
                    Color
                  </span>
                  <div className='flex flex-wrap gap-3'>
                    {CAR_COLORS.map((c) => {
                      const active = selectedColor === c.value;
                      const isLight = ['white', 'silver', 'beige'].includes(
                        c.value,
                      );
                      return (
                        <button
                          key={c.value}
                          type='button'
                          title={c.label}
                          onClick={() =>
                            handleSpec('color', active ? '' : c.value)
                          }
                          className='flex flex-col items-center gap-1'
                        >
                          <span
                            className={cn(
                              'w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center',
                              active
                                ? 'border-primary scale-110 shadow-md'
                                : 'border-transparent hover:scale-105',
                              isLight && !active && 'border-border/50',
                            )}
                            style={{ backgroundColor: c.hex }}
                          >
                            {active && (
                              <Check
                                className={cn(
                                  'h-3.5 w-3.5',
                                  isLight ? 'text-gray-700' : 'text-white',
                                )}
                              />
                            )}
                          </span>
                          <span className='text-[10px] text-muted-foreground leading-tight text-center w-9 truncate'>
                            {c.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* ════════════════════════
                LISTING DETAILS
            ════════════════════════ */}
            <SectionLabel>Listing Details</SectionLabel>

            {/* New / Used toggle chips */}
            <div className='px-4 py-3 space-y-2'>
              <span className='hidden sm:block text-sm text-muted-foreground'>
                Condition
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

            {/* Price */}
            <FieldRow label='Price' required>
              <div className='flex items-center gap-1 flex-wrap'>
                <div className='relative flex items-center'>
                  <span className='absolute left-3 text-xs text-muted-foreground pointer-events-none select-none'>
                    {currencySymbol}
                  </span>
                  <Input
                    type='number'
                    placeholder='0'
                    min={0}
                    step={500}
                    value={formData.price || ''}
                    onChange={(e) =>
                      updateFormData({ price: parseFloat(e.target.value) || 0 })
                    }
                    className={cn(
                      ghostInput,
                      'pl-8 w-28 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                    )}
                  />
                </div>
                <Select
                  value={formData.currency || 'MKD'}
                  onValueChange={(val) => updateFormData({ currency: val })}
                >
                  <SelectTrigger className='h-9 w-[84px] px-2 border-0 shadow-none focus:ring-0 bg-transparent text-xs font-medium'>
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
              description='Buyers can send their own offer'
              checked={formData.acceptsPriceOffers ?? false}
              onChange={(v) => updateFormData({ acceptsPriceOffers: v })}
            />

            <SwitchRow
              icon={Package}
              label='Shipping available'
              description='The product can be delivered by cargo'
              checked={formData.shippingAvailable ?? false}
              onChange={(v) => updateFormData({ shippingAvailable: v })}
            />

            {/* ════════════════════════
                LOCATION
            ════════════════════════ */}
            <SectionLabel>Location</SectionLabel>

            {/* Region / City */}
            <FieldRow label='City / Region' required>
              <Select
                value={selectedRegion}
                onValueChange={(v) => {
                  updateFormData({ region: v, city: '' });
                }}
              >
                <SelectTrigger className={ghostSelect}>
                  <SelectValue placeholder='Select Region' />
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
              (MK_LOCATIONS[selectedRegion]?.length ?? 0) > 0 && (
                <FieldRow label='Municipality' required>
                  <Select
                    value={formData.city || ''}
                    onValueChange={(v) => updateFormData({ city: v })}
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
                    </SelectContent>
                  </Select>
                </FieldRow>
              )}

            {/* ════════════════════════
                DESCRIPTION & CONTACT
            ════════════════════════ */}
            <SectionLabel>Description & Contact</SectionLabel>

            {/* Description */}
            <FieldRow label='Description' required tall>
              <Textarea
                placeholder='Describe the product...'
                value={formData.description || ''}
                onChange={(e) =>
                  updateFormData({ description: e.target.value })
                }
                rows={4}
                className='resize-none text-sm border-0 shadow-none focus-visible:ring-0 bg-transparent px-3 -mt-1'
              />
            </FieldRow>

            {/* Phone */}
            <FieldRow label='Phone' required>
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
            <FieldRow label='Email' required>
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
