import { redirect } from 'next/navigation';

// /privacy now lives at /help/terms#privacy
export default function PrivacyPage() {
  redirect('/help/terms#privacy');
}
