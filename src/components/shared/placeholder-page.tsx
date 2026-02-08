import { Button } from '@/components/ui/button';
import { ArrowLeft, Construction } from 'lucide-react';
import Link from 'next/link';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 animate-pulse">
        <Construction className="h-10 w-10 text-primary" />
      </div>
      <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
        {title}<span className="text-primary">.</span>
      </h1>
      <p className="text-muted-foreground text-lg max-w-md mb-10">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="rounded-full px-8 font-bold">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full px-8 font-bold">
          <Link href="/contact">
            Contact Support
          </Link>
        </Button>
      </div>
    </div>
  );
}
