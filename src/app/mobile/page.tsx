import { redirect } from 'next/navigation';

// /mobile placeholder — the site IS the mobile experience (PWA)
export default function MobilePage() {
  redirect('/');
}
