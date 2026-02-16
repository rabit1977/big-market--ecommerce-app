// app/contact/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ContactContent } from './ContactContent';
import { ContactSkeleton } from './ContactSkeleton';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Biggest Market. We\'re here to help with your listings, business inquiries, and support needs.',
};

const ContactPage = () => {
  return (
    <Suspense fallback={<ContactSkeleton />}>
      <ContactContent />
    </Suspense>
  );
};

export default ContactPage;