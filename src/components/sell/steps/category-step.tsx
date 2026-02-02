'use client';

import { Card } from '@/components/ui/card';
import {
    Baby as BabyIcon,
    Book,
    Briefcase,
    Building2,
    Car,
    ChevronLeft,
    ChevronRight,
    Dog,
    Dumbbell,
    Shirt as Fashion,
    Heart,
    Home,
    LucideIcon,
    Smartphone,
    Sofa,
    Wrench
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { ListingFormData } from '../post-listing-wizard';

interface CategoryStepProps {
  categories: Array<{
    _id: string;
    name: string;
    slug: string;
    parentId?: string;
    template?: any;
  }>;
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
  onNext: () => void;
}

const categoryIcons: Record<string, LucideIcon> = {
  'motor-vehicles': Car,
  'real-estate': Home,
  'home-garden': Sofa,
  'fashion': Fashion,
  'electronics': Smartphone,
  'sports-leisure': Dumbbell,
  'baby-kids': BabyIcon,
  'business-industry': Building2,
  'pets': Dog,
  'jobs': Briefcase,
  'services': Wrench,
  'books-art': Book,
  'health-beauty': Heart,
};

export function CategoryStep({
  categories,
  formData,
  updateFormData,
  onNext,
}: CategoryStepProps) {
  const [level, setLevel] = useState(0); // 0: Main, 1: Sub, 2: Sub-Sub
  const [selectedMainId, setSelectedMainId] = useState<string | null>(null);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);

  const mainCategories = useMemo(() => categories.filter((cat) => !cat.parentId), [categories]);
  
  const subCategories = useMemo(() => {
    if (!selectedMainId) return [];
    return categories.filter((cat) => cat.parentId === selectedMainId);
  }, [categories, selectedMainId]);

  const subSubCategories = useMemo(() => {
    if (!selectedSubId) return [];
    return categories.filter((cat) => cat.parentId === selectedSubId);
  }, [categories, selectedSubId]);

  const handleMainSelect = (category: any) => {
    setSelectedMainId(category._id);
    const hasSubs = categories.some(cat => cat.parentId === category._id);
    if (hasSubs) {
      setLevel(1);
    } else {
      updateFormData({ category: category.slug, subCategory: undefined });
      onNext();
    }
  };

  const handleSubSelect = (subcategory: any) => {
    setSelectedSubId(subcategory._id);
    const hasSubSubs = categories.some(cat => cat.parentId === subcategory._id);
    if (hasSubSubs) {
      setLevel(2);
    } else {
      updateFormData({ 
        category: categories.find(c => c._id === selectedMainId)?.slug, 
        subCategory: subcategory.slug 
      });
      onNext();
    }
  };

  const handleSubSubSelect = (subSubCategory: any) => {
      updateFormData({ 
        category: categories.find(c => c._id === selectedMainId)?.slug, 
        subCategory: subSubCategory.slug 
      });
      onNext();
  };

  const goBack = () => {
    if (level === 2) {
      setLevel(1);
      setSelectedSubId(null);
    } else if (level === 1) {
      setLevel(0);
      setSelectedMainId(null);
    }
  };

  const currentItems = level === 0 ? mainCategories : level === 1 ? subCategories : subSubCategories;
  const currentTitle = level === 0 ? "Select Category" : level === 1 ? "Select Subcategory" : "Select Specific Type";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {level > 0 && (
          <button 
            onClick={goBack}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <div>
          <h2 className="text-2xl font-bold">{currentTitle}</h2>
          <p className="text-muted-foreground">
            {level === 0 ? "Choose the main category for your listing" : "Refine your selection to help buyers find you"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentItems.map((item) => {
          const Icon = categoryIcons[item.slug] || Smartphone;
          const hasMore = categories.some(cat => cat.parentId === item._id);

          return (
            <Card
              key={item._id}
              onClick={() => {
                if (level === 0) handleMainSelect(item);
                else if (level === 1) handleSubSelect(item);
                else handleSubSubSelect(item);
              }}
              className="p-4 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <Icon className="w-6 h-6 group-hover:text-primary transition-colors" />
                </div>
                
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {level === 0 ? `Post in ${item.name}` : `Select ${item.name}`}
                  </p>
                </div>

                {hasMore && (
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
