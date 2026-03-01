import { SavedSearchesClient } from '@/components/listing/saved-searches-client';
import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { getTranslations } from 'next-intl/server';

export const metadata = {
  title: 'Saved Searches & Alerts - Biggest Market',
};

export default async function SavedSearchesPage() {
  const t = await getTranslations('SavedSearches');
  return (
    <div className='container max-w-5xl mx-auto pt-4 md:pt-8 min-h-screen pb-20 bg-background px-4'>
      <AppBreadcrumbs className="mb-6 md:mb-8" items={[
        { label: t('dashboard_label'), href: '/my-listings' },
        { label: t('title') }
      ]} />
      
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8 border-b border-border pb-4 md:pb-6'>
        <div>
           <h2 className='text-2xl md:text-3xl font-black tracking-tight text-foreground uppercase leading-none'>{t('title')}</h2>
           <div className="h-1 w-12 bg-primary rounded-full mt-2 mb-2" />
           <p className='text-muted-foreground text-xs md:text-sm font-bold uppercase tracking-wider'>{t('subtitle')}</p>
        </div>
      </div>

      <SavedSearchesClient />
    </div>
  );
}
