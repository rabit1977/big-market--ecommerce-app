'use client';

import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { motion } from 'framer-motion';
import {
    BadgeCheck,
    CheckCircle2,
    Clock,
    FileCheck2,
    ShieldCheck,
    Star,
    TrendingUp,
    UserCheck,
    Zap
} from 'lucide-react';
import Link from 'next/link';

export default function CertificationHelpPage() {
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
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest mb-6">
                            <ShieldCheck className="w-4 h-4" />
                            Trust & Safety
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
                            Certification & <span className="text-primary">Trust</span> Badge
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                            The "Verified Seller" badge is the highest mark of credibility on Biggest Market. Learn how to verify your identity and build ultimate trust with your buyers.
                        </p>
                    </motion.div>
                </div>
                
                {/* Decorative Background Blob */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            </section>

            <div className="container-wide py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Main Content (Left) */}
                    <div className="lg:col-span-8 space-y-16">
                        
                        {/* 1. What is the Badge */}
                        <section id="overview" className="scroll-mt-24">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <BadgeCheck className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tight">The "Verified Seller" Standard</h2>
                            </div>
                            
                            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                                On Biggest Market, trust is our currency. The Verified Badge indicates that a user has successfully completed our mandatory security screening and has verified their legal identity. This system safeguards our community against fraudulent activity and ensures a professional environment for all.
                            </p>

                            <div className="bg-blue-600/5 border border-blue-600/20 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="font-black text-blue-700 dark:text-blue-400 uppercase text-xs tracking-widest">Global Identification:</h4>
                                        <p className="text-sm text-muted-foreground">Certified users are recognized by the blue verification badge next to their name on every listing and profile interaction.</p>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="font-black text-blue-700 dark:text-blue-400 uppercase text-xs tracking-widest">Enhanced Credibility:</h4>
                                        <p className="text-sm text-muted-foreground">Buyers are 85% more likely to contact and purchase from a seller who carries the Biggest Market trust certification.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. Benefits */}
                        <section id="benefits" className="scroll-mt-24">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-amber-600" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tight">Premium Benefits</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border-border/50 shadow-sm">
                                    <CardContent className="p-6 space-y-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <h4 className="font-bold text-lg">Priority Display</h4>
                                        <p className="text-sm text-muted-foreground">Listings from certified users are prioritized in default search results, ensuring your ads get noticed first.</p>
                                    </CardContent>
                                </Card>
                                <Card className="border-border/50 shadow-sm">
                                    <CardContent className="p-6 space-y-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                            <BadgeCheck className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h4 className="font-bold text-lg">Professional Shop Tools</h4>
                                        <p className="text-sm text-muted-foreground">Unlock advanced seller features, including detailed shop analytics and custom store URLs.</p>
                                    </CardContent>
                                </Card>
                                <Card className="border-border/50 shadow-sm">
                                    <CardContent className="p-6 space-y-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                            <Star className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <h4 className="font-bold text-lg">Increased Ad Limits</h4>
                                        <p className="text-sm text-muted-foreground">Certified users enjoy a higher annual listing quota (up to 100 ads/year) compared to standard profiles.</p>
                                    </CardContent>
                                </Card>
                                <Card className="border-border/50 shadow-sm">
                                    <CardContent className="p-6 space-y-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                            <ShieldCheck className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <h4 className="font-bold text-lg">Enhanced Security</h4>
                                        <p className="text-sm text-muted-foreground">Verified accounts receive priority assistance from our security and dispute resolution specialists.</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                        {/* 3. Steps to Get Certified */}
                        <section id="steps" className="scroll-mt-24">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                    <FileCheck2 className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tight">How to Get Certified</h2>
                            </div>
                            
                            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                                
                                {/* Step 1 */}
                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
                                        <span className="text-sm font-black">01</span>
                                    </div>
                                    <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 shadow-sm border-border/50 group-hover:border-primary/30 transition-all">
                                        <h4 className="font-bold mb-2">Profile Completion</h4>
                                        <p className="text-sm text-muted-foreground">Ensure your profile is complete with a valid functional phone number and your primary residential or business address.</p>
                                    </Card>
                                </div>

                                {/* Step 2 */}
                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
                                        <span className="text-sm font-black">02</span>
                                    </div>
                                    <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 shadow-sm border-border/50 group-hover:border-primary/30 transition-all">
                                        <h4 className="font-bold mb-2">Verification Fee</h4>
                                        <p className="text-sm text-muted-foreground">The annual trust maintenance fee is **98 MKD + VAT** (116 MKD total). This small fee ensures the quality and maintenance of our verified database.</p>
                                    </Card>
                                </div>

                                {/* Step 3 */}
                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
                                        <span className="text-sm font-black">03</span>
                                    </div>
                                    <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 shadow-sm border-border/50 group-hover:border-primary/30 transition-all">
                                        <h4 className="font-bold mb-2">Identity Confirmation</h4>
                                        <p className="text-sm text-muted-foreground">Select your identification method. You can verify via a secure payment or by submitting a professional business verification request.</p>
                                    </Card>
                                </div>

                                {/* Step 4 */}
                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
                                        <span className="text-sm font-black">04</span>
                                    </div>
                                    <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 shadow-sm border-border/50 group-hover:border-primary/30 transition-all">
                                        <h4 className="font-bold mb-2">Badge Activation</h4>
                                        <p className="text-sm text-muted-foreground">Once confirmed, the badge is instantly activated on your profile, appearing on all current and future listings for **one full year**.</p>
                                    </Card>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Quick Actions (Right) */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="sticky top-24 space-y-8">
                            
                            {/* CTA Card */}
                            <div className="bg-primary p-8 rounded-[2.5rem] text-primary-foreground relative overflow-hidden shadow-xl shadow-primary/20">
                                <UserCheck className="w-10 h-10 mb-6" />
                                <h3 className="text-2xl font-black mb-4">Start Verification</h3>
                                <p className="text-primary-foreground/80 text-sm leading-relaxed mb-8">
                                    Ready to join our elite circle of trusted sellers? Complete your verification now and start reaping the benefits.
                                </p>
                                <Button className="w-full bg-white text-primary hover:bg-background font-bold rounded-xl h-12" asChild>
                                    <Link href="/account/verification">Apply for Badge &rarr;</Link>
                                </Button>
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Clock className="w-20 h-20" />
                                </div>
                            </div>

                            {/* Trust FAQ */}
                            <Card className="border-border/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                        Fast Facts
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h5 className="text-xs font-bold uppercase text-muted-foreground mb-1">Duration</h5>
                                        <p className="text-sm font-medium">Valid for 365 days</p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <h5 className="text-xs font-bold uppercase text-muted-foreground mb-1">Ad Limit</h5>
                                        <p className="text-sm font-medium">100 listings included</p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <h5 className="text-xs font-bold uppercase text-muted-foreground mb-1">Maintenance</h5>
                                        <p className="text-sm font-medium">98 MKD + VAT / Year</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Need Help? Box */}
                            <div className="bg-muted/50 rounded-3xl p-8 border border-border/50 text-center">
                                <h4 className="font-black mb-2">Questions?</h4>
                                <p className="text-xs text-muted-foreground mb-6">
                                    Need help with corporate verification or bulk accounts?
                                </p>
                                <Link href="/contact" className="text-xs font-bold text-primary hover:underline">
                                    Contact Support &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
