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
                            Getting Started with <span className="text-primary">Biggest Market</span><br/>
                            <span className="text-xl md:text-3xl text-muted-foreground uppercase tracking-wider block mt-2">Започнете со <span className="text-primary/80">Biggest Market</span></span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            An essential guide for new users to register, manage listings, and navigate our professional marketplace securely.
                        </p>
                        <p className="text-base text-muted-foreground/80 mt-2">
                            Основен водич за нови корисници за регистрација, управување со огласи и безбедно навигирање низ нашиот професионален пазар.
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
                            <h2 className="text-2xl font-black mb-6 flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                                <div className="flex items-center gap-3">
                                    <Users className="w-6 h-6 text-primary" />
                                    Benefits of Registration
                                </div>
                                <span className="text-muted-foreground font-bold text-lg hidden md:inline">/</span>
                                <span className="text-muted-foreground font-bold text-lg">Придобивки од регистрација</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <BenefitCard 
                                    icon={Users} 
                                    title="Unlimited Management / Неограничено управување" 
                                    desc="Post and manage as many active listings as your tier allows. / Објавувајте и управувајте со онолку активни огласи колку што ви дозволува нивото."
                                />
                                <BenefitCard 
                                    icon={Clock} 
                                    title="Time-Saving Automation / Автоматизација која штеди време" 
                                    desc="Your personal and contact details are automatically linked to every listing. / Вашите лични податоци и податоци за контакт автоматски се поврзуваат со секој оглас."
                                />
                                <BenefitCard 
                                    icon={MailCheck} 
                                    title="Privacy First / Приватноста на прво место" 
                                    desc="Your personal email is never exposed. Clients reach you through security. / Вашата лична е-пошта никогаш не е изложена. Клиентите ве контактираат безбедно."
                                />
                                <BenefitCard 
                                    icon={ShieldCheck} 
                                    title="Verified Trust / Потврдена доверба" 
                                    desc="A mandatory verification process ensures a higher level of trust. / Задолжителниот процес за верификација обезбедува повисоко ниво на доверба."
                                />
                            </div>
                        </section>

                        {/* Powerful Management Tools */}
                        <section id="tools">
                            <h2 className="text-2xl font-black mb-6 flex flex-col md:flex-row md:items-center gap-2">
                                Advanced Listing Controls 
                                <span className="text-muted-foreground text-lg font-bold">/ Напредни контроли за огласи</span>
                            </h2>
                            <div className="space-y-4">
                                <div className="p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-colors group">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <ArrowRight className="w-5 h-5 text-primary group-hover:rotate-[-45deg] transition-transform" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">One-Click Daily Bump / Дневно освежување со еден клик</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Keep your listings at the top of search results. With one click, you can refresh the publication date. <br/><br/>
                                                <span className="text-muted-foreground/80">Држете ги вашите огласи на врвот на резултатите од пребарувањето. Со еден клик можете да го освежите датумот на објавување.</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-5 rounded-xl border border-border/50 bg-muted/20">
                                        <div className="flex items-center gap-3 mb-2">
                                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                                            <h4 className="font-bold text-sm">Deactivate & Reactivate<br/><span className="text-muted-foreground text-xs uppercase">Деактивирај и реактивирај</span></h4>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Temporarily hide your ads from the public during negotiations or when out of stock. <br/><span className="mt-2 block opacity-80">Привремено сокријте ги вашите огласи од јавноста за време на преговори или кога немате на залиха.</span></p>
                                    </div>
                                    <div className="p-5 rounded-xl border border-border/50 bg-muted/20">
                                        <div className="flex items-center gap-3 mb-2">
                                            <FileEdit className="w-4 h-4 text-muted-foreground" />
                                            <h4 className="font-bold text-sm">Real-time Editing<br/><span className="text-muted-foreground text-xs uppercase">Уредување во реално време</span></h4>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Update descriptions, prices, or photos instantly without re-entering all information. <br/><span className="mt-2 block opacity-80">Веднаш ажурирајте ги описите, цените или фотографиите без повторно внесување на сите информации.</span></p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Registration Process */}
                        <section id="registration" className="p-8 md:p-10 rounded-[2rem] bg-muted/30 border border-border/50">
                            <h2 className="text-2xl font-black mb-8 flex flex-col gap-1">
                                How to Create Your Account
                                <span className="text-muted-foreground text-lg uppercase font-bold tracking-wider">Како да креирате сметка</span>
                            </h2>
                            <div className="space-y-8">
                                <Step number="01" title="Complete the Enrollment Form / Пополнете ја формата за регистрација">
                                    Click on <strong>"Register"</strong> on the homepage. Fill in all required fields marked with an asterisk (*). Ensure you provide a valid mobile number and accept our Terms of Service.
                                    <div className="mt-2 text-muted-foreground/80">Кликнете на <strong>"Регистрирај се"</strong> на почетната страница. Пополнете ги сите полиња означени со ѕвездичка (*). Осигурајте се дека сте внеле валиден мобилен број.</div>
                                </Step>
                                <Step number="02" title="Email Verification / Верификација преку е-пошта">
                                    A secure activation link will be sent to your inbox. You must click this link to finalize your membership. Check your SPAM folder if the email does not arrive within minutes.
                                    <div className="mt-2 text-muted-foreground/80">Безбедна врска за активација ќе биде испратена до вашето сандаче. Мора да кликнете на оваа врска за да го финализирате вашето членство.</div>
                                </Step>
                                <Step number="03" title="Profile Verification / Проверка на профилот">
                                    To ensure platform security, all profiles require a mandatory verification. The fee is <strong>98 MKD + VAT</strong> per year (116 MKD total), providing you with a trust badge and 100 free listings annually.
                                    <div className="mt-2 text-muted-foreground/80">За да се осигура безбедноста на платформата, сите профили бараат задолжителна верификација. Надоместот е <strong>98 МКД + ДДВ</strong> годишно.</div>
                                </Step>
                            </div>
                            <Button asChild className="mt-10 rounded-full px-8 py-6 h-auto font-black text-lg shadow-xl shadow-primary/20">
                                <Link href="/auth">Register Now / Регистрирајте се <ArrowRight className="ml-2 w-5 h-5" /></Link>
                            </Button>
                        </section>

                        {/* Security */}
                        <section id="security">
                            <div className="p-8 rounded-3xl bg-blue-500/5 border border-blue-500/20">
                                <h2 className="text-xl font-black mb-4 flex items-start gap-3 flex-col md:flex-row md:items-center">
                                    <div className="flex items-center gap-3">
                                        <KeyRound className="w-5 h-5 text-blue-500" />
                                        Account Security
                                    </div>
                                    <span className="text-muted-foreground font-bold text-sm uppercase md:ml-auto">Безбедност на сметката</span>
                                </h2>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-sm text-muted-foreground flex-col md:flex-row md:items-start pl-7 md:pl-0 relative">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5 absolute left-0 md:relative md:left-auto" />
                                        <span>Never share your password with anyone, including individuals claiming to represent platform administration.<br/><span className="text-xs uppercase text-blue-500/80 mt-1 block font-bold">Никогаш не споделувајте ја вашата лозинка со никого.</span></span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-muted-foreground flex-col md:flex-row md:items-start pl-7 md:pl-0 relative">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5 absolute left-0 md:relative md:left-auto" />
                                        <span>Use a unique password that you do not use on other websites.<br/><span className="text-xs uppercase text-blue-500/80 mt-1 block font-bold">Користете единствена лозинка која не ја користите на други веб-страници.</span></span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-muted-foreground flex-col md:flex-row md:items-start pl-7 md:pl-0 relative">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5 absolute left-0 md:relative md:left-auto" />
                                        <span>If you suspect unauthorized access, change your password immediately and notify our security team.<br/><span className="text-xs uppercase text-blue-500/80 mt-1 block font-bold">Ако се сомневате во неовластен пристап, променете ја лозинката веднаш.</span></span>
                                    </li>
                                </ul>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Quick Links */}
                    <div className="space-y-8">
                        <Card className="rounded-3xl border-border/50 shadow-lg shadow-primary/5">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Quick Navigation / Брза навигација</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <QuickLink href="#benefits" label="Member Benefits / Придобивки" />
                                <QuickLink href="#tools" label="Management Tools / Алатки" />
                                <QuickLink href="#registration" label="Step-by-Step / Чекор-по-чекор" />
                                <QuickLink href="#security" label="Security & Privacy / Безбедност" />
                                <div className="h-px bg-border/50 my-4" />
                                <QuickLink href="/help" label="Back to Help Center / Назад во Центар за помош" isExternal={false} />
                            </CardContent>
                        </Card>

                        <Card className="rounded-3xl border-primary/20 bg-primary/5">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Support Fee / Надомест за поддршка</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-3xl font-black">98</span>
                                    <span className="text-sm font-bold text-muted-foreground">MKD/year (год)</span>
                                    <span className="text-xs text-muted-foreground ml-1">+ VAT (ДДВ)</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Mandatory verification for all accounts. Includes 100 listings/year and certified badge. <br/><span className="mt-1 block opacity-80">Задолжителна верификација за сите сметки. Вклучува 100 огласи годишно.</span>
                                </p>
                                <Button className="w-full mt-6 rounded-xl font-bold" variant="default" asChild>
                                    <Link href="/premium">View Plans / Види планови</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="p-6 rounded-3xl border border-destructive/20 bg-destructive/5">
                            <h4 className="text-sm font-bold text-destructive mb-2 flex items-center gap-2">
                                <Trash2 className="w-4 h-4" />
                                Close Account / Затвори сметка
                            </h4>
                            <p className="text-xs text-muted-foreground mb-4">
                                To permanently delete your account, visit "Edit Profile" in your dashboard and follow the removal link. <br/><span className="mt-1 block opacity-80">За трајно бришење на вашата сметка, посетете "Уреди профил" во вашата контролна табла.</span>
                            </p>
                            <Link href="/account" className="text-xs font-bold underline hover:text-destructive transition-colors">Go to Settings / Поставки</Link>
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
