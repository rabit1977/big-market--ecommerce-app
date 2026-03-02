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
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function SafetySecurityHelpPage() {
    const locale = useLocale();
    const isMk = locale === 'mk';

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
                            {isMk ? 'Безбедносен Протокол' : 'Security Protocol'}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
                            {isMk ? 'Центар за ' : 'Safety & '} <span className="text-primary">{isMk ? 'Безбедност' : 'Security'}</span> {isMk ? ' и Сигурност' : ' Center'}
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                            {isMk 
                                ? 'На Biggest Market, вашата безбедност е наш основен приоритет. Дознајте како да ги заштитите вашите податоци, да тргувате со интегритет и да идентификувате сомнителна активност.'
                                : 'At Biggest Market, your security is our fundamental priority. Learn how to protect your data, trade with integrity, and identify suspicious activity.'}
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
                                <h2 className="text-3xl font-black tracking-tight flex flex-col gap-1">
                                    {isMk ? 'Интегритет во тргувањето' : 'Trading Integrity'}
                                </h2>
                            </div>
                            
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-lg text-muted-foreground mb-8">
                                    {isMk 
                                        ? 'Успешното тргување преку огласи се гради на заемна доверба. Спроведуваме напредни системи за верификација, но индивидуалната будност останува најефективната одбрана од измами.' 
                                        : 'Successful classifieds trading is built on mutual trust. We implement advanced verification systems, but individual vigilance remains the most effective defense against fraud.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border-border/50 shadow-sm hover:border-primary/30 transition-colors">
                                    <CardHeader className="pb-2">
                                        <Handshake className="w-6 h-6 text-primary mb-2" />
                                        <CardTitle className="text-lg">{isMk ? 'Верификација во живо' : 'In-Person Verification'}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground">
                                        {isMk ? 'Секогаш кога е можно, проверете го предметот лично пред да ја завршите трансакцијата. Секогаш среќавајте се на добро осветлени, јавни локации за време на дневните часови.' : 'Whenever possible, inspect the item in person before completing the transaction. Meet in well-lit, public locations (e.g., shopping centers, cafes) during daylight hours.'}
                                    </CardContent>
                                </Card>
                                <Card className="border-border/50 shadow-sm hover:border-primary/30 transition-colors">
                                    <CardHeader className="pb-2">
                                        <Lock className="w-6 h-6 text-primary mb-2" />
                                        <CardTitle className="text-lg">{isMk ? 'Безбедна Комуникација' : 'Secure Communication'}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground">
                                        {isMk ? 'Користете го наменскиот систем за пораки на Biggest Market за првичен контакт. Измамниците често се обидуваат да ги пренесат разговорите на други платформи како WhatsApp рано во комуникацијата.' : 'Utilize Biggest Market\'s internal messaging system for initial contact. Fraudsters often attempt to move conversations to unmonitored platforms like WhatsApp early on.'}
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
                                <h2 className="text-3xl font-black tracking-tight flex flex-col gap-1">
                                    {isMk ? 'Избегнување на вообичаени измами' : 'Avoiding Common Scams'}
                                </h2>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="p-8 rounded-[2rem] border border-red-500/20 bg-red-500/5">
                                    <h4 className="font-black text-red-700 dark:text-red-400 mb-6 flex items-center gap-2 flex-wrap">
                                        <MailWarning className="w-5 h-5" /> {isMk ? 'Фишинг и надворешни линкови' : 'Phishing & External Links'}
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                                        {isMk 
                                            ? 'Бидете исклучително внимателни за линкови испратени преку СМС или апликации за пораки кои тврдат дека се од Biggest Market. Biggest Market НИКОГАШ нема да ги побара вашите податоци за картичка преку надворешен линк.' 
                                            : 'Be extremely cautious of links sent via SMS or messaging apps claiming to be from Biggest Market for "Payment Verification" or "Shipping Labels". Biggest Market will **never** ask for your credit card details via a third-party link.'}
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3 p-4 bg-background rounded-2xl border border-red-500/10">
                                            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                                <UserX className="w-3.5 h-3.5 text-red-600" />
                                            </div>
                                            <div className="space-y-1">
                                                <h5 className="text-sm font-bold">{isMk ? 'Лажен купувач' : 'Fake Buyer Scam'}</h5>
                                                <p className="text-xs text-muted-foreground italic">"{isMk ? 'Ќе платам преку линк за курир...' : 'I\'ll pay via courier link...'}"</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 bg-background rounded-2xl border border-red-500/10">
                                            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                                <MessageSquareOff className="w-3.5 h-3.5 text-red-600" />
                                            </div>
                                            <div className="space-y-1">
                                                <h5 className="text-sm font-bold">{isMk ? 'Преплатување' : 'Overpayment Scam'}</h5>
                                                <p className="text-xs text-muted-foreground italic">"{isMk ? 'Случајно испратив повеќе пари...' : 'I accidentally sent extra money...'}"</p>
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
                                <h2 className="text-3xl font-black tracking-tight flex flex-col gap-1">
                                    {isMk ? 'Пријавување и Модерирање' : 'Reporting & Moderation'}
                                </h2>
                            </div>
                            
                            <div className="bg-card border border-border/50 rounded-[2rem] p-8 md:p-12 shadow-sm">
                                <p className="text-muted-foreground leading-relaxed mb-8">
                                    {isMk 
                                        ? 'Нашиот тим за модерација проактивно следи однесување за измама, но извештаите од корисниците се од суштинско значење за одржување на чист пазар. Доколку наидете на сомнителен оглас или проблематичен корисник, ве молиме дејствувајте веднаш.' 
                                        : 'Our moderation team proactively monitors for fraudulent behavior, but user reports are essential for maintaining a clean marketplace. If you encounter a suspicious listing or a problematic user, please act immediately.'}
                                </p>
                                
                                <div className="space-y-8">
                                    <div className="flex gap-6">
                                        <div className="text-2xl font-black text-primary/20 shrink-0">01</div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold">{isMk ? 'Користете го копчето "Пријави"' : 'Use the "Report" Button'}</h4>
                                            <p className="text-sm text-muted-foreground">{isMk ? 'Секој оглас има посебно знаменце за пријавување. Користете го ова за неточни категории, забранети предмети или сомнителни цени.' : 'Every listing has a dedicated report flag. Use this for incorrect categories, prohibited items, or suspicious pricing.'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="text-2xl font-black text-primary/20 shrink-0">02</div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold">{isMk ? 'Контактирајте нè Директно' : 'Contact Security Directly'}</h4>
                                            <p className="text-sm text-muted-foreground">{isMk ? 'За итни безбедносни прекршувања или кражба на сметка, испратете е-пошта до нашиот тим за одговор на abuse@bigmarket.com.' : 'For urgent security breaches or account theft, email our dedicated response team at abuse@bigmarket.com.'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="text-2xl font-black text-primary/20 shrink-0">03</div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold">{isMk ? 'Зачувајте Докази' : 'Preserve Evidence'}</h4>
                                            <p className="text-sm text-muted-foreground">{isMk ? 'Направете слики од екранот од разговорите или наведените ставки пред да пријавите, бидејќи тоа им помага на нашите специјалисти во брзата верификација.' : 'Take screenshots of conversations or listed items before reporting, as this assists our specialists in rapid verification.'}</p>
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
                                <h3 className="text-2xl font-black mb-4">{isMk ? 'Стандард за Доверба' : 'The Trust Standard'}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed mb-8">
                                    {isMk ? 'Побарајте ја Значката за верификација на корисничките профили. Ова покажува дека корисникот поминал преку верификација и одржува професионална историја на Biggest Market.' : 'Look for the **Verified Badge** on user profiles. This indicates the user has undergone identity verification and maintains a professional history on Biggest Market.'}
                                </p>
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-12" asChild>
                                    <Link href="/account/verification">{isMk ? 'Верифицирајте се' : 'Get Verified'}</Link>
                                </Button>
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <ShieldHalf className="w-20 h-20" />
                                </div>
                            </div>

                            {/* Safe Payment Box */}
                            <Card className="border-emerald-500/20 shadow-lg shadow-emerald-500/5 hover:border-emerald-500/40 transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-lg flex flex-col gap-1 text-emerald-600">
                                        <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> {isMk ? 'Безбедни плаќања' : 'Safe Payments'}</div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        {isMk ? 'Biggest Market препорачува плаќање при достава или банкарски трансфери во живо откако ќе го разгледате предметот.' : 'Biggest Market recommends cash-on-delivery or in-person bank transfers only after item inspection.'}
                                    </p>
                                    <Separator className="bg-emerald-500/10" />
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span>{isMk ? 'Избегнувајте депозити однапред' : 'Avoid upfront deposits'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span>{isMk ? 'Игнорирајте барања преку Western Union' : 'Ignore Western Union requests'}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Emergency Contact */}
                            <div className="bg-muted/50 rounded-3xl p-8 border border-border/50">
                                <h4 className="font-bold mb-4 flex items-center gap-2 uppercase text-[10px] tracking-widest text-muted-foreground">
                                    <ShieldAlert className="w-3 h-3 text-red-500" />
                                    {isMk ? 'Итност' : 'Emergency'}
                                </h4>
                                <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                                    {isMk ? 'Ако чувствувате дека сте биле жртва на кривично дело, ве молиме веднаш контактирајте го вашиот локален полициски оддел.' : 'If you feel you have been a victim of a crime, please contact your local police department immediately.'}
                                </p>
                                <Link href="/contact" className="text-xs font-bold text-primary hover:underline">
                                    {isMk ? 'Техничка Поддршка' : 'Technical Support'} &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
