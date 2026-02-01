'use client';

import { Button } from '@/components/ui/button';
import {
    Facebook,
    Instagram,
    ShieldCheck,
    Users,
    Zap
} from 'lucide-react';
import Link from 'next/link';


interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  label: string;
  color: string;
}

const footerLinks: FooterSection[] = [
  {
    title: 'Big Market',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Marketing', href: '/marketing' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'Sitemap', href: '/sitemap' },
      { label: 'Advertising on Big Market', href: '/advertise' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Register', href: '/auth/signup' },
      { label: 'Verification', href: '/account/verification' },
      { label: 'Safety Tips', href: '/safety' },
      { label: 'Check Balance', href: '/wallet' },
    ]
  },
  {
    title: 'Page',
    links: [
      { label: 'Stores', href: '/stores' },
      { label: 'Premium Ads', href: '/premium' },
      { label: 'Site Map', href: '/sitemap' },
      { label: 'All Listings', href: '/listings' },
    ]
  },
  {
    title: 'Help',
    links: [
      { label: 'Safety Tips', href: '/safety' },
      { label: 'Download Stickers', href: '/stickers' },
      { label: 'Advertise', href: '/advertise' },
      { label: 'FAQ', href: '/faq' },
    ]
  }
];

const socialLinks: SocialLink[] = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:bg-blue-600 hover:text-white' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white' },
];

const features = [
  { icon: Users, label: 'Leaders', description: 'In classifieds market' },
  { icon: ShieldCheck, label: 'Safety', description: 'Verified users' },
  { icon: Zap, label: 'Fast', description: 'Sell items quickly' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t border-border/50 bg-white'>
      {/* Upper Footer: Logo & Tagline */}
      <div className='container-wide py-12'>
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-y-10 gap-x-8'>
          
          {/* Logo & Brand Column */}
          <div className='col-span-2 md:col-span-2 lg:col-span-1'>
            <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Zap className="h-6 w-6 text-white fill-white" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-slate-900 italic uppercase">BIG <span className="text-primary not-italic font-bold">MARKET</span></span>
            </Link>
            
            <div className='space-y-5'>
              {features.map((feature, index) => (
                <div key={index} className='flex items-start gap-3 group'>
                  <div className='mt-1 bg-slate-100 p-1.5 rounded-lg group-hover:bg-primary/10 transition-colors'>
                    <feature.icon className='h-3.5 w-3.5 text-slate-600 group-hover:text-primary' />
                  </div>
                  <div>
                    <div className='text-[13px] font-bold text-slate-900 leading-none'>{feature.label}</div>
                    <div className='text-[11px] text-slate-500 mt-1'>{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Links Columns */}
          {footerLinks.map((section) => (
            <div key={section.title} className='col-span-1'>
              <h3 className='text-[14px] font-bold text-slate-900 mb-5 relative inline-block'>
                {section.title}
                <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-primary/20 rounded-full"></span>
              </h3>
              <ul className='space-y-2.5'>
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className='text-[13px] text-slate-600 hover:text-primary transition-colors hover:translate-x-0.5 inline-block duration-200'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* App Stores & Social Column */}
          <div className='col-span-2 md:col-span-2 lg:col-span-1 space-y-6'>
              <div>
                  <h3 className='text-[14px] font-bold text-slate-900 mb-5 relative inline-block'>
                    Stay Connected
                    <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-primary/20 rounded-full"></span>
                  </h3>
                  <div className='flex flex-col gap-2.5'>
                      <button className="flex items-center gap-3 w-full bg-black hover:bg-black/80 text-white rounded-lg px-4 py-1.5 transition-colors border border-transparent shadow-md hover:shadow-lg">
                          <div className="shrink-0">
                              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M3.609 1.814L13.792 12 3.610 22.186a.996.996 0 01-.1-.12c-.172-.257-.27-.565-.27-.899V2.833c0-.334.098-.642.27-.899.027-.04.062-.081.1-.12zM15.632 13.84l3.125-1.764c.594-.335.594-.881 0-1.216l-3.125-1.764-2.128 2.128 2.128 2.128zM14.246 12.454l1.832-1.832L12.016 8.35c-.443-.25-.852-.25-1.295 0L3.896 12l6.825 3.65c.443.25.852.25 1.295 0l2.23-1.259z"/>
                              </svg>
                          </div>
                          <div className="text-left">
                              <div className="text-[9px] uppercase font-bold text-gray-400 leading-none">Get it on</div>
                              <div className="text-sm font-bold leading-tight">Google Play</div>
                          </div>
                      </button>
                      <button className="flex items-center gap-3 w-full bg-black hover:bg-black/80 text-white rounded-lg px-4 py-1.5 transition-colors border border-transparent shadow-md hover:shadow-lg">
                          <div className="shrink-0">
                              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.31.96-.86 1.91-1.54 2.48-.68.56-1.45.83-2.31.83-1.09 0-2.02-.34-2.79-1.01-.77-.67-1.39-1.01-1.85-1.01-.46 0-1.08.34-1.85 1.01-.77.67-1.7 1.01-2.79 1.01-.86 0-1.63-.27-2.31-.83-.68-.57-1.23-1.52-1.54-2.48-.32-.96-.48-2.01-.48-3.15 0-1.06.26-2.09.77-3.09.51-.99 1.25-1.78 2.22-2.37.97-.57 2.05-.86 3.25-.86.97 0 1.83.25 2.58.74.75.49 1.34.74 1.77.74s1.02-.25 1.77-.74c.75-.49 1.61-.74 2.58-.74 1.2 0 2.28.29 3.25.86.97.58 1.71 1.37 2.22 2.37.51.99.77 2.03.77 3.09 0 1.14-.16 2.19-.48 3.15zM15.5 5.5c0 .76-.28 1.51-.83 2.26-.54.74-1.24 1.27-2.11 1.59-.86.32-1.74.32-2.63 0-.89-.32-1.59-.85-2.11-1.59-.55-.75-.83-1.5-.83-2.26 0-.76.28-1.51.83-2.26.55-.74 1.25-1.27 2.11-1.59.86-.32 1.74-.32 2.63 0 .87.32 1.57.85 2.11 1.59.55.75.83 1.5.83 2.26z"/></svg>
                          </div>
                          <div className="text-left">
                              <div className="text-[9px] uppercase font-bold text-gray-400 leading-none">Download on the</div>
                              <div className="text-sm font-bold leading-tight">App Store</div>
                          </div>
                      </button>
                  </div>

                  <div className='flex gap-2.5 mt-5'>
                    {socialLinks.map((social) => (
                      <Link
                        key={social.label}
                        href={social.href}
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label={social.label}
                      >
                        <Button
                          variant='ghost'
                          size='icon'
                          className={`rounded-full w-9 h-9 border border-border/50 bg-slate-50 hover:border-transparent transition-all duration-300 ${social.color}`}
                        >
                          <social.icon className='h-4 w-4' />
                        </Button>
                      </Link>
                    ))}
                    <Link href="#" aria-label="TikTok">
                      <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 border border-border/50 bg-slate-50 hover:bg-black hover:text-white transition-all">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>
                      </Button>
                    </Link>
                  </div>
              </div>
          </div>
        </div>
      </div>

      {/* Copyright Section (Dark Bar) */}
      <div className='bg-[#333] text-white/70'>
        <div className='container-wide py-4'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-2 text-xs'>
            <p>Copyright &copy; {currentYear} BigMarket.mk</p>
            <div className='flex items-center gap-1'>
                 <Link href="/mobile" className="border px-2 py-0.5 rounded border-white/20 hover:bg-white/10 uppercase font-bold text-[10px]">Mobile Version</Link>
                 <span className="font-bold">Big Market Macedonia</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
