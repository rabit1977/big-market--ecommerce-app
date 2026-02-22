'use client';

import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowRight,
    Ban,
    Globe,
    Info,
    Key,
    LayoutList,
    Lock,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    ShieldCheck,
    UserCircle
} from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <section className="bg-muted/30 border-b border-border/50 py-12 md:py-20 relative overflow-hidden">
                <div className="container-wide relative z-10">
                    <AppBreadcrumbs className="mb-6" />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl"
                    >
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
                            Terms &amp; <span className="text-primary">Conditions</span>
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                            Read our updated policies on privacy, registration, and platform usage rules.
                        </p>
                        <div className="flex gap-4 mt-8">
                            <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold">
                                Updated: 05.01.2026
                            </div>
                            <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-bold">
                                Version 2.4
                            </div>
                        </div>
                    </motion.div>
                </div>
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
            </section>

            <div className="container-wide py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        
                        <div className="bg-white dark:bg-muted/20 rounded-[2.5rem] border border-border/50 overflow-hidden shadow-xl shadow-primary/5">
                            <Accordion type="single" collapsible className="w-full">
                                
                                {/* ── Marketplace Disclaimer ── */}
                                <AccordionItem value="disclaimer" id="disclaimer" className="border-b border-border/50 px-6 md:px-10">
                                    <AccordionTrigger className="hover:no-underline py-8 text-left group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <AlertCircle className="w-6 h-6 text-orange-600" />
                                            </div>
                                            <div>
                                                <div className="font-black text-xl">Marketplace Disclaimer</div>
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Platform Role &amp; Seller Responsibility</div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                                        <div className="space-y-6">
                                            <div className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/20">
                                                <p className="font-bold text-orange-700 dark:text-orange-400 mb-3">Biggest Market is a classifieds hosting platform — not a party to any transaction.</p>
                                                <p className="text-sm">We provide the technology and infrastructure for individuals and businesses to publish, manage, and promote their listings. We do not own, sell, inspect, or ship any of the items or services advertised on this platform.</p>
                                            </div>

                                            <p><strong>Seller Responsibility:</strong> Each seller is solely and fully responsible for the accuracy, legality, condition, and safety of the items or services they list. Sellers must ensure their listings are truthful, not misleading, and comply with all applicable laws and these Terms of Service.</p>

                                            <p><strong>Buyer Due Diligence:</strong> Buyers must exercise independent judgment before completing any transaction. We strongly recommend inspecting items in person, verifying the seller's identity and verified badge status, and meeting in a public place for exchanges. Biggest Market cannot guarantee the quality, safety, or authenticity of any item listed on this platform.</p>

                                            <p><strong>No Liability for Transactions:</strong> Biggest Market is not liable for any loss, damage, fraud, or dispute arising from transactions between buyers and sellers. All communications via message, contact form, or email are solely between the respective parties.</p>

                                            <p><strong>Dispute Resolution:</strong> If a dispute arises between a buyer and seller, Biggest Market may assist with information where possible, but cannot act as a mediator or enforce any outcome. Users are encouraged to resolve disputes directly or through appropriate legal channels.</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="privacy" id="privacy" className="border-b border-border/50 px-6 md:px-10">
                                    <AccordionTrigger className="hover:no-underline py-8 text-left group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <ShieldCheck className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-black text-xl">Privacy Policy</div>
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Privacy &amp; Data Protection</div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                                        <div className="space-y-6">
                                            <p>The protection and security of your personal data is a top priority at Biggest Market. We dedicate special attention to the privacy and integrity of our users' information, applying the highest security standards.</p>
                                            
                                            <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                                                <p className="font-bold text-foreground mb-3 text-sm uppercase tracking-wide">Data we collect:</p>
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Full Name
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Email Address
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Contact Phone Number
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Location
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Listing Data
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> IP Address
                                                    </li>
                                                </ul>
                                            </div>

                                            <p>Your personal data is used exclusively to provide and improve our services. Personal data will not be disclosed to third parties without your consent. Processing your data for any other purpose may only occur based on your prior written consent.</p>
                                            
                                            <p>Payments made by card are transmitted over the internet using SSL (Secure Socket Layer) encryption to ensure security.</p>
                                            
                                            <p>In accordance with the Law on Personal Data Protection, this information will be archived in our company for no longer than one year after your account is closed, after which it will be permanently deleted.</p>
                                            
                                            <p className="text-sm italic">For more information, visit the website of the Directorate for Personal Data Protection at <a href="https://dzlp.mk" target="_blank" className="text-primary hover:underline">dzlp.mk</a>.</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="registration" id="registration" className="border-b border-border/50 px-6 md:px-10">
                                    <AccordionTrigger className="hover:no-underline py-8 text-left group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <UserCircle className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <div className="font-black text-xl">Registration &amp; Verification</div>
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Registration &amp; Terms</div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                                        <div className="space-y-6">
                                            <p>To access the full professional services of Biggest Market, a valid registration is required. Our platform guarantees 90% annual uptime, supported by continuous technical maintenance and system upgrades.</p>
                                            
                                            <div className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10">
                                                <h4 className="font-black text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
                                                    <Info className="w-5 h-5" /> Profile Verification
                                                </h4>
                                                <p className="mb-4">For security reasons, profile verification is mandatory. All unverified profiles will be deleted.</p>
                                                <ul className="space-y-3 font-bold text-emerald-800 dark:text-emerald-300">
                                                    <li className="flex gap-2">
                                                        <ArrowRight className="w-4 h-4 shrink-0 mt-1" /> You can post and edit listings for free for 1 year.
                                                    </li>
                                                    <li className="flex gap-2">
                                                        <ArrowRight className="w-4 h-4 shrink-0 mt-1" /> Manage up to 50 listings per year.
                                                    </li>
                                                    <li className="flex gap-2 text-primary">
                                                        <ArrowRight className="w-4 h-4 shrink-0 mt-1" /> Price: 98 MKD + VAT (116 MKD) for 1 year.
                                                    </li>
                                                </ul>
                                            </div>
                                            
                                            <p>Payment can be made via bank transfer or debit/credit card. To use the service in full, clients must have a modern browser with JavaScript, Cookies, and Pop-ups enabled.</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="auth-tech" id="auth-tech" className="border-b border-border/50 px-6 md:px-10">
                                    <AccordionTrigger className="hover:no-underline py-8 text-left group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Globe className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <div className="font-black text-xl">Social Networks &amp; Technology</div>
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Social Login &amp; Tech Integration</div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                                        <div className="space-y-6">
                                            <p><strong>Social Login (Google, Facebook, Apple):</strong> Used for simplified and secure authentication. The transferred data (name, email, and UID) is used exclusively for login and identification purposes.</p>
                                            
                                            <p><strong>Video Integration:</strong> By activating the consent checkbox, you allow content to be loaded from YouTube, TikTok, Facebook, and Instagram. Your IP address is transmitted to the respective providers.</p>
                                            
                                            <p><strong>Maps:</strong> We use OpenStreetMap (Leaflet) and Google Maps. Your IP address may be transmitted to their servers for displaying map data. You can disable maps if you do not wish to transfer this data.</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="cookies" id="cookies" className="border-b border-border/50 px-6 md:px-10">
                                    <AccordionTrigger className="hover:no-underline py-8 text-left group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Lock className="w-6 h-6 text-amber-600" />
                                            </div>
                                            <div>
                                                <div className="font-black text-xl">Cookie Policy</div>
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Tracking &amp; Browser Storage</div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                                        <div className="space-y-6">
                                            <p>We use cookies to optimize our services and ensure the platform functions correctly. Cookies are small text files stored on your computer.</p>
                                            <p>They are categorized by function: essential, performance, functional, advertising, and session cookies. The collected information is anonymous. You can disable them in your browser settings, but some features may become unavailable as a result.</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                
                                <AccordionItem value="ads" id="ads" className="border-b border-border/50 px-6 md:px-10">
                                    <AccordionTrigger className="hover:no-underline py-8 text-left group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <LayoutList className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-black text-xl">Posting &amp; Managing Listings</div>
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Posting &amp; Managing Ads</div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                                        <div className="space-y-6">
                                            <p><strong>Posting Listings:</strong> Biggest Market offers a professional environment for commercial and private listings. By posting, the user guarantees that all information (title, description, price) is accurate, truthful, and not misleading.</p>
                                            
                                            <p><strong>Content Quality:</strong> To maintain our high standards, all listings must contain real, high-quality photographs. The platform reserves the right to remove content taken from third parties without permission or that is of poor quality.</p>
                                            
                                            <p><strong>Duration &amp; Renewal:</strong> Listings have a predefined expiry date. Users are responsible for timely updates to the availability of the item or service. Promoted listings receive priority status for a period of <strong>14 days</strong>.</p>
                                            
                                            <p><strong>Fair-Play Policy:</strong> Duplicate listings for the same item in different categories or locations are strictly prohibited. Systematic violation of this rule leads to automatic account suspension.</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="prohibited" id="prohibited" className="border-b border-border/50 px-6 md:px-10">
                                    <AccordionTrigger className="hover:no-underline py-8 text-left group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Ban className="w-6 h-6 text-red-600" />
                                            </div>
                                            <div>
                                                <div className="font-black text-xl">Prohibited Content &amp; Items</div>
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Prohibited Items &amp; Content</div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                                        <div className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <h4 className="font-black text-red-600 uppercase text-xs tracking-widest">Prohibited Content:</h4>
                                                    <ul className="space-y-2 text-sm">
                                                        <li>• Advertising other websites</li>
                                                        <li>• Misleading job offers</li>
                                                        <li>• Gambling and betting</li>
                                                        <li>• Loans and securities</li>
                                                        <li>• Offensive and racist content</li>
                                                        <li>• Pornography and prostitution</li>
                                                        <li>• Listings in a foreign language without a translation</li>
                                                    </ul>
                                                </div>
                                                <div className="space-y-4">
                                                    <h4 className="font-black text-red-600 uppercase text-xs tracking-widest">Prohibited Items:</h4>
                                                    <ul className="space-y-2 text-sm">
                                                        <li>• Stolen or counterfeit items</li>
                                                        <li>• Prescription drugs and narcotics</li>
                                                        <li>• Radioactive and explosive materials</li>
                                                        <li>• Human organs and bodily fluids</li>
                                                        <li>• Weapons and ammunition</li>
                                                        <li>• Official uniforms and passports</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-sm font-bold text-red-700">
                                                Each listing may only be posted once in a single location. Duplicate listings and spamming will not be tolerated.
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="marketing" id="marketing" className="border-b border-border/50 px-6 md:px-10">
                                    <AccordionTrigger className="hover:no-underline py-8 text-left group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <MessageSquare className="w-6 h-6 text-indigo-600" />
                                            </div>
                                            <div>
                                                <div className="font-black text-xl">Communication &amp; Marketing</div>
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Viber, WhatsApp &amp; Marketing</div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                                        <div className="space-y-6">
                                            <p><strong>Direct Marketing:</strong> Biggest Market uses your data for marketing purposes only with your prior consent. Every communication (Email, SMS, Viber, WhatsApp) includes an opt-out option. After withdrawal, your data will be removed from our active database within <strong>14 days</strong>.</p>
                                            
                                            <p><strong>Viber &amp; WhatsApp:</strong> Our platform enables direct connection with providers, but we have no access to your private content. To stop communications, simply send a message with the text <strong>"STOP"</strong>.</p>
                                            
                                            <p><strong>Anti-Spam Policy:</strong> Generating mass listings or irrelevant content is strictly forbidden. If you suspect any abuse, contact our center at support@bigmarket.mk.</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="security" id="security" className="border-b border-border/50 px-6 md:px-10">
                                    <AccordionTrigger className="hover:no-underline py-8 text-left group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Key className="w-6 h-6 text-slate-600" />
                                            </div>
                                            <div>
                                                <div className="font-black text-xl">Security &amp; Responsibility</div>
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Passwords &amp; Usage Terms</div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                                        <div className="space-y-6">
                                            <p><strong>Account Security:</strong> Responsibility for your password and access lies with you. Biggest Market recommends using complex passwords and changing them regularly for maximum protection.</p>
                                            <p><strong>Age Regulation:</strong> The platform is intended exclusively for adults (18+ years old).</p>
                                            <p><strong>Suspension:</strong> Biggest Market reserves the right to restrict or terminate access for any user who does not comply with the defined ethical and legal norms of the platform.</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="legal" id="legal" className="border-none px-6 md:px-10">
                                    <AccordionTrigger className="hover:no-underline py-8 text-left group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-800/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <AlertCircle className="w-6 h-6 text-slate-800" />
                                            </div>
                                            <div>
                                                <div className="font-black text-xl">Legal Notice &amp; Contact</div>
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Company Details &amp; Jurisdiction</div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                                        <div className="space-y-8">
                                            <p>The privacy policy and general terms and conditions of Biggest Market are subject to periodic changes in order to improve our services. By using these services, the user confirms their agreement with the current version of this document.</p>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border/50">
                                                <div className="space-y-4">
                                                    <h5 className="font-black text-xs uppercase tracking-widest text-primary">Company:</h5>
                                                    <p className="font-bold">Biggest Market</p>
                                                    <div className="flex gap-2 text-sm">
                                                        <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                                                        <span>6333 Radolishta, Struga, Macedonia</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <h5 className="font-black text-xs uppercase tracking-widest text-primary">Contact:</h5>
                                                    <div className="flex gap-2 text-sm">
                                                        <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                                                        <span>support@bigmarket.mk</span>
                                                    </div>
                                                    <div className="flex gap-2 text-sm">
                                                        <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                                                        <span>Contact via form</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        {/* Direct Contact Form */}
                        <section id="contact" className="p-8 md:p-12 rounded-[2.5rem] bg-background border border-border/50 shadow-2xl shadow-primary/5">
                            <h2 className="text-3xl font-black mb-8">Contact Us</h2>
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black px-1">Your Name</label>
                                    <input type="text" className="w-full rounded-2xl border border-border bg-muted/20 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black px-1">Your Email</label>
                                    <input type="email" className="w-full rounded-2xl border border-border bg-muted/20 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black px-1">Subject</label>
                                    <select className="w-full rounded-2xl border border-border bg-muted/20 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold appearance-none">
                                        <option>General Enquiry</option>
                                        <option>Technical Support</option>
                                        <option>Report Abuse</option>
                                        <option>Marketing</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black px-1">Your Phone</label>
                                    <input type="tel" className="w-full rounded-2xl border border-border bg-muted/20 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-black px-1">Message</label>
                                    <textarea rows={6} className="w-full rounded-2xl border border-border bg-muted/20 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-bold"></textarea>
                                </div>
                                <div className="md:col-span-2 space-y-8">
                                    <div className="flex items-center gap-4 p-6 rounded-2xl bg-primary/5 border border-primary/10 w-fit">
                                        <span className="font-black text-base text-primary/80">Security Check: <span className="text-primary text-xl tracking-widest">15 + 7 = ?</span></span>
                                        <input type="text" className="w-24 rounded-xl border border-border bg-background px-4 py-3 text-center font-black text-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                    </div>
                                    <Button className="w-full md:w-auto px-16 py-8 rounded-2xl font-black text-xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-gradient-to-r from-primary to-blue-600">
                                        Send Message
                                    </Button>
                                </div>
                            </form>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="sticky top-24">
                            <div className="p-8 rounded-[2rem] bg-slate-900 text-white shadow-2xl">
                                <h3 className="text-2xl font-black mb-6">Quick Tools</h3>
                                <div className="space-y-4">
                                    <Button className="w-full justify-start h-14 rounded-xl font-bold bg-white/10 hover:bg-white/20 border-white/10" asChild>
                                        <Link href="/help">
                                            <Info className="w-5 h-5 mr-3" />
                                            Help Center
                                        </Link>
                                    </Button>
                                    <Button className="w-full justify-start h-14 rounded-xl font-bold bg-white/10 hover:bg-white/20 border-white/10" asChild>
                                        <Link href="/help/payments">
                                            <ArrowRight className="w-5 h-5 mr-3" />
                                            Payments Info
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start h-14 rounded-xl font-bold border-white/20 text-white hover:bg-white/5" asChild>
                                        <Link href="#contact">
                                            <Mail className="w-5 h-5 mr-3" />
                                            Support Inquiry
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="mt-8 p-8 rounded-[2rem] bg-muted/30 border border-border/50 text-center">
                                <h4 className="font-black text-lg mb-2">Documentation PDF</h4>
                                <p className="text-xs text-muted-foreground mb-6">Download a copy of our terms for your records.</p>
                                <Button variant="outline" className="w-full rounded-xl font-bold bg-background h-12" disabled>
                                    Coming Soon
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
