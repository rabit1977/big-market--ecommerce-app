'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useMutation } from 'convex/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
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

const steps = [
  { id: 1, name: 'Category', description: 'Choose a category' },
  { id: 2, name: 'Details', description: 'Add listing details' },
  { id: 3, name: 'Images', description: 'Upload photos' },
  { id: 4, name: 'Review', description: 'Review & publish' },
];

export function PostListingWizard({ categories, userId }: PostListingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ListingFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createListing = useMutation(api.listings.create);

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
        // Basic fields
        const hasBasicFields = !!(
          formData.title &&
          formData.description &&
          formData.price &&
          formData.city &&
          formData.contactPhone &&
          formData.contactEmail
        );

        if (!hasBasicFields) return false;

        // Check required specification fields from category template
        const selectedCategory = categories.find((c) => c.slug === formData.subCategory) || 
                               categories.find((c) => c.slug === formData.category);
        
        if (selectedCategory?.template?.fields) {
          const requiredFields = selectedCategory.template.fields.filter((f: any) => f.required);
          const hasAllSpecs = requiredFields.every((field: any) => {
            const val = formData.specifications?.[field.key];
             // Check if value is defined and not an empty string (if it's a string)
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
      // Sanitize images: If stored as Base64/DataURL and too large, replace with placeholder
      // Convex has a 1MB limit for documents. Large Base64 strings will fail.
      // In a real generic file upload implementation, you'd upload to a storage bucket and store the URL.
      const sanitizedImages = (formData.images || []).map(img => 
        (img.startsWith('data:') && img.length > 800000) 
            ? "https://placehold.co/600x400?text=Image+Too+Large" 
            : img
      );
      
      const thumbnail = sanitizedImages[0] || undefined;

      // Prepare listing data
      const listingData = {
        title: formData.title,
        description: formData.description || '',
        price: formData.price,
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
      };

      // Submit to Convex
      await createListing(listingData);
      
      // Redirect to success page or listing
      window.location.href = '/listings';
    } catch (error: any) {
      console.error('Error creating listing:', error);
      // Show specific error message to user
      alert(`Failed to create listing: ${error.message || 'Unknown error'}`);
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
            <h1 className="text-3xl font-bold">Post a Listing</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
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
        <Card className="p-6 md:p-8">
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
            Previous
          </Button>

          <div className="flex flex-col items-end gap-2">
            {currentStep < steps.length ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="gap-2"
              >
                Next
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
                    Publishing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Publish Listing
                  </>
                )}
              </Button>
            )}
            
            {!canProceed() && (
              <p className="text-sm text-destructive font-medium animate-in fade-in slide-in-from-top-1">
                Please fill in all required fields
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
