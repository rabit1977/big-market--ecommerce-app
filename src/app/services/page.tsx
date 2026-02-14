// app/services/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ServicesContent } from './ServicesContent';
import { ServicesSkeleton } from './ServicesSkeleton';

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    'Discover the range of services Big Market offers, including professional listing management, verified user security, and enterprise growth tools.',
};

const ServicesPage = () => {
  return (
    <Suspense fallback={<ServicesSkeleton />}>
      <ServicesContent />
    </Suspense>
  );
};

export default ServicesPage;
