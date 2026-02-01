'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation } from 'convex/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../../convex/_generated/api';

export default function SeedCategoriesPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const seedCategories = useMutation(api.seedEnhanced.seedEnhancedCategories);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const result = await seedCategories();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error('Failed to seed categories');
      }
    } catch (error) {
      console.error('Error seeding categories:', error);
      toast.error('An error occurred while seeding categories');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Seed Categories</CardTitle>
          <CardDescription>
            This will populate your database with comprehensive categories and detailed templates for each category type.
            <br /><br />
            <strong>Categories included:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Real Estate (Flats, Houses, Land, Commercial)</li>
              <li>Vehicles (Cars, Motorcycles, Trucks, Boats)</li>
              <li>Electronics (Phones, Computers, Tablets, TVs, Cameras)</li>
              <li>Jobs (Full Time, Part Time, Freelance, Internships)</li>
              <li>Services (Home, Business, Personal)</li>
              <li>Fashion (Men's, Women's, Shoes, Accessories)</li>
              <li>Home & Garden (Furniture, Appliances, Decor, Outdoor)</li>
              <li>Sports & Leisure (Equipment, Bicycles, Gym)</li>
              <li>Pets (Dogs, Cats, Accessories)</li>
              <li>Education (Tutoring, Courses)</li>
            </ul>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleSeed} 
            disabled={isSeeding}
            size="lg"
            className="w-full"
          >
            {isSeeding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Seeding Categories...
              </>
            ) : (
              'Seed Categories Now'
            )}
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            Note: This operation is safe to run multiple times. It will update existing categories without creating duplicates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
