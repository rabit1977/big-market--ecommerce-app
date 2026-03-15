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
  Wrench,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
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
  'home-and-garden': Sofa,
  'fashion-clothing-shoes': Fashion,
  'mobile-phones-accessories': Smartphone,
  'sports-activities': Dumbbell,
  'baby-children-products': BabyIcon,
  'business-machines-tools': Building2,
  'hobby-animals': Dog,
  employment: Briefcase,
  'services-repairs': Wrench,
  'books-literature': Book,
  'health-beauty': Heart,
};

export function CategoryStep({
  categories,
  formData,
  updateFormData,
  onNext,
}: CategoryStepProps) {
  const t = useTranslations('Sell');

  const initialState = useMemo(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const levelParam = url.searchParams.get('cat_level');
      if (levelParam) {
        return {
          level: parseInt(levelParam, 10),
          mainId: url.searchParams.get('main_id') || null,
          subId: url.searchParams.get('sub_id') || null,
        };
      }
    }

    if (formData.subCategory) {
      const leaf = categories.find((c) => c.slug === formData.subCategory);
      if (leaf?.parentId) {
        const parent = categories.find((c) => c._id === leaf.parentId);
        if (parent?.parentId) {
          return { level: 2, mainId: parent.parentId, subId: leaf.parentId };
        }
        return { level: 1, mainId: leaf.parentId, subId: null };
      }
    }
    if (formData.category) {
      const main = categories.find((c) => c.slug === formData.category);
      if (main) return { level: 1, mainId: main._id, subId: null };
    }
    return { level: 0, mainId: null, subId: null };
  }, [formData, categories]);

  const [level, setLevel] = useState(initialState.level);
  const [selectedMainId, setSelectedMainId] = useState<string | null>(
    initialState.mainId,
  );
  const [selectedSubId, setSelectedSubId] = useState<string | null>(
    initialState.subId,
  );

  const mainCategories = useMemo(
    () => categories.filter((cat) => !cat.parentId),
    [categories],
  );

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
    const hasSubs = categories.some((cat) => cat.parentId === category._id);
    if (hasSubs) {
      setLevel(1);
      const url = new URL(window.location.href);
      url.searchParams.set('cat_level', '1');
      url.searchParams.set('main_id', category._id);
      window.history.pushState({}, '', url.toString());
    } else {
      updateFormData({ category: category.slug, subCategory: undefined });
      onNext();
    }
  };

  const handleSubSelect = (subcategory: any) => {
    setSelectedSubId(subcategory._id);
    const hasSubSubs = categories.some(
      (cat) => cat.parentId === subcategory._id,
    );
    if (hasSubSubs) {
      setLevel(2);
      const url = new URL(window.location.href);
      url.searchParams.set('cat_level', '2');
      url.searchParams.set('sub_id', subcategory._id);
      if (selectedMainId) url.searchParams.set('main_id', selectedMainId);
      window.history.pushState({}, '', url.toString());
    } else {
      updateFormData({
        category: categories.find((c) => c._id === selectedMainId)?.slug,
        subCategory: subcategory.slug,
      });
      onNext();
    }
  };

  const handleSubSubSelect = (subSubCategory: any) => {
    updateFormData({
      category: categories.find((c) => c._id === selectedMainId)?.slug,
      subCategory: subSubCategory.slug,
    });
    onNext();
  };

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const handlePopState = () => {
      const url = new URL(window.location.href);
      const levelParam = url.searchParams.get('cat_level');
      const lvl = levelParam ? parseInt(levelParam, 10) : 0;
      
      setLevel(lvl);

      if (lvl === 0) {
        setSelectedMainId(null);
        setSelectedSubId(null);
      } else if (lvl === 1) {
        const mId = url.searchParams.get('main_id');
        setSelectedMainId(mId || null);
        setSelectedSubId(null);
      } else if (lvl === 2) {
        const mId = url.searchParams.get('main_id');
        const sId = url.searchParams.get('sub_id');
        setSelectedMainId(mId || null);
        setSelectedSubId(sId || null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState();

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const currentItems =
    level === 0
      ? mainCategories
      : level === 1
        ? subCategories
        : subSubCategories;
  const currentTitle =
    level === 0
      ? t('cat_select_title')
      : level === 1
        ? t('cat_select_sub')
        : t('cat_select_type');
  const currentDesc = level === 0 ? t('cat_desc_main') : t('cat_desc_sub');

  return (
    <div className='space-y-4 hover'>
      <div className='flex items-center gap-1'>
        {level > 0 && (
          <button
            onClick={goBack}
            className='p-2 hover:bg-muted rounded-full transition-colors'
          >
            <ChevronLeft className='w-6 h-6' />
          </button>
        )}
        <div>
          <h2 className='text-xl font-bold'>{currentTitle}</h2>
          <p className='text-xs text-muted-foreground'>{currentDesc}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-1'>
        {currentItems.map((item) => {
          const Icon = categoryIcons[item.slug] || Smartphone;
          const hasMore = categories.some((cat) => cat.parentId === item._id);

          return (
            <Card
              key={item._id}
              onClick={() => {
                if (level === 0) handleMainSelect(item);
                else if (level === 1) handleSubSelect(item);
                else handleSubSubSelect(item);
              }}
              className='p-2 cursor-pointer hover:border-popover-foreground/50 hover:shadow-md transition-all group'
            >
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 rounded-xl bg-muted group-hover:bg-popover flex items-center justify-center transition-colors'>
                  <Icon className='w-5 h-5 group-hover:text-primary transition-colors ' />
                </div>

                <div className='flex-1'>
                  <p className='font-semibold'>{item.name}</p>
                </div>

                {hasMore && (
                  <ChevronRight className='w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all' />
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
