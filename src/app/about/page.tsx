// app/about/page.tsx
import { AboutContent } from './AboutContent';

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AboutSkeleton } from './AboutSkeleton';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    "Learn about Big Market's story, our values, and the mission to build Macedonia's leading digital marketplace.",
};

const AboutPage = () => {
  return (
    <div className='bg-background min-h-screen'>
      <div className='container mx-auto px-4 py-12 sm:py-16 lg:py-20 max-w-6xl'>
        <Suspense fallback={<AboutSkeleton />}>
          <AboutContent />
        </Suspense>
      </div>
    </div>
  );
};

export default AboutPage;