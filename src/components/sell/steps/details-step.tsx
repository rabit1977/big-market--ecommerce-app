'use client';

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
import { ChevronLeft } from 'lucide-react';
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

const cities = [
  'Skopje', 'Bitola', 'Kumanovo', 'Prilep', 'Tetovo', 'Veles', 'Ohrid', 'Gostivar', 
  'Štip', 'Strumica', 'Kavadarci', 'Kočani', 'Kičevo', 'Struga', 'Radoviš', 'Gevgelija',
];

const conditions = [
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'used', label: 'Used' },
];

export function DetailsStep({
  categories,
  formData,
  updateFormData,
  onBack,
}: DetailsStepProps) {
  // Use subcategory if selected, otherwise fallback to main category
  const selectedCategory = categories.find((c) => c.slug === formData.subCategory) || 
                           categories.find((c) => c.slug === formData.category);

  const handleSpecChange = (key: string, value: any) => {
    updateFormData({
      specifications: {
        ...(formData.specifications || {}),
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full shrink-0 mt-1" 
          onClick={onBack}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">Listing Details</h2>
          <p className="text-muted-foreground">
            Provide detailed information about your {selectedCategory?.name || 'item'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-semibold">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder={selectedCategory?.template?.titlePlaceholder || "e.g., iPhone 15 Pro Max 256GB - Like New"}
            value={formData.title || ''}
            onChange={(e) => updateFormData({ title: e.target.value })}
            className="h-12 text-lg font-medium border-2 focus:border-primary"
          />
        </div>

        {/* Dynamic Specifications Header */}
        {selectedCategory?.template?.fields && selectedCategory.template.fields.length > 0 && (
          <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full" />
              {selectedCategory.name} Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedCategory.template.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label className="text-sm font-medium">
                    {field.label} {field.required && <span className="text-destructive">*</span>}
                  </Label>
                  
                  {field.type === 'select' ? (
                    <Select
                      value={formData.specifications?.[field.key] || ''}
                      onValueChange={(val) => handleSpecChange(field.key, val)}
                    >
                      <SelectTrigger className="h-11 bg-background">
                        <SelectValue placeholder={`Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === 'number' ? (
                    <Input
                      type="number"
                      placeholder={field.placeholder || `e.g., 2024`}
                      value={formData.specifications?.[field.key] || ''}
                      onChange={(e) => handleSpecChange(field.key, e.target.value)}
                      className="h-11 bg-background"
                    />
                  ) : (
                    <Input
                      placeholder={field.placeholder || `e.g., ${field.label}`}
                      value={formData.specifications?.[field.key] || ''}
                      onChange={(e) => handleSpecChange(field.key, e.target.value)}
                      className="h-11 bg-background"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-semibold">
              Price (€) <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">€</span>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={formData.price || ''}
                onChange={(e) => updateFormData({ price: parseFloat(e.target.value) || 0 })}
                className="h-11 pl-8 bg-background border-2 focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition" className="text-sm font-semibold">
              Condition <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.condition}
              onValueChange={(value) => updateFormData({ condition: value })}
            >
              <SelectTrigger className="h-11 bg-background border-2 focus:border-primary">
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

          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-semibold">
              City <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.city}
              onValueChange={(value) => updateFormData({ city: value })}
            >
              <SelectTrigger className="h-11 bg-background border-2 focus:border-primary">
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-semibold">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your item in detail..."
            value={formData.description || ''}
            onChange={(e) => updateFormData({ description: e.target.value })}
            rows={8}
            className="resize-none text-base border-2 focus:border-primary"
          />
        </div>

        <div className="pt-6 border-t space-y-4">
          <h3 className="font-bold text-lg">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+389 70 123 456"
                value={formData.contactPhone || ''}
                onChange={(e) => updateFormData({ contactPhone: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.contactEmail || ''}
                onChange={(e) => updateFormData({ contactEmail: e.target.value })}
                className="h-11"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
