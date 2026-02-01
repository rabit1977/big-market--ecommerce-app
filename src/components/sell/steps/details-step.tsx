'use client';

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
import { ListingFormData } from '../post-listing-wizard';

interface DetailsStepProps {
  categories: Array<{
    _id: string;
    name: string;
    slug: string;
    template?: any;
  }>;
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
}

const cities = [
  'Skopje',
  'Bitola',
  'Kumanovo',
  'Prilep',
  'Tetovo',
  'Veles',
  'Ohrid',
  'Gostivar',
  'Štip',
  'Strumica',
  'Kavadarci',
  'Kočani',
  'Kičevo',
  'Struga',
  'Radoviš',
  'Gevgelija',
];

const conditions = [
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'used', label: 'Used' },
];

export function DetailsStep({
  categories,
  formData,
  updateFormData,
}: DetailsStepProps) {
  const selectedCategory = categories.find((c) => c.slug === formData.category);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Listing Details</h2>
        <p className="text-muted-foreground">
          Provide detailed information about your listing
        </p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="e.g., iPhone 15 Pro Max 256GB - Like New"
            value={formData.title || ''}
            onChange={(e) => updateFormData({ title: e.target.value })}
            className="text-base"
          />
          <p className="text-xs text-muted-foreground">
            {formData.title?.length || 0}/100 characters
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your item in detail. Include condition, features, reason for selling, etc."
            value={formData.description || ''}
            onChange={(e) => updateFormData({ description: e.target.value })}
            rows={6}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            {formData.description?.length || 0}/2000 characters
          </p>
        </div>

        {/* Price & Condition Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">
              Price (€) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="0.00"
              value={formData.price || ''}
              onChange={(e) =>
                updateFormData({ price: parseFloat(e.target.value) || 0 })
              }
              min="0"
              step="0.01"
            />
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select
              value={formData.condition}
              onValueChange={(value) => updateFormData({ condition: value })}
            >
              <SelectTrigger id="condition">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((condition) => (
                  <SelectItem key={condition.value} value={condition.value}>
                    {condition.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city">
              City <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.city}
              onValueChange={(value) => updateFormData({ city: value })}
            >
              <SelectTrigger id="city">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city.toLowerCase()}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Region/Neighborhood */}
          <div className="space-y-2">
            <Label htmlFor="region">Region/Neighborhood</Label>
            <Input
              id="region"
              placeholder="e.g., Centar, Aerodrom"
              value={formData.region || ''}
              onChange={(e) => updateFormData({ region: e.target.value })}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="pt-4 border-t">
          <h3 className="font-semibold mb-4">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+389 70 123 456"
                value={formData.contactPhone || ''}
                onChange={(e) =>
                  updateFormData({ contactPhone: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.contactEmail || ''}
                onChange={(e) =>
                  updateFormData({ contactEmail: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Category-specific fields placeholder */}
        {selectedCategory && (
          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">
              {selectedCategory.name} Specifications
            </h3>
            <p className="text-sm text-muted-foreground">
              Additional category-specific fields will appear here based on the
              template
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
