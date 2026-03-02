import { AdminSystemAnalyticsClient } from '@/components/admin/admin-system-analytics-client';

import { getLocale } from 'next-intl/server';

export async function generateMetadata() {
  const locale = await getLocale();
  const isMk = locale === 'mk';
  return {
    title: isMk ? 'Системска Аналитика | Админ' : 'Systems Analytics | Admin',
  };
}

export default function AnalyticsPage() {
  return <AdminSystemAnalyticsClient />;
}

