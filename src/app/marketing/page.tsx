import { redirect } from 'next/navigation';

// /marketing is superseded by /advertise
export default function MarketingPage() {
  redirect('/advertise');
}
