'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useMutation } from 'convex/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '../../../convex/_generated/api';
import { CategoryStep } from './steps/category-step';
import { DetailsStep } from './steps/details-step';
import { ImagesStep } from './steps/images-step';
import { ReviewStep } from './steps/review-step';

interface PostListingWizardProps {
  categories: Array<{
    _id: string;
    name: string;
    slug: string;
    template?: any;
  }>;
  userId: string;
}

export interface ListingFormData {
  // Step 1: Category
  category?: string;
  subCategory?: string;
  
  // Step 2: Details
  title?: string;
  description?: string;
  price?: number;
  currency?: string;
  isPriceNegotiable?: boolean;
  condition?: string;
  city?: string;
  region?: string;
  specifications?: Record<string, any>;
  contactPhone?: string;
  contactEmail?: string;
  
  // Step 3: Images
  images?: string[];
  thumbnail?: string;
}

export function PostListingWizard({ categories, userId }: PostListingWizardProps) {
  const t = useTranslations('Sell');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ListingFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientNonce] = useState(() => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));

  const createListing = useMutation(api.listings.create);
  const router = useRouter();

  const steps = [
    { id: 1, name: t('step_category'), description: t('step_category_desc') },
    { id: 2, name: t('step_details'), description: t('step_details_desc') },
    { id: 3, name: t('step_images'), description: t('step_images_desc') },
    { id: 4, name: t('step_review'), description: t('step_review_desc') },
  ];

  const updateFormData = (data: Partial<ListingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!formData.category;
      case 2:
        const hasBasicFields = !!(
          formData.title &&
          formData.description &&
          formData.price &&
          formData.city &&
          formData.contactPhone &&
          formData.contactEmail
        );
        if (!hasBasicFields) return false;
        const selectedCategory = categories.find((c) => c.slug === formData.subCategory) || 
                                categories.find((c) => c.slug === formData.category);
        if (selectedCategory?.template?.fields) {
          const requiredFields = selectedCategory.template.fields.filter((f: any) => f.required);
          const hasAllSpecs = requiredFields.every((field: any) => {
            const val = formData.specifications?.[field.key];
            return val !== undefined && val !== null && val !== '';
          });
          if (!hasAllSpecs) return false;
        }
        return true;
      case 3:
        return formData.images && formData.images.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.price || !formData.category || !formData.city) return;

    setIsSubmitting(true);
    
    try {
      const sanitizedImages = formData.images || [];
      const thumbnail = sanitizedImages[0] || undefined;
      
      const listingData = {
        title: formData.title,
        description: formData.description || '',
        price: formData.price,
        currency: formData.currency || 'MKD',
        isPriceNegotiable: formData.isPriceNegotiable,
        category: formData.category,
        subCategory: formData.subCategory,
        city: formData.city,
        region: formData.region,
        images: sanitizedImages,
        thumbnail: thumbnail,
        userId,
        specifications: formData.specifications,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        clientNonce,
      };

      const listingId = await createListing(listingData);
      import('sonner').then(({ toast }) => toast.success(t('submit_success')));
      router.push(`/listings/${listingId}/success`);
    } catch (error: any) {
      console.error('Error creating listing:', error);
      import('sonner').then(({ toast }) => toast.error(t('submit_failed', { message: error.message || 'Unknown error' })));
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container-wide max-w-4xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{t('page_title')}</h1>
            <span className="text-sm text-muted-foreground">
              {t('step_of', { current: currentStep, total: steps.length })}
            </span>
          </div>
          
          {/* Progress Bar */}
          <Progress value={progress} className="h-2 mb-6" />
          
          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
                      ${
                        currentStep > step.id
                          ? 'bg-primary text-primary-foreground'
                          : currentStep === step.id
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                          : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center hidden sm:block">
                    <p className="text-sm font-medium">{step.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      h-1 flex-1 mx-2 rounded transition-colors
                      ${
                        currentStep > step.id
                          ? 'bg-primary'
                          : 'bg-muted'
                      }
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-6 md:p-8 bg-background">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <CategoryStep
                  categories={categories}
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={nextStep}
                />
              )}
              {currentStep === 2 && (
                <DetailsStep
                  categories={categories}
                  formData={formData}
                  updateFormData={updateFormData}
                  onBack={prevStep}
                />
              )}
              {currentStep === 3 && (
                <ImagesStep
                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}
              {currentStep === 4 && (
                <ReviewStep
                  formData={formData}
                  categories={categories}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('prev')}
          </Button>

          <div className="flex flex-col items-end gap-2">
            {currentStep < steps.length ? (
              <Button
                onClick={() => {
                   if (currentStep === 2 && !canProceed()) {
                     const basicRequired = ['title', 'price', 'city', 'condition', 'contactPhone', 'contactEmail'];
                     for (const field of basicRequired) {
                       // @ts-ignore
                       if (!formData[field]) {
                         const element = document.getElementById(field);
                         if (element) {
                           element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                           element.focus();
                           import('sonner').then(({ toast }) => toast.error(t('fill_field', { field })));
                           return;
                         }
                       }
                     }
                     const selectedCategory = categories.find((c) => c.slug === formData.subCategory) || 
                                             categories.find((c) => c.slug === formData.category);
                     if (selectedCategory?.template?.fields) {
                        const requiredFields = selectedCategory.template.fields.filter((f: any) => f.required);
                        for (const field of requiredFields) {
                            const val = formData.specifications?.[field.key];
                            if (val === undefined || val === null || val === '') {
                                const element = document.getElementById(`spec-${field.key}`);
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    import('sonner').then(({ toast }) => toast.error(t('fill_field', { field: field.label })));
                                    return;
                                }
                            }
                        }
                     }
                     import('sonner').then(({ toast }) => toast.error(t('fill_required')));
                     return;
                   }
                   nextStep();
                }}
                disabled={currentStep !== 2 && !canProceed()}
                className="gap-2"
              >
                {t('next')}
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('submitting')}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {t('submit_for_review')}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
