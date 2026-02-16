'use client';

import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    EyeOff,
    FileEdit,
    KeyRound,
    MailCheck,
    ShieldCheck,
    Trash2,
    Users
} from 'lucide-react';
import Link from 'next/link';

export default function GettingStartedPage() {
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <section className="bg-muted/30 border-b border-border/50 py-12 md:py-16">
                <div className="container-wide">
                    <AppBreadcrumbs className="mb-6" />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-4">
                            Getting Started with <span className="text-primary">Biggest Market</span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            An essential guide for new users to register, manage listings, and navigate our professional marketplace securely.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container-wide py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">
                        
                        {/* Why Register */}
                        <section id="benefits">
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                                <Users className="w-6 h-6 text-primary" />
                                Benefits of Professional Registration
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <BenefitCard 
                                    icon={Users} 
                                    title="Unlimited Management" 
                                    desc="Post and manage as many active listings as your tier allows. Manage all classification data from a single, centralized dashboard."
                                />
                                <BenefitCard 
                                    icon={Clock} 
                                    title="Time-Saving Automation" 
                                    desc="Your personal and contact details are automatically linked to every listing, significantly reducing the time required to post."
                                />
                                <BenefitCard 
                                    icon={MailCheck} 
                                    title="Privacy First" 
                                    desc="Your personal email is never exposed. Potential clients reach you through our secure internal contact system."
                                />
                                <BenefitCard 
                                    icon={ShieldCheck} 
                                    title="Verified Trust" 
                                    desc="A mandatory verification process ensures a higher level of trust between buyers and sellers, minimizing fraud risks."
                                />
                            </div>
                        </section>

                        {/* Powerful Management Tools */}
                        <section id="tools">
                            <h2 className="text-2xl font-black mb-6">Advanced Listing Controls</h2>
                            <div className="space-y-4">
                                <div className="p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-colors group">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <ArrowRight className="w-5 h-5 text-primary group-hover:rotate-[-45deg] transition-transform" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">One-Click Daily Bump</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Keep your listings at the top of search results. With one click, you can refresh the publication date to the current day, making your ad appear as if it was just posted.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-5 rounded-xl border border-border/50 bg-muted/20">
                                        <div className="flex items-center gap-3 mb-2">
                                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                                            <h4 className="font-bold text-sm">Deactivate & Reactivate</h4>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Temporarily hide your ads from the public during negotiations or when out of stock.</p>
                                    </div>
                                    <div className="p-5 rounded-xl border border-border/50 bg-muted/20">
                                        <div className="flex items-center gap-3 mb-2">
                                            <FileEdit className="w-4 h-4 text-muted-foreground" />
                                            <h4 className="font-bold text-sm">Real-time Editing</h4>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Update descriptions, prices, or photos instantly without re-entering all information.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Registration Process */}
                        <section id="registration" className="p-8 md:p-10 rounded-[2rem] bg-muted/30 border border-border/50">
                            <h2 className="text-2xl font-black mb-8">How to Create Your Account</h2>
                            <div className="space-y-8">
                                <Step number="01" title="Complete the Enrollment Form">
                                    Click on <strong>"Register"</strong> on the homepage. Fill in all required fields marked with an asterisk (*). Ensure you provide a valid mobile number and accept our Terms of Service.
                                </Step>
                                <Step number="02" title="Email Verification">
                                    A secure activation link will be sent to your inbox. You must click this link to finalize your membership. Check your SPAM folder if the email does not arrive within minutes.
                                </Step>
                                <Step number="03" title="Profile Verification">
                                    To ensure platform security, all profiles require a mandatory verification. The fee is <strong>98 MKD + VAT</strong> per year (116 MKD total), providing you with a trust badge and 100 free listings annually.
                                </Step>
                            </div>
                            <Button asChild className="mt-10 rounded-full px-8 py-6 h-auto font-black text-lg shadow-xl shadow-primary/20">
                                <Link href="/auth">Register Now <ArrowRight className="ml-2 w-5 h-5" /></Link>
                            </Button>
                        </section>

                        {/* Security */}
                        <section id="security">
                            <div className="p-8 rounded-3xl bg-blue-500/5 border border-blue-500/20">
                                <h2 className="text-xl font-black mb-4 flex items-center gap-3">
                                    <KeyRound className="w-5 h-5 text-blue-500" />
                                    Account Security Best Practices
                                </h2>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-sm text-muted-foreground">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                        <span>Never share your password with anyone, including individuals claiming to represent platform administration.</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-muted-foreground">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                        <span>Use a unique password that you do not use on other websites.</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-muted-foreground">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                        <span>If you suspect unauthorized access, change your password immediately and notify our security team.</span>
                                    </li>
                                </ul>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Quick Links */}
                    <div className="space-y-8">
                        <Card className="rounded-3xl border-border/50 shadow-lg shadow-primary/5">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Quick Navigation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <QuickLink href="#benefits" label="Member Benefits" />
                                <QuickLink href="#tools" label="Management Tools" />
                                <QuickLink href="#registration" label="Step-by-Step Guide" />
                                <QuickLink href="#security" label="Security & Privacy" />
                                <div className="h-px bg-border/50 my-4" />
                                <QuickLink href="/help" label="Back to Help Center" isExternal={false} />
                            </CardContent>
                        </Card>

                        <Card className="rounded-3xl border-primary/20 bg-primary/5">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Support Fee</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-3xl font-black">98</span>
                                    <span className="text-sm font-bold text-muted-foreground">MKD/year</span>
                                    <span className="text-xs text-muted-foreground ml-1">+ VAT</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Mandatory verification for all accounts. Includes 100 listings/year and certified badge.
                                </p>
                                <Button className="w-full mt-6 rounded-xl font-bold" variant="default" asChild>
                                    <Link href="/premium">View Plans</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="p-6 rounded-3xl border border-destructive/20 bg-destructive/5">
                            <h4 className="text-sm font-bold text-destructive mb-2 flex items-center gap-2">
                                <Trash2 className="w-4 h-4" />
                                Close Account
                            </h4>
                            <p className="text-xs text-muted-foreground mb-4">
                                To permanently delete your account, visit "Edit Profile" in your dashboard and follow the removal link.
                            </p>
                            <Link href="/account" className="text-xs font-bold underline hover:text-destructive transition-colors">Go to Settings</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BenefitCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-6 rounded-2xl border border-border/50 bg-background hover:shadow-md transition-all">
            <Icon className="w-5 h-5 text-primary mb-4" />
            <h3 className="font-bold text-sm mb-2">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
        </div>
    );
}

function Step({ number, title, children }: { number: string, title: string, children: React.ReactNode }) {
    return (
        <div className="flex gap-6">
            <div className="text-3xl font-black text-primary/20 shrink-0 leading-none">{number}</div>
            <div>
                <h4 className="font-bold text-lg mb-2">{title}</h4>
                <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
            </div>
        </div>
    );
}

function QuickLink({ href, label, isExternal = false }: { href: string, label: string, isExternal?: boolean }) {
    return (
        <Link 
            href={href} 
            className="flex items-center justify-between py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all group"
        >
            <span>{label}</span>
            <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-black" />
        </Link>
    );
}
