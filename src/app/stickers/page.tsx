import { redirect } from 'next/navigation';

// /stickers has no purpose for a classifieds platform — redirect to about
export default function StickersPage() {
  redirect('/about');
}
