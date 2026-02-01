'use client';

import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Briefcase,
    Car,
    ChevronRight,
    Dumbbell,
    GraduationCap,
    Home,
    LucideIcon,
    PawPrint,
    Shirt,
    Smartphone,
    Sofa,
    Wrench
} from 'lucide-react';
import { ListingFormData } from '../post-listing-wizard';

interface CategoryStepProps {
  categories: Array<{
    _id: string;
    name: string;
    slug: string;
    template?: any;
  }>;
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
  onNext: () => void;
}

const categoryIcons: Record<string, LucideIcon> = {
  'vehicles': Car,
  'real-estate': Home,
  'electronics': Smartphone,
  'fashion': Shirt,
  'jobs': Briefcase,
  'services': Wrench,
  'sports-leisure': Dumbbell,
  'pets': PawPrint,
  'education': GraduationCap,
  'home-garden': Sofa,
};

export function CategoryStep({
  categories,
  formData,
  updateFormData,
  onNext,
}: CategoryStepProps) {
  const mainCategories = categories.filter((cat) => !cat.template?.parentId);

  const handleSelect = (value: string) => {
      updateFormData({ category: value });
      // Auto-advance after small delay for visual feedback
      setTimeout(() => {
          onNext();
      }, 400);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose a Category</h2>
        <p className="text-muted-foreground">
          Select the category that best describes your listing
        </p>
      </div>

      <RadioGroup
        value={formData.category}
        onValueChange={handleSelect}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {mainCategories.map((category) => {
          const Icon = categoryIcons[category.slug] || Smartphone;
          const isSelected = formData.category === category.slug;

          return (
            <Label
              key={category._id}
              htmlFor={category.slug}
              className="cursor-pointer"
            >
              <Card
                className={`
                  p-4 transition-all duration-200 hover:shadow-lg
                  ${
                    isSelected
                      ? 'border-primary border-2 bg-primary/5 shadow-md'
                      : 'border-2 border-transparent hover:border-primary/30'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <RadioGroupItem
                    value={category.slug}
                    id={category.slug}
                    className="shrink-0"
                  />
                  
                  <div
                    className={`
                      w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                      ${
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }
                    `}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold">{category.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Post in {category.name.toLowerCase()}
                    </p>
                  </div>

                  <ChevronRight
                    className={`
                      w-5 h-5 transition-all
                      ${
                        isSelected
                          ? 'text-primary translate-x-1'
                          : 'text-muted-foreground'
                      }
                    `}
                  />
                </div>
              </Card>
            </Label>
          );
        })}
      </RadioGroup>

      {formData.category && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm font-medium text-primary">
            ✓ Category selected:{' '}
            {mainCategories.find((c) => c.slug === formData.category)?.name}
          </p>
        </div>
      )}
    </div>
  );
}
