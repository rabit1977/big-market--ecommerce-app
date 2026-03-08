import { SellersGrid } from '@/components/store/sellers-grid';
import { SellersPageHeader } from '@/components/store/sellers-page-header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sellers Directory | PazarPlus',
  description:
    'Browse all verified sellers and premium storefronts on PazarPlus',
};

export default function StorePage() {
  return (
    <div className='min-h-screen pt-4 md:pt-6 pb-12 bg-muted/10'>
      <div className='container-wide mx-auto px-3 md:px-4'>
        <SellersPageHeader />
        <SellersGrid />
      </div>
    </div>
  );
}
