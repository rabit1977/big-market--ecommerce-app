'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils/formatters';
import {
    AlertCircle,
    CheckCircle2,
    Mail,
    MapPin,
    Package,
    Phone
} from 'lucide-react';
import Image from 'next/image';
import { ListingFormData } from '../post-listing-wizard';

interface ReviewStepProps {
  formData: ListingFormData;
  categories: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
}

export function ReviewStep({ formData, categories }: ReviewStepProps) {
  const category = categories.find((c) => c.slug === formData.category);
  const images = formData.images || [];

  const completionChecks = [
    { label: 'Category selected', completed: !!formData.category },
    { label: 'Title provided', completed: !!formData.title },
    { label: 'Description added', completed: !!formData.description },
    { label: 'Price set', completed: !!formData.price },
    { label: 'Location specified', completed: !!formData.city },
    { label: 'Images uploaded', completed: images.length > 0 },
  ];

  const allComplete = completionChecks.every((check) => check.completed);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review Your Listing</h2>
        <p className="text-muted-foreground">
          Make sure everything looks good before publishing
        </p>
      </div>

      {/* Completion Checklist */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Completion Checklist</h3>
        <div className="space-y-2">
          {completionChecks.map((check, index) => (
            <div key={index} className="flex items-center gap-2">
              {check.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-500" />
              )}
              <span
                className={
                  check.completed ? 'text-foreground' : 'text-muted-foreground'
                }
              >
                {check.label}
              </span>
            </div>
          ))}
        </div>
        
        {allComplete && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              ✓ Your listing is ready to publish!
            </p>
          </div>
        )}
      </Card>

      {/* Preview Card */}
      <Card className="overflow-hidden">
        {/* Images */}
        {images.length > 0 && (
          <div className="relative aspect-video bg-muted">
            <Image
              src={formData.thumbnail || images[0]}
              alt={formData.title || 'Listing preview'}
              fill
              className="object-cover"
            />
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                +{images.length - 1} more
              </div>
            )}
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Category Badge */}
          {category && (
            <Badge variant="secondary" className="gap-1">
              <Package className="w-3 h-3" />
              {category.name}
            </Badge>
          )}

          {/* Title */}
          <h3 className="text-2xl font-bold">{formData.title || 'Untitled'}</h3>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              {formatCurrency(formData.price || 0, formData.currency)}
            </span>
            {formData.condition && (
              <Badge variant="outline" className="capitalize">
                {formData.condition.replace('-', ' ')}
              </Badge>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {formData.description || 'No description provided'}
            </p>
          </div>

          <Separator />

          {/* Location & Contact */}
          <div className="space-y-3">
            <h4 className="font-semibold">Location & Contact</h4>
            
            <div className="space-y-2 text-sm">
              {formData.city && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="capitalize">{formData.city}</span>
                  {formData.region && <span>• {formData.region}</span>}
                </div>
              )}
              
              {formData.contactPhone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{formData.contactPhone}</span>
                </div>
              )}
              
              {formData.contactEmail && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{formData.contactEmail}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Publishing Info */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          📢 What happens next?
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Your listing will be published immediately</li>
          <li>• It will appear in search results within minutes</li>
          <li>• You'll receive notifications when users contact you</li>
          <li>• You can edit or delete your listing anytime</li>
        </ul>
      </Card>
    </div>
  );
}
