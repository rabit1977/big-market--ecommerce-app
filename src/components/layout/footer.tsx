'use client';

import { usePWAInstall } from '@/hooks/use-pwa-install';
import {
    Facebook,
    Instagram,
    Linkedin,
    ShieldCheck,
    Twitter,
    Users,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// ─── Data Configuration ───────────────────────────────────────────────────────

const FOOTER_LINKS = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact Support', href: '/contact' },
      { label: 'Press & Media', href: '/press' },
    ],
  },
  {
    title: 'Discover',
    links: [
      { label: 'All Listings', href: '/listings' },
      { label: 'Stores', href: '/stores' },
      { label: 'Premium Lite', href: '/premium' },
      { label: 'Search Tags', href: '/tags' },
    ],
  },
  {
    title: 'Business',
    links: [
      { label: 'Advertise with us', href: '/advertise' },
      { label: 'Business Solutions', href: '/business' },
      { label: 'Verification', href: '/verification' },
      { label: 'API Access', href: '/api' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Safety Guidelines', href: '/help/safety' },
      { label: 'Terms of Service', href: '/help/terms' },
      { label: 'Privacy Policy', href: '/help/terms#privacy' },
      { label: 'Cookie Policy', href: '/help/terms#cookies' },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
  }, []);

  const handleAppInstall = () => {
    if (isInstalled) {
      toast.success('App is already installed!');
      return;
    }

    if (isIOS) {
      toast.info('To install: Tap the share button in your browser and select "Add to Home Screen"', {
        duration: 5000,
        position: 'top-center'
      });
      return;
    }

    if (isInstallable) {
      install();
    } else {
      toast.info('To install: Open your browser menu and select "Install App" or "Add to Home Screen"', {
        duration: 5000,
        position: 'top-center'
      });
    }
  };

  return (
    <footer className="mt-auto bg-card/30 pb-12 sm:pb-6 backdrop-blur-sm border-t border-border/40">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Top Section: Brand & App */}
        <div className="flex flex-col lg:flex-row justify-between gap-8 py-12">
          
          {/* Brand */}
          <div className="lg:w-1/3 space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                <Zap className="h-5 w-5 text-primary scale-100 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-lg font-black tracking-tighter text-foreground italic uppercase">
                BIG <span className="text-primary not-italic font-bold">MARKET</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
              Macedonia&apos;s leading classifieds hosting platform. Connecting buyers and sellers in a secure and professional ecosystem.
            </p>
            
            {/* Trust Badges */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 group cursor-default">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold text-foreground uppercase tracking-wide">Verified Users</span>
              </div>
              <div className="flex items-center gap-1.5 group cursor-default">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] font-bold text-foreground uppercase tracking-wide">Community</span>
              </div>
            </div>
          </div>

          {/* App Buttons */}
          <div className="flex flex-row gap-3 items-start lg:items-center">
            <AppStoreButton onClick={handleAppInstall} />
            <GooglePlayButton onClick={handleAppInstall} />
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-border/40">
          {FOOTER_LINKS.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h3 className="font-black text-[10px] uppercase tracking-widest text-foreground/70">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-xs font-medium text-muted-foreground hover:text-primary transition-all duration-200 hover:pl-1 block w-fit"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/40 pt-6 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            {/* suppressHydrationWarning is safe here for dates */}
            <p suppressHydrationWarning>&copy; {currentYear} Biggest Market. All rights reserved.</p>
            <div className="hidden md:block w-0.5 h-0.5 rounded-full bg-border" />
            <div className="flex gap-4">
              <Link href="/help/terms#privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/help/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="/sitemap" className="hover:text-foreground transition-colors">Sitemap</Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary p-2 rounded-full transition-all duration-300 hover:scale-105"
                aria-label={social.label}
              >
                <social.icon className="w-3.5 h-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Sub-Components (Static) ──────────────────────────────────────────────────

function AppStoreButton({ onClick }: { onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 rounded-lg px-3 py-2 min-w-[130px] group shadow-sm hover:shadow-md border border-foreground/10"
    >
      <svg className="h-5 w-5 fill-current group-hover:scale-105 transition-transform duration-300" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.31.96-.86 1.91-1.54 2.48-.68.56-1.45.83-2.31.83-1.09 0-2.02-.34-2.79-1.01-.77-.67-1.39-1.01-1.85-1.01-.46 0-1.08.34-1.85 1.01-.77.67-1.7 1.01-2.79 1.01-.86 0-1.63-.27-2.31-.83-.68-.57-1.23-1.52-1.54-2.48-.32-.96-.48-2.01-.48-3.15 0-1.06.26-2.09.77-3.09.51-.99 1.25-1.78 2.22-2.37.97-.57 2.05-.86 3.25-.86.97 0 1.83.25 2.58.74.75.49 1.34.74 1.77.74s1.02-.25 1.77-.74c.75-.49 1.61-.74 2.58-.74 1.2 0 2.28.29 3.25.86.97.58 1.71 1.37 2.22 2.37.51.99.77 2.03.77 3.09 0 1.14-.16 2.19-.48 3.15zM15.5 5.5c0 .76-.28 1.51-.83 2.26-.54.74-1.24 1.27-2.11 1.59-.86.32-1.74.32-2.63 0-.89-.32-1.59-.85-2.11-1.59-.55-.75-.83-1.5-.83-2.26 0-.76.28-1.51.83-2.26.55-.74 1.25-1.27 2.11-1.59.86-.32 1.74-.32 2.63 0 .87.32 1.57.85 2.11 1.59.55.75.83 1.5.83 2.26z" />
      </svg>
      <div className="text-left">
        <div className="text-[8px] font-bold opacity-70 uppercase tracking-wider leading-none mb-0.5 text-background/80">Download on</div>
        <div className="text-[10px] font-black leading-none tracking-wide text-background">App Store</div>
      </div>
    </button>
  );
}

function GooglePlayButton({ onClick }: { onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 bg-card hover:bg-muted text-foreground border border-border transition-all duration-300 rounded-lg px-3 py-2 min-w-[130px] group shadow-sm hover:shadow-md"
    >
      <svg className="h-5 w-5 fill-current group-hover:scale-105 transition-transform duration-300" viewBox="0 0 24 24">
        <path d="M3.609 1.814L13.792 12 3.610 22.186a.996.996 0 01-.1-.12c-.172-.257-.27-.565-.27-.899V2.833c0-.334.098-.642.27-.899.027-.04.062-.081.1-.12zM15.632 13.84l3.125-1.764c.594-.335.594-.881 0-1.216l-3.125-1.764-2.128 2.128 2.128 2.128zM14.246 12.454l1.832-1.832L12.016 8.35c-.443-.25-.852-.25-1.295 0L3.896 12l6.825 3.65c.443.25.852.25 1.295 0l2.23-1.259z" />
      </svg>
      <div className="text-left">
        <div className="text-[8px] font-bold opacity-60 uppercase tracking-wider leading-none mb-0.5">Get it on</div>
        <div className="text-[10px] font-black leading-none tracking-wide">Google Play</div>
      </div>
    </button>
  );
}