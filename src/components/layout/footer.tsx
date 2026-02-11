'use client';

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

export function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className='border-t border-border/40 bg-card/30 pt-16 pb-8 backdrop-blur-sm'>
      <div className='container mx-auto px-4 max-w-7xl'>
        
        {/* Top Section: Brand & App */}
        <div className='flex flex-col lg:flex-row justify-between gap-12 mb-16'>
            {/* Brand */}
            <div className='lg:w-1/3 space-y-6'>
                <Link href="/" className="flex items-center gap-2 group w-fit">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                        <Zap className="h-6 w-6 text-primary scale-100 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-foreground italic uppercase">BIG <span className="text-primary not-italic font-bold">MARKET</span></span>
                </Link>
                <p className='text-muted-foreground text-sm leading-relaxed max-w-xs'>
                    The safest and fastest growing marketplace in Macedonia. Buy and sell directly with confidence.
                </p>
                
                {/* Trust Badges */}
                <div className='flex items-center gap-6 pt-2'>
                    <div className='flex items-center gap-2 group cursor-default'>
                        <ShieldCheck className='w-5 h-5 text-emerald-500 transition-transform duration-300 group-hover:scale-110' />
                        <span className='text-xs font-bold text-foreground'>Verified Users</span>
                    </div>
                    <div className='flex items-center gap-2 group cursor-default'>
                        <Users className='w-5 h-5 text-blue-500 transition-transform duration-300 group-hover:scale-110' />
                        <span className='text-xs font-bold text-foreground'>Community First</span>
                    </div>
                </div>
            </div>

            {/* App Download Buttons - Enterprise Style */}
            <div className='lg:w-auto flex flex-col sm:flex-row gap-3 items-start lg:items-center'>
                <button className="flex items-center gap-3 bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 rounded-xl px-4 py-3 min-w-[160px] group shadow-sm hover:shadow-md border border-foreground/10">
                    <svg className="h-6 w-6 fill-current group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24"><path d="M18.71 19.5c-.31.96-.86 1.91-1.54 2.48-.68.56-1.45.83-2.31.83-1.09 0-2.02-.34-2.79-1.01-.77-.67-1.39-1.01-1.85-1.01-.46 0-1.08.34-1.85 1.01-.77.67-1.7 1.01-2.79 1.01-.86 0-1.63-.27-2.31-.83-.68-.57-1.23-1.52-1.54-2.48-.32-.96-.48-2.01-.48-3.15 0-1.06.26-2.09.77-3.09.51-.99 1.25-1.78 2.22-2.37.97-.57 2.05-.86 3.25-.86.97 0 1.83.25 2.58.74.75.49 1.34.74 1.77.74s1.02-.25 1.77-.74c.75-.49 1.61-.74 2.58-.74 1.2 0 2.28.29 3.25.86.97.58 1.71 1.37 2.22 2.37.51.99.77 2.03.77 3.09 0 1.14-.16 2.19-.48 3.15zM15.5 5.5c0 .76-.28 1.51-.83 2.26-.54.74-1.24 1.27-2.11 1.59-.86.32-1.74.32-2.63 0-.89-.32-1.59-.85-2.11-1.59-.55-.75-.83-1.5-.83-2.26 0-.76.28-1.51.83-2.26.55-.74 1.25-1.27 2.11-1.59.86-.32 1.74-.32 2.63 0 .87.32 1.57.85 2.11 1.59.55.75.83 1.5.83 2.26z"/></svg>
                    <div className="text-left">
                        <div className="text-[9px] font-bold opacity-70 uppercase tracking-wider leading-none mb-1 text-background/80">Download on</div>
                        <div className="text-xs font-black leading-none tracking-wide text-background">App Store</div>
                    </div>
                </button>
                <button className="flex items-center gap-3 bg-card hover:bg-muted text-foreground border border-border transition-all duration-300 rounded-xl px-4 py-3 min-w-[160px] group shadow-sm hover:shadow-md">
                    <svg className="h-6 w-6 fill-current group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24"><path d="M3.609 1.814L13.792 12 3.610 22.186a.996.996 0 01-.1-.12c-.172-.257-.27-.565-.27-.899V2.833c0-.334.098-.642.27-.899.027-.04.062-.081.1-.12zM15.632 13.84l3.125-1.764c.594-.335.594-.881 0-1.216l-3.125-1.764-2.128 2.128 2.128 2.128zM14.246 12.454l1.832-1.832L12.016 8.35c-.443-.25-.852-.25-1.295 0L3.896 12l6.825 3.65c.443.25.852.25 1.295 0l2.23-1.259z"/></svg>
                    <div className="text-left">
                        <div className="text-[9px] font-bold opacity-60 uppercase tracking-wider leading-none mb-1">Get it on</div>
                        <div className="text-xs font-black leading-none tracking-wide">Google Play</div>
                    </div>
                </button>
            </div>
        </div>

        {/* Links Grid */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 border-t border-border/40 pt-12 mb-12'>
            <div className='flex flex-col gap-5'>
                <h3 className='font-black text-xs uppercase tracking-widest text-foreground/80'>Company</h3>
                <ul className='space-y-3.5'>
                    <li><Link href="/about" className='text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 block w-fit'>About Us</Link></li>
                    <li><Link href="/careers" className='text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 block w-fit'>Careers</Link></li>
                    <li><Link href="/contact" className='text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 block w-fit'>Contact Support</Link></li>
                    <li><Link href="/press" className='text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 block w-fit'>Press & Media</Link></li>
                </ul>
            </div>
            
            <div className='flex flex-col gap-5'>
                <h3 className='font-black text-xs uppercase tracking-widest text-foreground/80'>Discover</h3>
                <ul className='space-y-3.5'>
                    <li><Link href="/listings" className='text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 block w-fit'>All Listings</Link></li>
                    <li><Link href="/stores" className='text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 block w-fit'>Stores</Link></li>
                    <li><Link href="/premium" className='text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 block w-fit'>Premium Lite</Link></li>
                    <li><Link href="/tags" className='text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 block w-fit'>Search Tags</Link></li>
                </ul>
            </div>

            <div className='flex flex-col gap-5'>
                <h3 className='font-black text-xs uppercase tracking-widest text-foreground/80'>Business</h3>
                <ul className='space-y-3.5'>
                    <li><Link href="/advertise" className='text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 block w-fit'>Advertise with us</Link></li>
                    <li><Link href="/business" className='text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 block w-fit'>Business Solutions</Link></li>
                    <li><Link href="/verification" className='text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 block w-fit'>Verification</Link></li>
                    <li><Link href="/api" className='text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 block w-fit'>API Access</Link></li>
                </ul>
            </div>

            <div className='flex flex-col gap-5'>
                <h3 className='font-black text-xs uppercase tracking-widest text-foreground/80'>Legal</h3>
                <ul className='space-y-3.5'>
                    <li><Link href="/safety" className='text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 block w-fit'>Safety Guidelines</Link></li>
                    <li><Link href="/terms" className='text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 block w-fit'>Terms of Service</Link></li>
                    <li><Link href="/privacy" className='text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 block w-fit'>Privacy Policy</Link></li>
                    <li><Link href="/cookies" className='text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 block w-fit'>Cookie Policy</Link></li>
                </ul>
            </div>
        </div>

        {/* Bottom Section: Copyright & Social */}
        <div className='border-t border-border/40 pt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-6'>
            <div className='flex flex-col md:flex-row items-center gap-4 text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider'>
                <p>&copy; {currentYear} Big Market. All rights reserved.</p>
                <div className="hidden md:block w-1 h-1 rounded-full bg-border" />
                <div className='flex gap-4'>
                    <Link href="/privacy" className="hover:text-foreground transition-colors duration-300">Privacy</Link>
                    <Link href="/terms" className="hover:text-foreground transition-colors duration-300">Terms</Link>
                    <Link href="/sitemap" className="hover:text-foreground transition-colors duration-300">Sitemap</Link>
                </div>
            </div>

            <div className='flex items-center gap-3'>
                {[
                  { icon: Facebook, href: '#', label: 'Facebook' },
                  { icon: Instagram, href: '#', label: 'Instagram' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                ].map((social) => (
                    <Link
                        key={social.label}
                        href={social.href}
                        className='bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary p-2.5 rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-0.5'
                        aria-label={social.label}
                    >
                        <social.icon className='w-4 h-4' />
                    </Link>
                ))}
            </div>
        </div>
      </div>
    </footer>
  );
}
