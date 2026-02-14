'use client';

import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle2,
    Flag,
    Handshake,
    Lock,
    MailWarning,
    MessageSquareOff,
    ShieldAlert,
    ShieldCheck,
    ShieldHalf,
    UserX
} from 'lucide-react';
import Link from 'next/link';

export default function SafetySecurityHelpPage() {
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
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-widest mb-6">
                            <ShieldAlert className="w-4 h-4" />
                            Security Protocol
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
                            Safety & <span className="text-primary">Security</span> Center
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                            At Big Market, your security is our fundamental priority. Learn how to protect your data, trade with integrity, and identify suspicious activity.
                        </p>
                    </motion.div>
                </div>
                
                {/* Decorative Background Blob */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            </section>

            <div className="container-wide py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Main Content (Left) */}
                    <div className="lg:col-span-8 space-y-16">
                        
                        {/* 1. General Principles */}
                        <section id="principles" className="scroll-mt-24">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tight">Trading Integrity</h2>
                            </div>
                            
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-lg text-muted-foreground mb-8">
                                    Successful classifieds trading is built on mutual trust. We implement advanced verification systems, but individual vigilance remains the most effective defense against fraud.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border-border/50 shadow-sm">
                                    <CardHeader className="pb-2">
                                        <Handshake className="w-6 h-6 text-primary mb-2" />
                                        <CardTitle className="text-lg">In-Person Verification</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground">
                                        Whenever possible, inspect the item in person before completing the transaction. Meet in well-lit, public locations (e.g., shopping centers, cafes) during daylight hours.
                                    </CardContent>
                                </Card>
                                <Card className="border-border/50 shadow-sm">
                                    <CardHeader className="pb-2">
                                        <Lock className="w-6 h-6 text-primary mb-2" />
                                        <CardTitle className="text-lg">Secure Communication</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground">
                                        Utilize Big Market's internal messaging system for initial contact. Fraudsters often attempt to move conversations to unmonitored platforms like WhatsApp early on.
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                        {/* 2. Avoiding Common Scams */}
                        <section id="scams" className="scroll-mt-24">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tight">Avoiding Common Scams</h2>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="p-8 rounded-[2rem] border border-red-500/20 bg-red-500/5">
                                    <h4 className="font-black text-red-700 dark:text-red-400 mb-6 flex items-center gap-2">
                                        <MailWarning className="w-5 h-5" /> Phishing & External Links
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                                        Be extremely cautious of links sent via SMS or messaging apps claiming to be from Big Market for "Payment Verification" or "Shipping Labels". Big Market will **never** ask for your credit card details via a third-party link.
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3 p-4 bg-background rounded-2xl border border-red-500/10">
                                            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                                <UserX className="w-3.5 h-3.5 text-red-600" />
                                            </div>
                                            <div className="space-y-1">
                                                <h5 className="text-sm font-bold">Fake Buyer Scam</h5>
                                                <p className="text-xs text-muted-foreground italic">"I'll pay via courier link, just enter your card info..."</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 bg-background rounded-2xl border border-red-500/10">
                                            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                                <MessageSquareOff className="w-3.5 h-3.5 text-red-600" />
                                            </div>
                                            <div className="space-y-1">
                                                <h5 className="text-sm font-bold">Overpayment Scam</h5>
                                                <p className="text-xs text-muted-foreground italic">"I accidentally sent extra money, please refund it..."</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Reporting Suspicious Activity */}
                        <section id="report" className="scroll-mt-24">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-slate-900/10 flex items-center justify-center">
                                    <Flag className="w-6 h-6 text-slate-900" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tight">Reporting & Moderation</h2>
                            </div>
                            
                            <div className="bg-card border border-border/50 rounded-[2rem] p-8 md:p-12 shadow-sm">
                                <p className="text-muted-foreground leading-relaxed mb-8">
                                    Our moderation team proactively monitors for fraudulent behavior, but user reports are essential for maintaining a clean marketplace. If you encounter a suspicious listing or a problematic user, please act immediately.
                                </p>
                                
                                <div className="space-y-8">
                                    <div className="flex gap-6">
                                        <div className="text-2xl font-black text-primary/20 shrink-0">01</div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold">Use the "Report" Button</h4>
                                            <p className="text-sm text-muted-foreground">Every listing has a dedicated report flag. Use this for incorrect categories, prohibited items, or suspicious pricing.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="text-2xl font-black text-primary/20 shrink-0">02</div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold">Contact Security Directly</h4>
                                            <p className="text-sm text-muted-foreground">For urgent security breaches or account theft, email our dedicated response team at **abuse@bigmarket.com**.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="text-2xl font-black text-primary/20 shrink-0">03</div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold">Preserve Evidence</h4>
                                            <p className="text-sm text-muted-foreground">Take screenshots of conversations or listed items before reporting, as this assists our specialists in rapid verification.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Trust Assets (Right) */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="sticky top-24 space-y-8">
                            
                            {/* Verified Badge info */}
                            <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
                                <ShieldCheck className="w-10 h-10 text-primary mb-6" />
                                <h3 className="text-2xl font-black mb-4">The Trust Standard</h3>
                                <p className="text-sm text-slate-400 leading-relaxed mb-8">
                                    Look for the **Verified Badge** on user profiles. This indicates the user has undergone identity verification and maintains a professional history on Big Market.
                                </p>
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-12" asChild>
                                    <Link href="/account/verification">Get Verified</Link>
                                </Button>
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <ShieldHalf className="w-20 h-20" />
                                </div>
                            </div>

                            {/* Safe Payment Box */}
                            <Card className="border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        Safe Payments
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Big Market recommends cash-on-delivery or in-person bank transfers only after item inspection.
                                    </p>
                                    <Separator className="bg-emerald-500/10" />
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            Avoid upfront deposits
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            Ignore Western Union requests
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Emergency Contact */}
                            <div className="bg-muted/50 rounded-3xl p-8 border border-border/50">
                                <h4 className="font-bold mb-4 flex items-center gap-2 uppercase text-[10px] tracking-widest text-muted-foreground">
                                    <ShieldAlert className="w-3 h-3" />
                                    Emergency
                                </h4>
                                <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                                    If you feel you have been a victim of a crime, please contact your local police department immediately.
                                </p>
                                <Link href="/contact" className="text-xs font-bold text-primary hover:underline">
                                    Technical Support &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
